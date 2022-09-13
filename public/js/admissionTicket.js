function init() {
    var curWeek;
    var dateOfWeek;
    var dateOfWeek_Chi;

    var curUser;

    firebase.auth().onAuthStateChanged(user => {
        curUser = user;

        //先驗證是否在入場時間
        var current = new Date();//獲取當前時間
        const startTime = new Date(1975, 8, 19, 17, 25, 00);
        const endTime = new Date(1975, 8, 19, 17, 35, 00);

        var curYear = current.getFullYear();
        var curMonth = current.getMonth();
        var curDate = current.getDate();
        startTime.setFullYear(curYear);
        endTime.setFullYear(curYear);
        startTime.setMonth(curMonth);
        endTime.setMonth(curMonth);
        startTime.setDate(curDate);
        endTime.setDate(curDate);

        // console.log(current);
        // console.log(startTime);
        // console.log(endTime);

        if (startTime <= current /*&& current <= endTime*/) {
            // 已經確認是在有效時間之內
            // 只是簡單判斷「確實是在當天的17:25分以後」，但是！！沒有！！判斷日期！！
            // 可以真正開始身分驗證

            if (curUser) {
                firebase.database().ref('users/' + curUser.uid + '/admin').once("value").then(snapShot => {
                    if (snapShot.val() != 'Y') {
                        document.getElementById('verifying').innerHTML = "";
                        document.getElementById('verificationFailed').innerHTML = "您的帳號不具有幹部身分";

                        document.getElementById('statusImg').src = "img/noMark.gif";
                    }
                    else {
                        document.getElementById('verifying').innerHTML = "已確認本帳號具有驗證的身分，正在驗證中";

                        var info = window.location.search.replace("?", "").split("&");
                        // console.log(info);
                        var UIDtoBeVerified = info[0].replace("UID=", "");
                        //var dayOfTheWeek = info[1].replace("Date=", "");//從資料庫裡面取會比較保險

                        firebase.database().ref('curWeek').once("value").then(snapShot => {
                            curWeek = snapShot.val();
                        }).then(() => {
                            firebase.database().ref('QRCodeInfo/curDateOfWeek').once("value").then(snapShot => {
                                if (snapShot.val() == 'Mon') {
                                    dateOfWeek = 'Yi';
                                    dateOfWeek_Chi = '一';
                                }
                                else if (snapShot.val() == 'Wed') {
                                    dateOfWeek = 'San';
                                    dateOfWeek_Chi = '二';
                                }
                                else if (snapShot.val() == 'Fri') {
                                    dateOfWeek = 'Wu';
                                    dateOfWeek_Chi = '五';
                                }
                                else {
                                    dateOfWeek = 'NaN';
                                    dateOfWeek_Chi = 'NaN';
                                }
                            }).then(() => {
                                // console.log(curWeek);
                                // console.log(dateOfWeek);
                                // console.log(UIDtoBeVerified);

                                if (dateOfWeek == 'NaN') {
                                    document.getElementById('verifying').innerHTML = "";
                                    document.getElementById('verificationFailed').innerHTML = "請先啟用<br>驗票功能";

                                    document.getElementById('statusImg').src = "img/noMark.gif";
                                }
                                else {
                                    var UIDtoBeVerifiedRef = firebase.database().ref('weeks/' + curWeek + '/' + dateOfWeek + '/AttendanceList/' + UIDtoBeVerified);

                                    UIDtoBeVerifiedRef.once("value").then(snapShot => {
                                        // console.log(snapShot.val());

                                        if (snapShot.val() == 'N' || snapShot.val() == null) {
                                            document.getElementById('verifying').innerHTML = "";
                                            document.getElementById('verificationFailed').innerHTML = "沒有預約<br>不得入場";

                                            document.getElementById('statusImg').src = "img/noMark.gif";
                                        }
                                        else if (snapShot.val() == 'Y') {
                                            var curTime = getDateTimeStr();

                                            // console.log(curTime);
                                            // console.log(dateOfWeek);
                                            // console.log("Verified @ " + curTime);
                                            // console.log('users/' + curUser.uid + '/YiSanWu/' + dateOfWeek);

                                            UIDtoBeVerifiedRef.set("Verified @ " + curTime).then(() => {

                                                var VerifiedOKedUIDPushingRecordRef = firebase.database().ref('users/' + UIDtoBeVerified + '/Record');
                                                var recToPush = '入場紀錄：' + curTime + '由' + curUser.displayName + '掃描QRCode驗票入場。驗票場次：第' + curWeek + '週的週' + dateOfWeek_Chi + '。';
                                                VerifiedOKedUIDPushingRecordRef.push(recToPush).then(() => {
                                                    var dateStr = curTime.split(" ")[0];
                                                    var timeStr = curTime.split(" ")[1];

                                                    document.getElementById('verifying').innerHTML = "";
                                                    document.getElementById('verificationOKed').innerHTML = "可以入場<br>入場時間<br>" + dateStr + "<br>" + timeStr;

                                                    document.getElementById('statusImg').src = "img/checkMark.gif";
                                                });
                                            });
                                        }
                                        else {
                                            var prevAdmissionTime = snapShot.val().split(" ");
                                            var denyingStr = "入場過了<br>上次入場<br>" + prevAdmissionTime[2] + "<br>" + prevAdmissionTime[3];

                                            document.getElementById('verifying').innerHTML = "";
                                            document.getElementById('verificationFailed').innerHTML = denyingStr;

                                            document.getElementById('statusImg').src = "img/noMark.gif";
                                        }
                                    });
                                }
                            });
                        });
                    }
                });
            }
            else {
                document.getElementById('verifying').innerHTML = "";
                document.getElementById('verificationFailed').innerHTML = "請先在網頁系統登入幹部帳號，再開始掃描QRCode";

                document.getElementById('statusImg').src = "img/noMark.gif";
            }
        }

        else {
            document.getElementById('verifying').innerHTML = "";
            document.getElementById('verificationFailed').innerHTML = "現在並非<br>入場時間";

            document.getElementById('statusImg').src = "img/noMark.gif";
        }

    });
}

window.onload = function () {
    init();
};


function getDateTimeStr() {
    var current = new Date();
    var curTime = current.getFullYear() + '/';
    curTime += (((current.getMonth() + 1) < 10) ? ("0" + (current.getMonth() + 1)) : ((current.getMonth() + 1))) + '/';
    curTime += ((current.getDate() < 10) ? ("0" + current.getDate()) : (current.getDate())) + ' ';
    curTime += ((current.getHours() < 10) ? ("0" + current.getHours()) : (current.getHours())) + ':';
    curTime += ((current.getMinutes() < 10) ? ("0" + current.getMinutes()) : (current.getMinutes())) + ':';
    curTime += ((current.getSeconds() < 10) ? ("0" + current.getSeconds()) : (current.getSeconds()));

    return curTime;
}