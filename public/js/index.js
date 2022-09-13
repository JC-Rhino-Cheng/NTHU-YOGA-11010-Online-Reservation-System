function init() {
    var btnRevSys = document.getElementById('resSys');
    btnRevSys.addEventListener('click', () => {
        changeToResSys();
    });
    var btnBulletinBoard = document.getElementById('bulletinBoard');
    btnBulletinBoard.addEventListener('click', () => {
        changeToBulletinBoard();
    });


    document.getElementById("QuotaStatus").innerHTML = "";
    document.getElementById("resInfosAndButtons").innerHTML = "";

    document.getElementById("attendanceList").innerHTML = "";
    document.getElementById("recList").innerHTML = "";
    document.getElementById("announceList").innerHTML = "";
    document.getElementById("announceBox").innerHTML = "";
    // document.getElementById("recOrAnnouncementBlock").innerHTML = ""; //上面四個東西的總框框

    document.getElementById("dynamic-menu-adminUse1").innerHTML = '<a class="dropdown-item room text-muted text-right small" id="GuestMode">您不是幹部唷！</a>';
    document.getElementById("dynamic-menu-adminUse2").innerHTML = '<a class="dropdown-item room text-muted text-right small" id="GuestMode">您不是幹部唷！</a>';




    firebase.auth().onAuthStateChanged(function (user) {
        var menu_account = document.getElementById('dynamic-menu-account');
        var menu_chatroom = document.getElementById("dynamic-menu-chatroom");
        var menu_adminUse_little = document.getElementById("dynamic-menu-adminUse1");
        var menu_adminUse_big = document.getElementById("dynamic-menu-adminUse2");
        // Check user login
        if (user) {
            showQRCode();
            document.getElementById('refreshBtn').innerHTML = '<button type="button" class="btn btn-dark" id="forceToRefresh1">強制重新整理(方法一)</button><br><br><button type="button" class="btn btn-dark" id="forceToRefresh2">強制重新整理(方法二)</button>';
            var btnForceToRefresh1 = document.getElementById('forceToRefresh1');
            var btnForceToRefresh2 = document.getElementById('forceToRefresh2');
            btnForceToRefresh1.addEventListener('click', () => {
                forceToRefresh("method1");
            });
            btnForceToRefresh2.addEventListener('click', () => {
                forceToRefresh("method2");
            });



            console.log("The logged in user is: " + user.displayName + " with UID: " + user.uid);
            menu_account.innerHTML = "<span class='dropdown-item'>" + user.email + "</span><span class='dropdown-item text-muted text-right small' onclick='copyUID()'>UID: " + user.uid + "</span><div class='dropdown-divider'></div><span class='dropdown-item' id='logout-btn'>登出</span>";


            //===========================================================================
            //↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓
            {/* <span class='dropdown-item text-muted text-right small'>您不是幹部唷！</span> */ }
            //只有幹部們才看得到選單
            var memRef = firebase.database().ref('users/' + user.uid + '/admin');
            memRef.once("value").then((snapShot) => {
                var menu_adminUse_little_str = '<span class="dropdown-item text-right" id="sysLog">系統日誌</span><span class="dropdown-item text-right" id="accountsList">帳號名冊</span><span class="dropdown-item text-right" id="showMonQR">開始週一驗票</span><span class="dropdown-item text-right" id="showWedQR">開始週二驗票</span><span class="dropdown-item text-right" id="showFriQR">開始週五驗票</span><span class="dropdown-item text-right" id="closeGate">結束驗票</span>';

                var menu_adminUse_big_QRCode_str = '<span class="dropdown-item text-right" id="QRCodeColourPicker">QRCode背景色<input type="color" id="QRCodeBackgroundColour" name="QRCodeBackgroundColour" value="#FFFFFF">QRCode主體色<input type="color" id="QRCodeMainColour" name="QRCodeMainColour" value="#000000"></span>';
                var menu_adminUse_big_JiaZhi_str = '<form class="dropdown-item form btn-sm btn-block"><input class="form-control btn-sm btn-block" type="search" placeholder="欲加值的帳號Email" aria-label="Email" id="JiaZhiEmail" value=""><input class="form-control btn-sm btn-block" type="search" placeholder="加值多少堂課" aria-label="howMuch" id="howMuch" value=""><button class="btn btn-outline-success btn-sm btn-block" type="button" id="creditAccount" onclick="Email_JiaZhi();">加值</button></form>';
                var menu_adminUse_big_daiQian_str = '<form class="dropdown-item form btn-sm btn-block"><input class="form-control btn-sm btn-block" type="search" placeholder="欲驗票的目標email" aria-label="Email" id="daiQianEmail" value=""><button class="btn btn-outline-success btn-sm btn-block" type="button" id="daiQianBtn" onclick="daiQian();">驗票</button></form>';
                var menu_adminUse_big_calendar_str_pre = '<form class="dropdown-item form btn-sm btn-block"><table class="table table-striped table-xl"><thead><tr><th scope="col"></th><th scope="col">月</th><th scope="col">份</th><th scope="col">日</th><th scope="col">期</th><th scope="col">人</th><th scope="col">限</th><th scope="col">是否上課</th></tr></thead>';
                var menu_adminUse_big_calendar_str_Yi = '<tbody><tr><th scope="row">一</th><td colspan="2"><div class="form-group"><select class="form-control" id="MonMonth"><option>1</option><option>2</option><option>3</option><option>4</option><option>5</option><option>6</option><option>7</option><option>8</option><option>9</option><option>10</option><option>11</option><option>12</option></select></div></td><td colspan="2"><div class="form-group"><select class="form-control" id="MonDate"><option>1</option><option>2</option><option>3</option><option>4</option><option>5</option><option>6</option><option>7</option><option>8</option><option>9</option><option>10</option><option>11</option><option>12</option><option>13</option><option>14</option><option>15</option><option>16</option><option>17</option><option>18</option><option>19</option><option>20</option><option>21</option><option>22</option><option>23</option><option>24</option><option>25</option><option>26</option><option>27</option><option>28</option><option>29</option><option>30</option><option>31</option></select></div></td><td colspan="2"><div class="form-group"><input type="text" class="form-control" id="MonLimit" placeholder=""></div></td><td><div class="form-check"><input class="form-check-input" type="radio" name="MonYN" id="MonY" value="Y" checked><label class="form-check-label" for="MonY">Y</label></div><div class="form-check"><input class="form-check-input" type="radio" name="MonYN" id="MonN" value="N"><label class="form-check-label" for="MonN">N</label></div></td></tr>';
                var menu_adminUse_big_calendar_str_San = '<tr><th scope="row">二</th><td colspan="2"><div class="form-group"><select class="form-control" id="WedMonth"><option>1</option><option>2</option><option>3</option><option>4</option><option>5</option><option>6</option><option>7</option><option>8</option><option>9</option><option>10</option><option>11</option><option>12</option></select></div></td><td colspan="2"><div class="form-group"><select class="form-control" id="WedDate"><option>1</option><option>2</option><option>3</option><option>4</option><option>5</option><option>6</option><option>7</option><option>8</option><option>9</option><option>10</option><option>11</option><option>12</option><option>13</option><option>14</option><option>15</option><option>16</option><option>17</option><option>18</option><option>19</option><option>20</option><option>21</option><option>22</option><option>23</option><option>24</option><option>25</option><option>26</option><option>27</option><option>28</option><option>29</option><option>30</option><option>31</option></select></div></td><td colspan="2"><div class="form-group"><input type="text" class="form-control" id="WedLimit" placeholder=""></div></td><td><div class="form-check"><input class="form-check-input" type="radio" name="WedYN" id="WedY" value="Y" checked><label class="form-check-label" for="WedY">Y</label></div><div class="form-check"><input class="form-check-input" type="radio" name="WedYN" id="WedN" value="N"><label class="form-check-label" for="WedN">N</label></div></td></tr>';
                var menu_adminUse_big_calendar_str_Wu = '<tr><th scope="row">五</th><td colspan="2"><div class="form-group"><select class="form-control" id="FriMonth"><option>1</option><option>2</option><option>3</option><option>4</option><option>5</option><option>6</option><option>7</option><option>8</option><option>9</option><option>10</option><option>11</option><option>12</option></select></div></td><td colspan="2"><div class="form-group"><select class="form-control" id="FriDate"><option>1</option><option>2</option><option>3</option><option>4</option><option>5</option><option>6</option><option>7</option><option>8</option><option>9</option><option>10</option><option>11</option><option>12</option><option>13</option><option>14</option><option>15</option><option>16</option><option>17</option><option>18</option><option>19</option><option>20</option><option>21</option><option>22</option><option>23</option><option>24</option><option>25</option><option>26</option><option>27</option><option>28</option><option>29</option><option>30</option><option>31</option></select></div></td><td colspan="2"><div class="form-group"><input type="text" class="form-control" id="FriLimit" placeholder=""></div></td><td><div class="form-check"><input class="form-check-input" type="radio" name="FriYN" id="FriY" value="Y" checked><label class="form-check-label" for="FriY">Y</label></div><div class="form-check"><input class="form-check-input" type="radio" name="FriYN" id="FriN" value="N"><label class="form-check-label" for="FriN">N</label></div></td></tr></tbody></table></form><button class="btn btn-outline-success btn-sm dropdown-item text-center" type="button" id="applyToNextWeek" onclick="ApplyToNextWeek();">確認，切換到下週</button>';

                var menu_adminUse_big_entireStr = menu_adminUse_big_QRCode_str + menu_adminUse_big_JiaZhi_str + menu_adminUse_big_daiQian_str + menu_adminUse_big_calendar_str_pre + menu_adminUse_big_calendar_str_Yi + menu_adminUse_big_calendar_str_San + menu_adminUse_big_calendar_str_Wu;

                var isGanBu = (snapShot.key == 'admin' && snapShot.val() == 'Y');

                if (!isGanBu) {
                    menu_adminUse_little.innerHTML = '<a class="dropdown-item room text-muted text-right small" id="GuestMode">您不是幹部唷！</a>';
                    menu_adminUse_big.innerHTML = '<a class="dropdown-item room text-muted text-right small" id="GuestMode">您不是幹部唷！</a>';
                }
                else {
                    menu_adminUse_little.innerHTML = menu_adminUse_little_str;
                    menu_adminUse_big.innerHTML = menu_adminUse_big_entireStr;

                    var btnSysLog = document.getElementById('sysLog');
                    btnSysLog.addEventListener('click', () => {
                        changeToSysLog();
                        $('.navbar-toggler').click();
                    });
                    var btnAccountsList = document.getElementById('accountsList');
                    btnAccountsList.addEventListener('click', () => {
                        changeToAccountsList();
                        $('.navbar-toggler').click();
                    });

                    var btnChangeQRCodeColour = document.getElementById('QRCodeColourPicker');
                    var countBtnChangeQRCodeColour = 0;
                    btnChangeQRCodeColour.addEventListener('click', () => {
                        countBtnChangeQRCodeColour++;

                        if (countBtnChangeQRCodeColour == 3) {
                            countBtnChangeQRCodeColour = 0;

                            changeQRCodeColour();

                            $('.navbar-toggler').click();
                        }
                    });
                    var btnChangeToMonQRCode = document.getElementById('showMonQR');
                    btnChangeToMonQRCode.addEventListener('click', () => {
                        changeQRCode_dayOfWeek("Mon");
                        $('.navbar-toggler').click();
                    });
                    var btnChangeToWedQRCode = document.getElementById('showWedQR');
                    btnChangeToWedQRCode.addEventListener('click', () => {
                        changeQRCode_dayOfWeek("Wed");
                        $('.navbar-toggler').click();
                    });
                    var btnChangeToFriQRCode = document.getElementById('showFriQR');
                    btnChangeToFriQRCode.addEventListener('click', () => {
                        changeQRCode_dayOfWeek("Fri");
                        $('.navbar-toggler').click();
                    });
                    var btnCloseGate = document.getElementById('closeGate');
                    btnCloseGate.addEventListener('click', () => {
                        changeQRCode_dayOfWeek("NaN");
                        $('.navbar-toggler').click();
                    });
                }
            });
            //↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑
            //===========================================================================

            document.getElementById("logout-btn").addEventListener("click", () => {
                firebase.auth().signOut().then(() => {
                    alert("成功登出！");

                    document.getElementById("QuotaStatus").innerHTML = "";
                    document.getElementById("resInfosAndButtons").innerHTML = "";

                    // document.getElementById("recList").innerHTML = "";
                    // document.getElementById("attendanceList").innerHTML = "";
                    // document.getElementById("announceBox").innerHTML = "";
                    document.getElementById("recOrAnnouncementBlock").innerHTML = "";

                    document.getElementById("dynamic-menu-adminUse1").innerHTML = '<a class="dropdown-item room text-muted text-right small" id="GuestMode">您不是幹部唷！</a>';
                    document.getElementById("dynamic-menu-adminUse2").innerHTML = '<a class="dropdown-item room text-muted text-right small" id="GuestMode">您不是幹部唷！</a>';
                }).catch((error) => {
                    alert("登出失敗！");
                    console.log(error);
                });
            });

        }
        else {
            // It won't show any post if not login
            menu_account.innerHTML = "<a class='dropdown-item' href='logIn.html'>登入/註冊</a>";
            document.getElementById('post_list').innerHTML = "";

            menu_adminUse_little.innerHTML = '<a class="dropdown-item room text-muted text-right small" id="GuestMode">您不是幹部唷！</a>';
            menu_adminUse_big.innerHTML = '<a class="dropdown-item room text-muted text-right small" id="GuestMode">您不是幹部唷！</a>';
        }
    });


}





function appendCanvas(caption) {
    var p = QRCode.appendChild(document.createElement("p"));
    p.textContent = caption /*+ ":"*/;
    var result = document.createElement("canvas");
    QRCode.appendChild(result);
    return result;
}
function drawCanvas(qr, scale, border, lightColor, darkColor, canvas) {
    if (scale <= 0 || border < 0)
        throw "Value out of range";
    var width = (qr.size + border * 2) * scale;
    canvas.width = width;
    canvas.height = width;
    var ctx = canvas.getContext("2d");
    for (var y = -border; y < qr.size + border; y++) {
        for (var x = -border; x < qr.size + border; x++) {
            ctx.fillStyle = qr.getModule(x, y) ? darkColor : lightColor;
            ctx.fillRect((x + border) * scale, (y + border) * scale, scale, scale);
        }
    }
}

function copyUID() {
    var curUser = firebase.auth().currentUser;

    var text = curUser.uid;
    navigator.clipboard.writeText(text).then(function () {
        $('.navbar-toggler').click();
        alert('UID複製成功！');
    }, function (err) {
        alert('UID複製失敗！');
    });
}


window.onload = function () {
    init();

    var QRCode = document.getElementById("QRCode");
    var QRCode2 = document.getElementById("QRCode2");

    // 重置時使用
    // 需要先去把database rules ".read"、".write"都設定成true，重置時才不會出問題
    // firebase.database().ref("curWeek").set(0).then(() => {
    //     firebase.database().ref("QRCodeInfo").set({
    //         backgroundColour: "ffffff",
    //         mainColour: "000000",
    //         curDateOfWeek: "NaN"
    //     }).then(() => { console.log("success") });
    // });
    // 另外每年的體驗課程的截止日期，需要手動去logIn.js裡面的那個function裡面修改之後deploy。

    // 注意：有時候網頁壞掉，是因為在deploy的時候在js的第一行出現奇怪的東西，就把它刪掉之後重新deploy就可以了。
    // 寫網頁tip：如果需要先架構好網頁的前端外觀，就先把「init();」給註解掉即可

};



function changeToResSys() {
    var curUser = firebase.auth().currentUser;
    if (!curUser) {
        alert("您尚未登入！");
        return;
    }

    document.getElementById("QRCode").innerHTML = "";


    document.getElementById("announceList").innerHTML = "";
    document.getElementById("announceBox").innerHTML = "";

    document.getElementById("refreshBtn").innerHTML = "";




    var QuotaStr = '<div class="card-columns"><div class="card-row"><div class="card-body"><button type="button" class="btn btn-dark">目前額度 <span class="badge badge-light" id="QuotaRemaining"></span></button></div></div><div class="card-row"><div class="card-body"><button type="button" class="btn btn-warning">今週使用 <span class="badge badge-light" id="QuotaToUseThisWeek"></span></button></div></div><div class="card-row"><div class="card-body"><button type="button" class="btn btn-info">預計剩餘 <span class="badge badge-light" id="SubtractResult"></span></button></div></div></div>';
    document.getElementById("QuotaStatus").innerHTML = QuotaStr;

    var a, b;
    var quotaRef = firebase.database().ref('users/' + curUser.uid);
    quotaRef.once("value").then((snapShot) => {

        snapShot.forEach((childshot) => {
            if (childshot.key == "QuotaRemaining") {
                var value = childshot.val(); a = value;
                if (value < 10) value = "0" + value;

                document.getElementById("QuotaRemaining").innerHTML = value;
            }
            else if (childshot.key == "QuotaToUseThisWeek") {
                var value = childshot.val(); b = value;
                if (value < 10) value = "0" + value;

                document.getElementById("QuotaToUseThisWeek").innerHTML = value;
            }
        });

        var value = a - b;
        if (value < 10) value = "0" + value;

        document.getElementById("SubtractResult").innerHTML = value;
    }).then(() => {
        firebase.database().ref('users/' + curUser.uid).on("child_changed", (snapShot) => {
            if (snapShot.key == "QuotaRemaining") {
                var value = snapShot.val(); a = value;
                if (value < 10) value = "0" + value;

                document.getElementById("QuotaRemaining").innerHTML = value;

                var value = a - b;
                if (value < 10) value = "0" + value;

                document.getElementById("SubtractResult").innerHTML = value;
            }
            else if (snapShot.key == "QuotaToUseThisWeek") {
                var value = snapShot.val(); b = value;
                if (value < 10) value = "0" + value;

                document.getElementById("QuotaToUseThisWeek").innerHTML = value;

                var value = a - b;
                if (value < 10) value = "0" + value;

                document.getElementById("SubtractResult").innerHTML = value;
            }
        }, (err) => {
        });
    });










    var DateStrYNButtonStr = '<div class="card-columns text-center"><div class="card-row"><div class="card-body text-center"><h5 class="card-title" id="MonDateShow"></h5><h6>人數 <span class="badge badge-secondary" id="MonCurNumShow"></span></h6><h6>人限 <span class="badge badge-danger" id="MonLimitShow"></span></h6><button type="button" class="btn btn-outline-success btn-sm" id="MonY_AppOrDisapp">✓</button><button type="button" class="btn btn-outline-danger btn-sm" id="MonN_AppOrDisapp">✗</button></div></div><div class="card-row"><div class="card-body text-center"><h5 class="card-title" id="WedDateShow"></h5><h6>人數 <span class="badge badge-secondary" id="WedCurNumShow"></span></h6><h6>人限 <span class="badge badge-danger" id="WedLimitShow"></span></h6><button type="button" class="btn btn-outline-success btn-sm" id="WedY_AppOrDisapp">✓</button><button type="button" class="btn btn-outline-danger btn-sm" id="WedN_AppOrDisapp">✗</button></div></div><div class="card-row"><div class="card-body text-center"><h5 class="card-title" id="FriDateShow"></h5><h6>人數 <span class="badge badge-secondary" id="FriCurNumShow"></span></h6><h6>人限 <span class="badge badge-danger" id="FriLimitShow"></span></h6><button type="button" class="btn btn-outline-success btn-sm" id="FriY_AppOrDisapp">✓</button><button type="button" class="btn btn-outline-danger btn-sm" id="FriN_AppOrDisapp">✗</button></div></div></div>';
    document.getElementById("resInfosAndButtons").innerHTML = DateStrYNButtonStr;

    document.getElementById("MonY_AppOrDisapp").addEventListener("click", () => {
        AppointOrDisappoint("Mon", "Y");
    });
    document.getElementById("MonN_AppOrDisapp").addEventListener("click", () => {
        AppointOrDisappoint("Mon", "N");
    });
    document.getElementById("WedY_AppOrDisapp").addEventListener("click", () => {
        AppointOrDisappoint("Wed", "Y");
    });
    document.getElementById("WedN_AppOrDisapp").addEventListener("click", () => {
        AppointOrDisappoint("Wed", "N");
    });
    document.getElementById("FriY_AppOrDisapp").addEventListener("click", () => {
        AppointOrDisappoint("Fri", "Y");
    });
    document.getElementById("FriN_AppOrDisapp").addEventListener("click", () => {
        AppointOrDisappoint("Fri", "N");
    });



    var curWeek = -1;
    firebase.database().ref('curWeek').once("value").then((snapShot) => {
        curWeek = snapShot.val();
    }).then(() => {
        firebase.database().ref('weeks/' + curWeek).once("value").then((snapShot) => {
            snapShot.forEach((childShot) => {
                if (childShot.key == "Yi") {
                    var YiInfo = childShot.val().Month + "月" + childShot.val().Date + "日(一)";
                    document.getElementById("MonDateShow").innerHTML = YiInfo;

                    document.getElementById("MonCurNumShow").innerHTML = childShot.val().curNum;
                    document.getElementById("MonLimitShow").innerHTML = childShot.val().Limit;
                }
                else if (childShot.key == "San") {
                    var SanInfo = childShot.val().Month + "月" + childShot.val().Date + "日(二)";
                    document.getElementById("WedDateShow").innerHTML = SanInfo;

                    document.getElementById("WedCurNumShow").innerHTML = childShot.val().curNum;
                    document.getElementById("WedLimitShow").innerHTML = childShot.val().Limit;
                }
                else if (childShot.key == "Wu") {
                    var WuInfo = childShot.val().Month + "月" + childShot.val().Date + "日(五)";
                    document.getElementById("FriDateShow").innerHTML = WuInfo;

                    document.getElementById("FriCurNumShow").innerHTML = childShot.val().curNum;
                    document.getElementById("FriLimitShow").innerHTML = childShot.val().Limit;
                }
            });
        })
    }).then(() => {
        firebase.database().ref('weeks/' + curWeek + '/Yi').on("child_changed", (snapShot) => {
            if (snapShot.key == "curNum") {
                curMonNum = snapShot.val();
                document.getElementById("MonCurNumShow").innerHTML = curMonNum;
            }
        }, (err) => {
        });
        firebase.database().ref('weeks/' + curWeek + '/San').on("child_changed", (snapShot) => {
            if (snapShot.key == "curNum") {
                curWedNum = snapShot.val();
                document.getElementById("WedCurNumShow").innerHTML = curWedNum;
            }
        }, (err) => {
        });
        firebase.database().ref('weeks/' + curWeek + '/Wu').on("child_changed", (snapShot) => {
            if (snapShot.key == "curNum") {
                curFriNum = snapShot.val();
                document.getElementById("FriCurNumShow").innerHTML = curFriNum;
            }
        }, (err) => {
        });

    }).then(() => {
        //秀出當前一、二、五成功預約的預約者，並且
        //秀出目前這個帳號的所有紀錄
        openrecOrAnnouncementBlock();
    });










    // 清空聊天室內容以及聊天送出框
    document.getElementById("post_list").innerHTML = "";
    // document.getElementById("boxes").innerHTML = "";



}


function ApplyToNextWeek() {
    // 先檢查填答是否正確 -> 人限？至少人限一定要確定不能有任何一個空白
    if (document.getElementById("MonLimit").value === "" || document.getElementById("WedLimit").value === "" || document.getElementById("FriLimit").value === "") {
        alert("人限必填！");
        return;
    }





    //1. 進行扣款
    //2. 並且每個用戶都要有各自的當周的扣款紀錄
    //3. 並且每次上課也有自己的扣款紀錄（紀錄有哪幾個人真正出席）。

    //1. 2. 實作
    var userRef = firebase.database().ref("users/");
    userRef.once("value").then((snapShot) => {
        snapShot.forEach((childShot) => {
            var oldVal = childShot.val().QuotaRemaining;
            var newVal = oldVal - childShot.val().QuotaToUseThisWeek;
            var numNeedToAccumulate = childShot.val().QuotaToUseThisWeek;

            userRef.child(childShot.val().UID + "/AccumulatedUse").once("value").then(snapShot => {
                userRef.child(childShot.val().UID + "/AccumulatedUse").set(snapShot.val() + numNeedToAccumulate).then(() => {
                    userRef.child(childShot.val().UID + "/QuotaRemaining").set(newVal).then(() => {
                        var curTime = getDateTimeStr();
                        var curUser = firebase.auth().currentUser;

                        var str = "扣款紀錄：" + curTime + "由" + curUser.displayName + "操作系統，從原值" + oldVal + "扣除" + childShot.val().QuotaToUseThisWeek + "，變成" + newVal + "。";

                        var str2 = "本週扣款：";
                        userRef.child(childShot.val().UID + "/YiSanWu/Yi").once("value").then((shot) => {
                            if (shot.val() == "Y") str2 += "一";
                        }).then(() => {
                            userRef.child(childShot.val().UID + "/YiSanWu/San").once("value").then((shot) => {
                                if (shot.val() == "Y") str2 += "二";
                            }).then(() => {
                                userRef.child(childShot.val().UID + "/YiSanWu/Wu").once("value").then((shot) => {
                                    if (shot.val() == "Y") str2 += "五";
                                }).then(() => {
                                    str2 += "。";

                                    if (str2 == "本週扣款：。") str2 = "本週沒有扣款。";
                                }).then(() => {
                                    userRef.child(childShot.val().UID + "/Record").push(str + str2).then(() => {
                                        userRef.child(childShot.val().UID + "/QuotaToUseThisWeek").set(0).then(() => {
                                            userRef.child(childShot.val().UID + "/YiSanWu").set({
                                                Yi: "N",
                                                San: "N",
                                                Wu: "N"
                                            });
                                        });
                                    });
                                });
                            });
                        });



                    });
                });
            });




        });
    });


    //3. 並且每次上課也有自己的扣款紀錄（紀錄有哪幾個人真正出席）還沒實作
    //已經實作，寫在4. 裡面。（"系統於" + curTime + "更新為新的一週（第"......之後的那個then();）




    //4. DB更換成下一週的上課資訊
    var MonMonth = document.getElementById("MonMonth").value;
    var MonDate = document.getElementById("MonDate").value;
    var MonLimit = document.getElementById("MonLimit").value;
    var MonYes = document.getElementById("MonY").checked;

    var WedMonth = document.getElementById("WedMonth").value;
    var WedDate = document.getElementById("WedDate").value;
    var WedLimit = document.getElementById("WedLimit").value;
    var WedYes = document.getElementById("WedY").checked;

    var FriMonth = document.getElementById("FriMonth").value;
    var FriDate = document.getElementById("FriDate").value;
    var FriLimit = document.getElementById("FriLimit").value;
    var FriYes = document.getElementById("FriY").checked;

    var str;
    var canChangeYear = false;
    firebase.database().ref("curWeek").once("value").then((snapShot) => {
        var oldWeek = parseInt(snapShot.val(), 10);
        var newWeek = oldWeek + 1;
        var current = new Date();//獲取當前時間
        var curTime = getDateTimeStr();
        var Year = current.getFullYear();


        firebase.database().ref('weeks/' + oldWeek).once("value").then(snapShot => {
            if (oldWeek != 0) {
                if (snapShot.val().Yi.Month == 12 && snapShot.val().San.Month == 12 && snapShot.val().Wu.Month == 12) {
                    canChangeYear = true;
                }
            }
        }).then(() => {
            var weekRef = firebase.database().ref("weeks/" + newWeek);
            weekRef.set({
                Yi: {
                    Year: ((MonMonth == '1' && canChangeYear) ? (Year + 1) : (Year)),
                    Month: parseInt(MonMonth, 10),
                    Date: parseInt(MonDate, 10),
                    Limit: (MonYes) ? parseInt(MonLimit, 10) : 0,
                    curNum: 0
                },
                San: {
                    Year: ((WedMonth == '1' && canChangeYear) ? (Year + 1) : (Year)),
                    Month: parseInt(WedMonth, 10),
                    Date: parseInt(WedDate, 10),
                    Limit: (WedYes) ? parseInt(WedLimit, 10) : 0,
                    curNum: 0
                },
                Wu: {
                    Year: ((FriMonth == '1' && canChangeYear) ? (Year + 1) : (Year)),
                    Month: parseInt(FriMonth, 10),
                    Date: parseInt(FriDate, 10),
                    Limit: (FriYes) ? parseInt(FriLimit, 10) : 0,
                    curNum: 0
                }
            }).then(() => {
                firebase.database().ref("curWeek").set(newWeek).then(() => {
                    var weekRecRef = firebase.database().ref("weeklySysRec");

                    /*var */str = "-------------------------------------------------------------------<br>↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓<br>系統於" + curTime + "更新為新的一週（第" + newWeek + "週）。<br>";
                    // str += WedMonth + "月" + WedDate + "日（週二）" + ((WedYes) ? "會上課" : "不上課") + "，人限" + WedLimit + "。<br>";
                    // str += FriMonth + "月" + FriDate + "日（週五）" + ((FriYes) ? "會上課" : "不上課") + "，人限" + FriLimit + "。<br>";


                    // weekRecRef.push(str);
                    // 原本是A、B寫法，改成B、A寫法，也就是順序調換。A是：新週資訊；B是：舊週資訊。先寫舊週再寫新週，會比較符合人類直覺
                }).then(() => {
                    var attendanceStr = ((oldWeek != 0) ? "舊週（第" + oldWeek + "週）出席名單如下。<br>" : "");

                    var usersListPromise;
                    firebase.database().ref("users").once("value").then(snapShot => {
                        usersListPromise = snapShot;

                        //本once("value")先一次性地抓到所有users的資料，這樣下一個then才有辦法去對照出來email。
                    }).then(() => {

                        // usersListPromise確認可用，用法如下
                        // usersListPromise.forEach((userSnapShot) => {
                        //     console.log(userSnapShot);
                        //     console.log(userSnapShot.key);
                        //     console.log(userSnapShot.val());
                        // });


                        var oldMonAttendanceRef = firebase.database().ref("weeks/" + oldWeek + '/Yi/AttendanceList');
                        oldMonAttendanceRef.once("value").then((snapShot) => {
                            attendanceStr += ((oldWeek != 0) ? "一：" : "");

                            var oldMonCount = 0;
                            var oldMonRealityAbsence = 0;

                            snapShot.forEach((childShot) => {
                                if (childShot.val() != "N") {
                                    if (childShot.val() == "Y") {
                                        oldMonRealityAbsence++;
                                    }

                                    var thisParticipantUID = childShot.key;

                                    var thisParticipantEmail;
                                    usersListPromise.forEach(userSnapShot => {
                                        if (userSnapShot.key == thisParticipantUID) {
                                            thisParticipantEmail = userSnapShot.val().Email;
                                            if (childShot.val() == "Y") {
                                                thisParticipantEmail = "實際上並未出席的" + thisParticipantEmail;
                                            }
                                        }
                                    });
                                    attendanceStr += ((oldMonCount != 0) ? (", " + thisParticipantEmail) : (thisParticipantEmail));

                                    oldMonCount++;
                                }
                            });

                            attendanceStr += ((oldWeek != 0) ? "。共計有" + oldMonCount + "人預約，而實際上有" + oldMonRealityAbsence + "人並未出席。<br>" : "");
                        }).then(() => {
                            var oldWedAttendanceRef = firebase.database().ref("weeks/" + oldWeek + '/San/AttendanceList');
                            oldWedAttendanceRef.once("value").then((snapShot) => {
                                attendanceStr += ((oldWeek != 0) ? "二：" : "");

                                var oldWedCount = 0;
                                var oldWedRealityAbsence = 0;

                                snapShot.forEach((childShot) => {
                                    if (childShot.val() != "N") {
                                        if (childShot.val() == "Y") {
                                            oldWedRealityAbsence++;
                                        }

                                        var thisParticipantUID = childShot.key;

                                        var thisParticipantEmail;
                                        usersListPromise.forEach(userSnapShot => {
                                            if (userSnapShot.key == thisParticipantUID) {
                                                thisParticipantEmail = userSnapShot.val().Email;
                                                if (childShot.val() == "Y") {
                                                    thisParticipantEmail = "實際上並未出席的" + thisParticipantEmail;
                                                }
                                            }
                                        });
                                        attendanceStr += ((oldWedCount != 0) ? (", " + thisParticipantEmail) : (thisParticipantEmail));

                                        oldWedCount++;
                                    }
                                });

                                attendanceStr += ((oldWeek != 0) ? "。共計有" + oldWedCount + "人預約，而實際上有" + oldWedRealityAbsence + "人並未出席。<br>" : "");
                            }).then(() => {
                                var oldFriAttendanceRef = firebase.database().ref("weeks/" + oldWeek + '/Wu/AttendanceList');
                                oldFriAttendanceRef.once("value").then((snapShot) => {
                                    attendanceStr += ((oldWeek != 0) ? "五：" : "");

                                    var oldFriCount = 0;
                                    var oldFriRealityAbsence = 0;

                                    snapShot.forEach((childShot) => {
                                        if (childShot.val() != "N") {
                                            if (childShot.val() == "Y") {
                                                oldFriRealityAbsence++;
                                            }

                                            var thisParticipantUID = childShot.key;

                                            var thisParticipantEmail;
                                            usersListPromise.forEach(userSnapShot => {
                                                if (userSnapShot.key == thisParticipantUID) {
                                                    thisParticipantEmail = userSnapShot.val().Email;
                                                    if (childShot.val() == "Y") {
                                                        thisParticipantEmail = "實際上並未出席的" + thisParticipantEmail;
                                                    }
                                                }
                                            });
                                            attendanceStr += ((oldFriCount != 0) ? (", " + thisParticipantEmail) : (thisParticipantEmail));

                                            oldFriCount++;
                                        }
                                    });

                                    attendanceStr += ((oldWeek != 0) ? "。共計有" + oldFriCount + "人預約，而實際上有" + oldFriRealityAbsence + "人並未出席。<br>" : "");

                                    str += "<br>" + attendanceStr + "<br>";
                                    str += "新週（第" + newWeek + "週）資訊如下。<br>";
                                    str += + MonMonth + "月" + MonDate + "日（週一）" + ((MonYes) ? "會上課" : "不上課") + "，人限" + MonLimit + "。<br>";
                                    str += WedMonth + "月" + WedDate + "日（週二）" + ((WedYes) ? "會上課" : "不上課") + "，人限" + WedLimit + "。<br>";
                                    str += FriMonth + "月" + FriDate + "日（週五）" + ((FriYes) ? "會上課" : "不上課") + "，人限" + FriLimit + "。<br>";
                                    str += "↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑<br>-------------------------------------------------------------------<br>";

                                    firebase.database().ref("weeklySysRec").push(str).then(() => { alert("已成功將資料切換到下週！") });
                                });
                            });
                        });
                    });



                })

            });
        });


    })


}


function Email_JiaZhi() {
    var goalAccount = document.getElementById("JiaZhiEmail").value;
    var chargeNum = parseInt(document.getElementById("howMuch").value, 10);


    if (chargeNum > 0) {

        var curUser = firebase.auth().currentUser;
        var userRef = firebase.database().ref("users/");

        var flag_existsAnyError = true;
        var howManyAccountsTheComputerIterated = 0;
        var numOfTotalAccount;
        userRef.once("value").then((snapShot) => {
            numOfTotalAccount = snapShot.numChildren();
            //console.log(numOfTotalAccount);

            snapShot.forEach((childShot) => {
                howManyAccountsTheComputerIterated++;

                if (childShot.val().Email == goalAccount || childShot.val().Email == goalAccount + "@gmail.com") {

                    //會運作到下面code的情況，就是已經找到這個帳號，可以開始嘗試加值了
                    var curTime = getDateTimeStr();

                    var oldVal = childShot.val().QuotaRemaining;
                    var newVal = oldVal + chargeNum;

                    userRef.child(childShot.val().UID + "/QuotaRemaining").set(newVal).then(() => {
                        userRef.child(childShot.val().UID + "/Record").push("加值紀錄：" + curTime + "由" + curUser.displayName + "操作系統，從原值" + oldVal + "加值" + chargeNum + "，變成" + newVal + "。").then(() => {
                            alert("加值成功");

                            document.getElementById("JiaZhiEmail").value = "";
                            document.getElementById("howMuch").value = "";
                        });
                    });
                }
            });

        });

    }
    else {
        alert("輸入錯誤！您所輸入的加值數字，電腦判讀出來是「" + chargeNum + "」，請輸入合理的「正」整數");
        return;
    }
}


function AppointOrDisappoint(dayOfTheWeek, AppOrDisapp) {
    var curUser = firebase.auth().currentUser;

    var userRef = firebase.database().ref("users/");

    //注意： 假設當前時間是2021年7月30日，current會記錄成2021/06/30，也就是說，月份是0-based!
    //但是沒關係，因為我四個都是用Date-class物件，所以他們通通相對地被改成0-based，所以在比較的時候不用擔心會出錯！
    //這個制度真的很怪，很有貓膩，所以以下針對current去step forward一個月純屬trial and error測試出來的結果
    var current = new Date();//獲取當前時間
    var cur_time = getDateTimeStr();

    // console.log(current);
    // console.log(current.getMonth());
    // console.log(cur_time);
    current.setMonth(current.getMonth() + 1);
    // console.log(current);


    const MonDate = new Date(1975, 8, 19, 17, 25, 00);
    const WedDate = new Date(1975, 8, 19, 17, 25, 00);
    const FriDate = new Date(1975, 8, 19, 17, 25, 00);
    var MonLimit = 0, WedLimit = 0, FriLimit = 0;

    var curMonNum, curWedNum, curFriNum;

    firebase.database().ref('users/' + curUser.uid + '/QuotaToUseThisWeek').on("child_changed", (snapShot) => {
        var value = snapShot.val(); b = value;
        if (value < 10) value = "0" + value;

        document.getElementById("QuotaToUseThisWeek").innerHTML = value;

        var value = /*a*/parseInt(document.getElementById("QuotaRemaining").innerHTML, 10) - b;
        if (value < 10) value = "0" + value;

        document.getElementById("SubtractResult").innerHTML = value;

    }, (err) => {
        console.log("「一」的即時人數已更新，但程式出現錯誤： " + err);
    });


    //更改MonDate、WedDate、FriDate爲正確的時間，並且也抓取二個Limits,，且也先抓取一次二個curNum。二個curNum還需要註冊"on"!
    var curWeek = -1;
    firebase.database().ref('curWeek').once("value").then((snapShot) => {
        curWeek = snapShot.val();
    }).then(() => {
        firebase.database().ref('weeks/' + curWeek).once("value").then((snapShot) => {
            snapShot.forEach((childShot) => {
                if (childShot.key == "Yi") {
                    MonDate.setFullYear(childShot.val().Year);
                    MonDate.setMonth(childShot.val().Month/* - 1*//*不用特別改！*/);//因為Month在Date-class裡面是0-based
                    MonDate.setDate(childShot.val().Date);

                    MonLimit = parseInt(childShot.val().Limit, 10);

                    curMonNum = childShot.val().curNum;
                }
                else if (childShot.key == "San") {
                    WedDate.setFullYear(childShot.val().Year);
                    WedDate.setMonth(childShot.val().Month);
                    WedDate.setDate(childShot.val().Date);

                    WedLimit = parseInt(childShot.val().Limit, 10);

                    curWedNum = childShot.val().curNum;
                }
                else if (childShot.key == "Wu") {
                    FriDate.setFullYear(childShot.val().Year);
                    FriDate.setMonth(childShot.val().Month);
                    FriDate.setDate(childShot.val().Date);

                    FriLimit = parseInt(childShot.val().Limit, 10);

                    curFriNum = childShot.val().curNum;
                }
            });
        }).then(() => {
            // 二個curNum在這裡註冊"on"!
            firebase.database().ref('weeks/' + curWeek + '/Yi').on("child_changed", (snapShot) => {
                if (snapShot.key == "curNum") {
                    curMonNum = snapShot.val();
                    document.getElementById("MonCurNumShow").innerHTML = curMonNum;
                }
            }, (err) => {
            });
            firebase.database().ref('weeks/' + curWeek + '/San').on("child_changed", (snapShot) => {
                if (snapShot.key == "curNum") {
                    curWedNum = snapShot.val();
                    document.getElementById("WedCurNumShow").innerHTML = curWedNum;
                }
            }, (err) => {
            });
            firebase.database().ref('weeks/' + curWeek + '/Wu').on("child_changed", (snapShot) => {
                if (snapShot.key == "curNum") {
                    curFriNum = snapShot.val();
                    document.getElementById("FriCurNumShow").innerHTML = curFriNum;
                }
            }, (err) => {
            });

        }).then(() => {
            if (dayOfTheWeek == "Mon") {
                // console.log(current);
                // console.log(MonDate);
                // console.log(current >= MonDate);


                if (current >= MonDate) {
                    alert("已經超過時限，無法更動預約");
                    return;
                }

                var isUIDInList = false;
                //有好幾種排列組合要討論： 1. UID是不是早就在列表上 2. 有在列表上的話，所列的內容和他要執行的動作是否早就完成，還是是真的需要flip。又，如果沒有在列表上 3.如果需要flip，人限問題 4.他的Quota是否充足
                var attendanceRef = firebase.database().ref('weeks/' + curWeek + '/Yi/AttendanceList');
                attendanceRef.once("value").then((snapShot) => {
                    snapShot.forEach((childShot) => {
                        if (childShot.key == curUser.uid) { //如果有在列表上
                            isUIDInList = true;

                            if (childShot.val() == "N" && AppOrDisapp == "Y") { //如果他想出席，但列表上顯示不出席
                                if (curMonNum + 1 <= MonLimit) { //如果人限檢查沒問題的話
                                    if (parseInt(document.getElementById("QuotaRemaining").innerHTML, 10) >= parseInt(document.getElementById("QuotaToUseThisWeek").innerHTML, 10) + 1) { //如果Quota充足，就可以讓他預約
                                        attendanceRef.child(curUser.uid).set("Y").then(() => {
                                            firebase.database().ref('weeks/' + curWeek + '/Yi/curNum').set(curMonNum + 1);
                                        }).then(() => {
                                            userRef.child(curUser.uid + "/Record").push("新增預約：" + cur_time + "由您新增" + (MonDate.getMonth() == 0 ? 12 : MonDate.getMonth()) + "月" + MonDate.getDate().toString() + "日(一)的預約。").then(() => {
                                                userRef.child(curUser.uid + '/YiSanWu/Yi').set("Y").then(() => {
                                                    var quotaToBeSubtracted;
                                                    userRef.child(curUser.uid + "/QuotaToUseThisWeek").once("value").then((snapShot) => {
                                                        quotaToBeSubtracted = snapShot.val();
                                                    }).then(() => {
                                                        userRef.child(curUser.uid + "/QuotaToUseThisWeek").set(quotaToBeSubtracted + 1).then(() => {
                                                            alert("預約成功，請檢視預約清單！");
                                                        });
                                                    });
                                                });
                                            });
                                        });
                                    }
                                    else {
                                        alert("餘額不足，無法預約此項目。請調整其他項目的預約，或洽詢幹部！");
                                    }
                                }
                                else {
                                    alert("超過人限！");
                                    return;
                                }
                            }
                            else if (childShot.val() != "N" && AppOrDisapp == "Y") { //如果他想出席，但是列表上他根本已經預約過
                                alert("您之前已經預約過，請檢視預約清單！");
                                return;
                            }
                            else if (childShot.val() != "N" && AppOrDisapp == "N") { //如果他想取消預約，而且列表上確實有他的名字
                                attendanceRef.child(curUser.uid).set("N").then(() => {
                                    firebase.database().ref('weeks/' + curWeek + '/Yi/curNum').set(curMonNum - 1);
                                }).then(() => {
                                    userRef.child(curUser.uid + "/Record").push("取消預約：" + cur_time + "由您取消" + (MonDate.getMonth() == 0 ? 12 : MonDate.getMonth()) + "月" + MonDate.getDate().toString() + "日(一)的預約。").then(() => {
                                        userRef.child(curUser.uid + '/YiSanWu/Yi').set("N").then(() => {
                                            var quotaToBeSubtracted;
                                            userRef.child(curUser.uid + "/QuotaToUseThisWeek").once("value").then((snapShot) => {
                                                quotaToBeSubtracted = snapShot.val();
                                            }).then(() => {
                                                userRef.child(curUser.uid + "/QuotaToUseThisWeek").set(quotaToBeSubtracted - 1).then(() => {
                                                    alert("取消預約成功，請檢視預約清單！");
                                                });
                                            });
                                        });
                                    });
                                });
                            }
                            else /*if (childShot.val() == "N" && AppOrDisapp == "N")*/ { //如果他想取消預約，但是列表上根本沒有他
                                alert("您之前並沒有在預約清單上，無法取消預約");
                                return;
                            }
                        }

                    });

                    if (!isUIDInList) { //如果他不在列表上
                        //如果想取消預約，那因為他根本不在列表上面，所以就完全不用管他
                        if (AppOrDisapp == "N") {
                            alert("您之前並沒有在預約清單上，無法取消預約");
                            return;
                        }
                        //如果想預約，而且如果人限檢查沒問題，還有Quota也確認充足，就可以讓他預約
                        else {
                            if (curMonNum + 1 <= MonLimit) { //人限檢查
                                if (parseInt(document.getElementById("QuotaRemaining").innerHTML, 10) >= parseInt(document.getElementById("QuotaToUseThisWeek").innerHTML, 10) + 1) { //如果Quota充足，就可以讓他預約
                                    attendanceRef.child(curUser.uid).set("Y").then(() => {
                                        firebase.database().ref('weeks/' + curWeek + '/Yi/curNum').set(curMonNum + 1);
                                    }).then(() => {
                                        userRef.child(curUser.uid + "/Record").push("新增預約：" + cur_time + "由您新增" + (MonDate.getMonth() == 0 ? 12 : MonDate.getMonth()) + "月" + MonDate.getDate().toString() + "日(一)的預約。").then(() => {
                                            userRef.child(curUser.uid + '/YiSanWu/Yi').set("Y").then(() => {
                                                var quotaToBeSubtracted;
                                                userRef.child(curUser.uid + "/QuotaToUseThisWeek").once("value").then((snapShot) => {
                                                    quotaToBeSubtracted = snapShot.val();
                                                }).then(() => {
                                                    userRef.child(curUser.uid + "/QuotaToUseThisWeek").set(quotaToBeSubtracted + 1).then(() => {
                                                        alert("預約成功，請檢視預約清單！");
                                                    });
                                                });
                                            });
                                        });
                                    });
                                }
                                else {
                                    alert("餘額不足，無法預約此項目。請調整其他項目的預約，或洽詢幹部！");
                                }
                            }
                            else {
                                alert("超過人限！");
                                return;
                            }
                        }
                    }

                });

            }
            else if (dayOfTheWeek == "Wed") {
                if (current >= WedDate) {
                    alert("已經超過時限，無法更動預約");
                    return;
                }

                var isUIDInList = false;
                //有好幾種排列組合要討論： 1. UID是不是早就在列表上 2. 有在列表上的話，所列的內容和他要執行的動作是否早就完成，還是是真的需要flip。又，如果沒有在列表上 3.如果需要flip，人限問題 4.他的Quota是否充足
                var attendanceRef = firebase.database().ref('weeks/' + curWeek + '/San/AttendanceList');
                attendanceRef.once("value").then((snapShot) => {
                    snapShot.forEach((childShot) => {
                        if (childShot.key == curUser.uid) { //如果有在列表上
                            isUIDInList = true;

                            if (childShot.val() == "N" && AppOrDisapp == "Y") { //如果他想出席，但列表上顯示不出席
                                if (curWedNum + 1 <= WedLimit) { //如果人限檢查沒問題的話
                                    if (parseInt(document.getElementById("QuotaRemaining").innerHTML, 10) >= parseInt(document.getElementById("QuotaToUseThisWeek").innerHTML, 10) + 1) { //如果Quota充足，就可以讓他預約
                                        attendanceRef.child(curUser.uid).set("Y").then(() => {
                                            firebase.database().ref('weeks/' + curWeek + '/San/curNum').set(curWedNum + 1);
                                        }).then(() => {
                                            userRef.child(curUser.uid + "/Record").push("新增預約：" + cur_time + "由您新增" + (WedDate.getMonth() == 0 ? 12 : WedDate.getMonth()) + "月" + WedDate.getDate().toString() + "日(二)的預約。").then(() => {
                                                userRef.child(curUser.uid + '/YiSanWu/San').set("Y").then(() => {
                                                    var quotaToBeSubtracted;
                                                    userRef.child(curUser.uid + "/QuotaToUseThisWeek").once("value").then((snapShot) => {
                                                        quotaToBeSubtracted = snapShot.val();
                                                    }).then(() => {
                                                        userRef.child(curUser.uid + "/QuotaToUseThisWeek").set(quotaToBeSubtracted + 1).then(() => {
                                                            alert("預約成功，請檢視預約清單！");
                                                        });
                                                    });
                                                });
                                            });
                                        });
                                    }
                                    else {
                                        alert("餘額不足，無法預約此項目。請調整其他項目的預約，或洽詢幹部！");
                                    }

                                }
                                else {
                                    alert("超過人限！");
                                    return;
                                }
                            }
                            else if (childShot.val() != "N" && AppOrDisapp == "Y") { //如果他想出席，但是列表上他根本已經預約過
                                alert("您之前已經預約過，請檢視預約清單！");
                                return;
                            }
                            else if (childShot.val() != "N" && AppOrDisapp == "N") { //如果他想取消預約，而且列表上確實有他的名字
                                attendanceRef.child(curUser.uid).set("N").then(() => {
                                    firebase.database().ref('weeks/' + curWeek + '/San/curNum').set(curWedNum - 1);
                                }).then(() => {
                                    userRef.child(curUser.uid + "/Record").push("取消預約：" + cur_time + "由您取消" + (WedDate.getMonth() == 0 ? 12 : WedDate.getMonth()) + "月" + WedDate.getDate().toString() + "日(二)的預約。").then(() => {
                                        userRef.child(curUser.uid + '/YiSanWu/San').set("N").then(() => {
                                            var quotaToBeSubtracted;
                                            userRef.child(curUser.uid + "/QuotaToUseThisWeek").once("value").then((snapShot) => {
                                                quotaToBeSubtracted = snapShot.val();
                                            }).then(() => {
                                                userRef.child(curUser.uid + "/QuotaToUseThisWeek").set(quotaToBeSubtracted - 1).then(() => {
                                                    alert("取消預約成功，請檢視預約清單！");
                                                });
                                            });
                                        });
                                    });
                                });
                            }
                            else /*if (childShot.val() == "N" && AppOrDisapp == "N")*/ { //如果他想取消預約，但是列表上根本沒有他
                                alert("您之前並沒有在預約清單上，無法取消預約");
                                return;
                            }
                        }

                    });

                    if (!isUIDInList) { //如果他不在列表上
                        //如果想取消預約，那因為他根本不在列表上面，所以就完全不用管他
                        if (AppOrDisapp == "N") {
                            alert("您之前並沒有在預約清單上，無法取消預約");
                            return;
                        }
                        //如果想預約，而且如果人限檢查沒問題，就可以讓他預約
                        else {
                            if (curWedNum + 1 <= WedLimit) { //人限檢查
                                if (parseInt(document.getElementById("QuotaRemaining").innerHTML, 10) >= parseInt(document.getElementById("QuotaToUseThisWeek").innerHTML, 10) + 1) { //如果Quota充足，就可以讓他預約
                                    attendanceRef.child(curUser.uid).set("Y").then(() => {
                                        firebase.database().ref('weeks/' + curWeek + '/San/curNum').set(curWedNum + 1);
                                    }).then(() => {
                                        userRef.child(curUser.uid + "/Record").push("新增預約：" + cur_time + "由您新增" + (WedDate.getMonth() == 0 ? 12 : WedDate.getMonth()) + "月" + WedDate.getDate().toString() + "日(二)的預約。").then(() => {
                                            userRef.child(curUser.uid + '/YiSanWu/San').set("Y").then(() => {
                                                var quotaToBeSubtracted;
                                                userRef.child(curUser.uid + "/QuotaToUseThisWeek").once("value").then((snapShot) => {
                                                    quotaToBeSubtracted = snapShot.val();
                                                }).then(() => {
                                                    userRef.child(curUser.uid + "/QuotaToUseThisWeek").set(quotaToBeSubtracted + 1).then(() => {
                                                        alert("預約成功，請檢視預約清單！");
                                                    });
                                                });
                                            });
                                        });
                                    });
                                }
                                else {
                                    alert("餘額不足，無法預約此項目。請調整其他項目的預約，或洽詢幹部！");
                                }
                            }
                            else {
                                alert("超過人限！");
                                return;
                            }
                        }
                    }

                });
            }
            else /*if (dayOfTheWeek == "Fri")*/ {
                if (current >= FriDate) {
                    alert("已經超過時限，無法更動預約");
                    return;
                }

                var isUIDInList = false;
                //有好幾種排列組合要討論： 1. UID是不是早就在列表上 2. 有在列表上的話，所列的內容和他要執行的動作是否早就完成，還是是真的需要flip。又，如果沒有在列表上 3.如果需要flip，人限問題 4.他的Quota是否充足
                var attendanceRef = firebase.database().ref('weeks/' + curWeek + '/Wu/AttendanceList');
                attendanceRef.once("value").then((snapShot) => {
                    snapShot.forEach((childShot) => {
                        if (childShot.key == curUser.uid) { //如果有在列表上
                            isUIDInList = true;

                            if (childShot.val() == "N" && AppOrDisapp == "Y") { //如果他想出席，但列表上顯示不出席
                                if (curFriNum + 1 <= FriLimit) { //如果人限檢查沒問題的話
                                    if (parseInt(document.getElementById("QuotaRemaining").innerHTML, 10) >= parseInt(document.getElementById("QuotaToUseThisWeek").innerHTML, 10) + 1) { //如果Quota充足，就可以讓他預約
                                        attendanceRef.child(curUser.uid).set("Y").then(() => {
                                            firebase.database().ref('weeks/' + curWeek + '/Wu/curNum').set(curFriNum + 1);
                                        }).then(() => {
                                            userRef.child(curUser.uid + "/Record").push("新增預約：" + cur_time + "由您新增" + (FriDate.getMonth() == 0 ? 12 : FriDate.getMonth()) + "月" + FriDate.getDate().toString() + "日(五)的預約。").then(() => {
                                                userRef.child(curUser.uid + '/YiSanWu/Wu').set("Y").then(() => {
                                                    var quotaToBeSubtracted;
                                                    userRef.child(curUser.uid + "/QuotaToUseThisWeek").once("value").then((snapShot) => {
                                                        quotaToBeSubtracted = snapShot.val();
                                                    }).then(() => {
                                                        userRef.child(curUser.uid + "/QuotaToUseThisWeek").set(quotaToBeSubtracted + 1).then(() => {
                                                            alert("預約成功，請檢視預約清單！");
                                                        });
                                                    });
                                                });
                                            });
                                        });
                                    }
                                    else {
                                        alert("餘額不足，無法預約此項目。請調整其他項目的預約，或洽詢幹部！");
                                    }

                                }
                                else {
                                    alert("超過人限！");
                                    return;
                                }
                            }
                            else if (childShot.val() != "N" && AppOrDisapp == "Y") { //如果他想出席，但是列表上他根本已經預約過
                                alert("您之前已經預約過，請檢視預約清單！");
                                return;
                            }
                            else if (childShot.val() != "N" && AppOrDisapp == "N") { //如果他想取消預約，而且列表上確實有他的名字
                                attendanceRef.child(curUser.uid).set("N").then(() => {
                                    firebase.database().ref('weeks/' + curWeek + '/Wu/curNum').set(curFriNum - 1);
                                }).then(() => {
                                    userRef.child(curUser.uid + "/Record").push("取消預約：" + cur_time + "由您取消" + (FriDate.getMonth() == 0 ? 12 : FriDate.getMonth()) + "月" + FriDate.getDate().toString() + "日(五)的預約。").then(() => {
                                        userRef.child(curUser.uid + '/YiSanWu/Wu').set("N").then(() => {
                                            var quotaToBeSubtracted;
                                            userRef.child(curUser.uid + "/QuotaToUseThisWeek").once("value").then((snapShot) => {
                                                quotaToBeSubtracted = snapShot.val();
                                            }).then(() => {
                                                userRef.child(curUser.uid + "/QuotaToUseThisWeek").set(quotaToBeSubtracted - 1).then(() => {
                                                    alert("取消預約成功，請檢視預約清單！");
                                                });
                                            });
                                        });
                                    });
                                });
                            }
                            else /*if (childShot.val() == "N" && AppOrDisapp == "N")*/ { //如果他想取消預約，但是列表上根本沒有他
                                alert("您之前並沒有在預約清單上，無法取消預約");
                                return;
                            }
                        }

                    });

                    if (!isUIDInList) { //如果他不在列表上
                        //如果想取消預約，那因為他根本不在列表上面，所以就完全不用管他
                        if (AppOrDisapp == "N") {
                            alert("您之前並沒有在預約清單上，無法取消預約");
                            return;
                        }
                        //如果想預約，而且如果人限檢查沒問題，就可以讓他預約
                        else {
                            if (curFriNum + 1 <= FriLimit) { //人限檢查
                                if (parseInt(document.getElementById("QuotaRemaining").innerHTML, 10) >= parseInt(document.getElementById("QuotaToUseThisWeek").innerHTML, 10) + 1) { //如果Quota充足，就可以讓他預約
                                    attendanceRef.child(curUser.uid).set("Y").then(() => {
                                        firebase.database().ref('weeks/' + curWeek + '/Wu/curNum').set(curFriNum + 1);
                                    }).then(() => {
                                        userRef.child(curUser.uid + "/Record").push("新增預約：" + cur_time + "由您新增" + (FriDate.getMonth() == 0 ? 12 : FriDate.getMonth()) + "月" + FriDate.getDate().toString() + "日(五)的預約。").then(() => {
                                            userRef.child(curUser.uid + '/YiSanWu/Wu').set("Y").then(() => {
                                                var quotaToBeSubtracted;
                                                userRef.child(curUser.uid + "/QuotaToUseThisWeek").once("value").then((snapShot) => {
                                                    quotaToBeSubtracted = snapShot.val();
                                                }).then(() => {
                                                    userRef.child(curUser.uid + "/QuotaToUseThisWeek").set(quotaToBeSubtracted + 1).then(() => {
                                                        alert("預約成功，請檢視預約清單！");
                                                    });
                                                });
                                            });
                                        });
                                    });
                                }
                                else {
                                    alert("餘額不足，無法預約此項目。請調整其他項目的預約，或洽詢幹部！");
                                }
                            }

                            else {
                                alert("超過人限！");
                                return;
                            }
                        }
                    }

                });
            }
        });
    });







}



function openrecOrAnnouncementBlock() {
    var curUser = firebase.auth().currentUser;



    // 本function邏輯： 

    // attendanceList部分：
    // 先將server上面已經有，的不管是“Y”還是“N”的內容（都要），先用once「一次性地」湊成完整的HTMLcode，
    // 不管是Y還是N，我在第一次去做一次性讀入的時候就先寫好他的HTML欄位，並且有著專屬的id。
    // 如果是Y，那innerHTML寫：「12 < br >」   -> 看不懂嗎？去看index.html裡面怎麼寫的！
    // 如果是N，那innerHTML寫：「」（a.k.a. 空）。
    //
    // 之後再用on，
    // 如果是從Y轉換成N，那就把那個id的內容innerHTML弄成「空」即可；
    // 如果是從N轉換成Y，那就把那個id的內容innerHTML弄成相應的內容；
    // 如果是server從「沒有這個list的這一筆」，變成有Y的紀錄，那就使用HTML的appendChild()來新增這個HTMLcode即可。

    // recList部分：
    // 因為rec只會增加不會減少，所以就 ---刪掉刪掉刪掉---先一次性用once讀入並且建構好HTMLcode之後， ---刪掉刪掉刪掉---
    // 針對之後的資料庫實時更新，就用on，搭配HTML的appendChild()來新增這個HTMLcode即可。
    // 上面針對recList部分是錯的，
    // 正確版是：只要註冊一次on(child_added)即可，不用搞once。



    // 架構參考
    // pre： <div class="card-group">

    //      第一個card（一的內容）        
    // card前期（start） <div class="card">
    // card前期（  end） <div class="card-body" id="MonAttendanceList">
    // 根據資料庫更動的項目（title）      <h5 class="card-title" id="MonAttendanceList_Title">Card title</h5>
    // 根據資料庫更動的項目（item ）  <span class="card-text" id="MonAttendanceList_123"><small>12<br></small></span>
    // 根據資料庫更動的項目（item ）  <span class="card-text" id="MonAttendanceList_456"><small>456<br></small></span>
    // 根據資料庫更動的項目（item ）  <span class="card-text" id="MonAttendanceList_789"><small>7890<br></small></span>
    // card收尾（start）   </div>
    // card收尾（start）</div>
    //      第一個card（一的內容）  結束
    // 第二個card
    // 第二個card
    // 收尾： </div>

    //attendanceList部分的code
    {
        var cardGroup_preStr = '<div class="card-group">';
        var cardGroup_postStr = '</div>';

        var card_preStr1 = '<div class="card"><div class="card-body" id="';
        //card_preStr1、card_preStr2之間，需要安插一段str，可能是Mon, Wed, Fri
        var card_preStr2 = 'AttendanceList">';
        var card_postStr = '</div></div>';

        var title1 = '<h5 class="card-title" id="';
        //title1、title2之間，需要安插一段str，可能是Mon, Wed, Fri
        var title2 = 'AttendanceList_Title">Card title</h5>';

        var item_preStr1 = '<span class="card-text" id="';
        //item_preStr1、item_preStr2之間，需要安插一段str，可能是Mon, Wed, Fri
        var item_preStr2 = 'AttendanceList_';
        //item_preStr2、item_preStr3之間，需要安插一段str，是從server那邊得到的UID
        var item_preStr3 = '"><small>';
        var item_post = '</small></span>';



        var MonStr = card_preStr1 + "Mon" + card_preStr2 + title1 + "Mon" + title2;
        var WedStr = card_preStr1 + "Wed" + card_preStr2 + title1 + "Wed" + title2;
        var FriStr = card_preStr1 + "Fri" + card_preStr2 + title1 + "Fri" + title2;
        var entireStr = '';
        var curWeek = -1;
        firebase.database().ref('curWeek').once("value").then((snapShot) => {
            curWeek = snapShot.val();
        }).then(() => {
            firebase.database().ref('weeks/' + curWeek + '/Yi/AttendanceList').on("child_added", (snapShot) => {
                //console.log(snapShot, snapShot.key, snapShot.val());

                if (document.getElementById("attendanceList").innerHTML == "") {
                    if (snapShot.val() == "Y") {
                        var tempStr = item_preStr1 + "Mon" + item_preStr2 + snapShot.key + item_preStr3 + snapShot.key + "<br>" + item_post;
                        MonStr += tempStr;
                    }
                    else if (snapShot.val() != "N") {
                        var tempStr = item_preStr1 + "Mon" + item_preStr2 + snapShot.key + item_preStr3 + snapShot.key + "已入場" + "<br>" + item_post;
                        MonStr += tempStr;
                    }
                    else /*if (childShot.val() == "N")*/ {
                        var tempStr = item_preStr1 + "Mon" + item_preStr2 + snapShot.key + item_preStr3 /*+ snapShot.key + "<br>"*/ + item_post;
                        MonStr += tempStr;
                    }
                }
                else {
                    var tempStr = '<span class="card-text" id="MonAttendanceList_' + snapShot.key + '"><small>' + snapShot.key + '<br></small></span>';
                    document.getElementById("MonAttendanceList_Title").insertAdjacentHTML('beforeend', tempStr);
                }

            });

            firebase.database().ref('weeks/' + curWeek + '/San/AttendanceList').on("child_added", (snapShot) => {
                if (document.getElementById("attendanceList").innerHTML == "") {
                    if (snapShot.val() == "Y") {
                        var tempStr = item_preStr1 + "Wed" + item_preStr2 + snapShot.key + item_preStr3 + snapShot.key + "<br>" + item_post;
                        WedStr += tempStr;
                    }
                    else if (snapShot.val() != "N") {
                        var tempStr = item_preStr1 + "Wed" + item_preStr2 + snapShot.key + item_preStr3 + snapShot.key + "已入場" + "<br>" + item_post;
                        WedStr += tempStr;
                    }
                    else /*if (childShot.val() == "N")*/ {
                        var tempStr = item_preStr1 + "Wed" + item_preStr2 + snapShot.key + item_preStr3 /*+ snapShot.key + "<br>"*/ + item_post;
                        WedStr += tempStr;
                    }
                }
                else {
                    var tempStr = '<span class="card-text" id="WedAttendanceList_' + snapShot.key + '"><small>' + snapShot.key + '<br></small></span>';
                    document.getElementById("WedAttendanceList_Title").insertAdjacentHTML('beforeend', tempStr);
                }

            });

            firebase.database().ref('weeks/' + curWeek + '/Wu/AttendanceList').on("child_added", (snapShot) => {
                if (document.getElementById("attendanceList").innerHTML == "") {
                    if (snapShot.val() == "Y") {
                        var tempStr = item_preStr1 + "Fri" + item_preStr2 + snapShot.key + item_preStr3 + snapShot.key + "<br>" + item_post;
                        FriStr += tempStr;
                    }
                    else if (snapShot.val() != "N") {
                        var tempStr = item_preStr1 + "Fri" + item_preStr2 + snapShot.key + item_preStr3 + snapShot.key + "已入場" + "<br>" + item_post;
                        FriStr += tempStr;
                    }
                    else /*if (childShot.val() == "N")*/ {
                        var tempStr = item_preStr1 + "Fri" + item_preStr2 + snapShot.key + item_preStr3 /*+ snapShot.key + "<br>"*/ + item_post;
                        FriStr += tempStr;
                    }
                }
                else {
                    var tempStr = '<span class="card-text" id="FriAttendanceList_' + snapShot.key + '"><small>' + snapShot.key + '<br></small></span>';
                    document.getElementById("FriAttendanceList_Title").insertAdjacentHTML('beforeend', tempStr);
                }


            });
        }).then(() => {
            MonStr += card_postStr;
            WedStr += card_postStr;
            FriStr += card_postStr;

            entireStr = cardGroup_preStr + MonStr + WedStr + FriStr + cardGroup_postStr;
            document.getElementById("attendanceList").innerHTML = entireStr;

            document.getElementById("MonAttendanceList_Title").innerHTML = document.getElementById("MonDateShow").innerHTML + "預約清單";
            document.getElementById("WedAttendanceList_Title").innerHTML = document.getElementById("WedDateShow").innerHTML + "預約清單";
            document.getElementById("FriAttendanceList_Title").innerHTML = document.getElementById("FriDateShow").innerHTML + "預約清單";
        }).then(() => {
            firebase.database().ref('weeks/' + curWeek + '/Yi/AttendanceList').on("child_changed", (snapShot) => {
                // console.log(snapShot, snapShot.key, snapShot.val());

                if (snapShot.val() == "N" /* Y->N*/) {
                    document.getElementById("MonAttendanceList_" + snapShot.key).innerHTML = "";
                }
                else /*if (snapShot.val() == "Y"  「N->Y」 )*/ {
                    if (document.getElementById("MonAttendanceList_" + snapShot.key) == null) {
                        var tempStr = '<span class="card-text" id="MonAttendanceList_' + snapShot.key + '"><small>' + snapShot.key + '<br></small></span>';
                        document.getElementById("MonAttendanceList_Title").insertAdjacentHTML('beforeend', tempStr);
                    }
                    else {
                        document.getElementById("MonAttendanceList_" + snapShot.key).innerHTML = '<small>' + snapShot.key + '<br></small>';
                    }
                }
            });

            firebase.database().ref('weeks/' + curWeek + '/San/AttendanceList').on("child_changed", (snapShot) => {
                // console.log(snapShot, snapShot.key, snapShot.val());

                if (snapShot.val() == "N" /* Y->N*/) {
                    document.getElementById("WedAttendanceList_" + snapShot.key).innerHTML = "";
                }
                else /*if (snapShot.val() == "Y"  「N->Y」 )*/ {
                    if (document.getElementById("WedAttendanceList_" + snapShot.key) == null) {
                        var tempStr = '<span class="card-text" id="WedAttendanceList_' + snapShot.key + '"><small>' + snapShot.key + '<br></small></span>';
                        document.getElementById("WedAttendanceList_Title").insertAdjacentHTML('beforeend', tempStr);
                    }
                    else {
                        document.getElementById("WedAttendanceList_" + snapShot.key).innerHTML = '<small>' + snapShot.key + '<br></small>';
                    }
                }
            });

            firebase.database().ref('weeks/' + curWeek + '/Wu/AttendanceList').on("child_changed", (snapShot) => {
                // console.log(snapShot, snapShot.key, snapShot.val());

                if (snapShot.val() == "N" /* Y->N*/) {
                    document.getElementById("FriAttendanceList_" + snapShot.key).innerHTML = "";
                }
                else /*if (snapShot.val() == "Y"  「N->Y」 )*/ {
                    if (document.getElementById("FriAttendanceList_" + snapShot.key) == null) {
                        var tempStr = '<span class="card-text" id="FriAttendanceList_' + snapShot.key + '"><small>' + snapShot.key + '<br></small></span>';
                        document.getElementById("FriAttendanceList_Title").insertAdjacentHTML('beforeend', tempStr);
                    }
                    else {
                        document.getElementById("FriAttendanceList_" + snapShot.key).innerHTML = '<small>' + snapShot.key + '<br></small>';
                    }
                }
            });
        });
    }






    // recList部分的code
    {
        var title_preStr = '<div class="card"><div class="card-body"><h5 class="card-title" id="accountLogOrSysLog">帳號紀錄</h5>';
        var title_postStr = '</div></div></div>';

        var content_JiaZhiZhuCe_preStr = '<span class="card-text text-success">';
        var content_KouKuan_preStr = '<span class="card-text text-danger">';
        var content_Others_preStr = '<span class="card-text">';
        var content_All_postStr = '<br></span>';


        var entireAccountRecStr_EXCEPT_title_preStrpostStr = '';
        var countAlreadyPosted = 0, secondCount = 0;
        firebase.database().ref('users/' + curUser.uid + '/Record').once("value").then((snapShot) => {
            snapShot.forEach((childShot) => {
                // console.log(childShot.val());
                // console.log(childShot.val()[0]);

                if (childShot.val()[0] == "加" || childShot.val()[0] == "註") {
                    entireAccountRecStr_EXCEPT_title_preStrpostStr += content_JiaZhiZhuCe_preStr + childShot.val() + content_All_postStr;

                    countAlreadyPosted++;
                }
                else if (childShot.val()[0] == "扣") {
                    entireAccountRecStr_EXCEPT_title_preStrpostStr += content_KouKuan_preStr + childShot.val() + content_All_postStr;

                    countAlreadyPosted++;
                }
                else {
                    entireAccountRecStr_EXCEPT_title_preStrpostStr += content_Others_preStr + childShot.val() + content_All_postStr;

                    countAlreadyPosted++;
                }
            });
            // entireAccountRecStr += title_postStr;

            document.getElementById("recList").innerHTML = title_preStr + entireAccountRecStr_EXCEPT_title_preStrpostStr + title_postStr;
        }).then(() => {
            firebase.database().ref('users/' + curUser.uid + '/Record').on("child_added", (snapShot) => {
                // console.log(snapShot.val());
                // console.log(snapShot.val()[0]);

                if (secondCount < countAlreadyPosted) { //代表這則訊息其實已PO過了，不用更新HTML code
                    // 就不用做事
                }
                else {
                    if (snapShot.val()[0] == "加" || snapShot.val()[0] == "註") {
                        entireAccountRecStr_EXCEPT_title_preStrpostStr += content_JiaZhiZhuCe_preStr + snapShot.val() + content_All_postStr;
                    }
                    else if (snapShot.val()[0] == "扣") {
                        entireAccountRecStr_EXCEPT_title_preStrpostStr += content_KouKuan_preStr + snapShot.val() + content_All_postStr;
                    }
                    else {
                        entireAccountRecStr_EXCEPT_title_preStrpostStr += content_Others_preStr + snapShot.val() + content_All_postStr;
                    }

                    document.getElementById("recList").innerHTML = title_preStr + entireAccountRecStr_EXCEPT_title_preStrpostStr + title_postStr;
                }

                secondCount++;


                //註冊這二個addEventListener純屬因為我不懂為啥只要一在下面的then()裡面的once("value")之後再弄on('任何東西，不管是child_changed或child_added')，都會直接把我的「帳號紀錄」HTMLcode砍掉......
                document.getElementById("resInfosAndButtons").addEventListener('mouseover', ev => {
                    // console.log(ev);

                    firebase.database().ref('users/' + curUser.uid + '/AccumulatedUse').once("value").then(snapShot => {
                        // console.log(snapShot);
                        // console.log(snapShot.key);
                        // console.log(snapShot.val());
                        if (snapShot.key == "AccumulatedUse") {
                            document.getElementById("accountLogOrSysLog").innerHTML = "帳號紀錄：目前累計扣款" + snapShot.val() + "堂課。"
                        }
                    });
                });
                document.getElementById("resInfosAndButtons").addEventListener('mousemove', ev => {
                    // console.log(ev);

                    firebase.database().ref('users/' + curUser.uid + '/AccumulatedUse').once("value").then(snapShot => {
                        // console.log(snapShot);
                        // console.log(snapShot.key);
                        // console.log(snapShot.val());
                        if (snapShot.key == "AccumulatedUse") {
                            document.getElementById("accountLogOrSysLog").innerHTML = "帳號紀錄：目前累計扣款" + snapShot.val() + "堂課。"
                        }
                    });
                });
                document.getElementById("resInfosAndButtons").addEventListener('touchmove', ev => {
                    // console.log(ev);

                    firebase.database().ref('users/' + curUser.uid + '/AccumulatedUse').once("value").then(snapShot => {
                        // console.log(snapShot);
                        // console.log(snapShot.key);
                        // console.log(snapShot.val());
                        if (snapShot.key == "AccumulatedUse") {
                            document.getElementById("accountLogOrSysLog").innerHTML = "帳號紀錄：目前累計扣款" + snapShot.val() + "堂課。"
                        }
                    });
                });
            });
        }).then(() => {
            firebase.database().ref('users/' + curUser.uid + '/AccumulatedUse').once("value").then(snapShot => {
                if (snapShot.key == "AccumulatedUse") {
                    document.getElementById("accountLogOrSysLog").innerHTML = "帳號紀錄：目前累計扣款" + snapShot.val() + "堂課。"
                }
            });

            // firebase.database().ref('users/' + curUser.uid).on("child_added", (snapShot) => {

            // });
        });


    }




}


function changeToSysLog() {
    document.getElementById("QRCode").innerHTML = "";

    document.getElementById("refreshBtn").innerHTML = "";

    document.getElementById("QuotaStatus").innerHTML = "";
    document.getElementById("resInfosAndButtons").innerHTML = "";

    // document.getElementById("recList").innerHTML = ""; //只剩下要顯示這個，所以其餘的東西都要清空。 這個內容也要清空，剩下殼還在，寫在下面再清
    document.getElementById("attendanceList").innerHTML = "";
    document.getElementById("announceBox").innerHTML = "";
    // document.getElementById("recOrAnnouncementBlock").innerHTML = "";
    document.getElementById("announceList").innerHTML = "";


    document.getElementById("recList").innerHTML = "";//上面所說的「下面再清」，已經處理完畢 //其實應該做的是轉換內容，所以寫在下一行
    var sysLog_preStr = '<div class="card"><div class="card-body"><h5 class="card-title" id="accountLogOrSysLog">系統日誌</h5>';
    var sysLog_postStr = '</div></div>';
    var listItem_preStr = '<span class="card-text">';
    var listItem_postStr = '<br></span>';

    var entireStr = sysLog_preStr;
    firebase.database().ref('weeklySysRec').once("value").then(snapShot => {
        snapShot.forEach(childShot => {
            entireStr += listItem_preStr + childShot.val() + listItem_postStr;
        });

        entireStr += sysLog_postStr;

        document.getElementById("recList").innerHTML = entireStr;
    });


}


function changeToAccountsList() { //和系統日誌架構相同，都是使用recList
    document.getElementById("QRCode").innerHTML = "";

    document.getElementById("refreshBtn").innerHTML = "";

    document.getElementById("QuotaStatus").innerHTML = "";
    document.getElementById("resInfosAndButtons").innerHTML = "";

    // document.getElementById("recList").innerHTML = ""; //只剩下要顯示這個，所以其餘的東西都要清空。 這個內容也要清空，剩下殼還在，寫在下面再清
    document.getElementById("attendanceList").innerHTML = "";
    document.getElementById("announceBox").innerHTML = "";
    // document.getElementById("recOrAnnouncementBlock").innerHTML = "";
    document.getElementById("announceList").innerHTML = "";


    document.getElementById("recList").innerHTML = "";//上面所說的「下面再清」，已經處理完畢 //其實應該做的是轉換內容，所以寫在下一行
    var accountsList_preStr = '<div class="card"><div class="card-body"><h5 class="card-title" id="accountsList">帳號列表（排序功能太難寫了抱歉）</h5><span class="card-text"><table class="table table-striped table-hover table-sm"><thead><tr><th scope="col">#</th><th scope="col">E-mail</th><th scope="col">姓名</th><th scope="col">UID</th><th scope="col">剩餘</th><th scope="col">已使用</th><th scope="col">幹部帳號</th></tr></thead><tbody>';
    var accountsList_postStr = '</tbody></table><br></span></div></div>';
    var listItem_prepreStr = '<tr>';
    var listItem_postpostStr = '</tr>';
    var listItem_idx_preStr = '<th scope="row">';
    var listItem_idx_postStr = '</th>';
    var listItem_otherFields_preStr = '<td>';
    var listItem_otherFields_postStr = '</td>';


    var entireStr = accountsList_preStr;
    firebase.database().ref('users').once("value").then(snapShot => {
        var num = snapShot.numChildren();
        var curIdx = 1;

        var quotaLevel = [6, 12, 24, 36];
        var quotaLevelCorrespondingMoney_original = [1000, 1200, 1400, 1600];
        const earlyBirdsConst = -100;
        var quotaLevelCorrespondingMoney_earlyBirds = [1000 + earlyBirdsConst, 1200 + earlyBirdsConst, 1400 + earlyBirdsConst, 1600 + earlyBirdsConst];
        var quotaLevel_eachElementCounts = [0, 0, 0, 0];

        var totalQuotaRemaining = 0;
        var totalAcculumatedUse = 0;
        snapShot.forEach(childShot => {
            var eMail = childShot.val().Email;
            var name = childShot.val().Name;
            var UID = childShot.val().UID;
            var quotaRemaining = childShot.val().QuotaRemaining;
            var accumulatedUse = childShot.val().AccumulatedUse;
            var isAdmin = childShot.val().admin == "Y" ? "✓" : " ";

            // 這段完全是在計算累計的quotaRemaining以及累計的accumulatedUse，以呈現在表格的總計欄位裡面。
            totalAcculumatedUse += accumulatedUse;
            totalQuotaRemaining += quotaRemaining >= 60 ? 39 : quotaRemaining;

            // 這段是在分別計算每個社員所繳交的社費是多少
            if (childShot.val().admin != "Y") {
                var totalQuota = quotaRemaining + accumulatedUse;
                for (var i = quotaLevel.length - 1; i >= 0; i--) {
                    if (totalQuota >= quotaLevel[i]) {
                        quotaLevel_eachElementCounts[i] += 1;
                        break;
                    }
                }
            }



            var listEntireStr = listItem_prepreStr + listItem_idx_preStr + curIdx + listItem_idx_postStr + listItem_otherFields_preStr + eMail + listItem_otherFields_postStr + listItem_otherFields_preStr + name + listItem_otherFields_postStr + listItem_otherFields_preStr + UID + listItem_otherFields_postStr + listItem_otherFields_preStr + quotaRemaining + listItem_otherFields_postStr + listItem_otherFields_preStr + accumulatedUse + listItem_otherFields_postStr + listItem_otherFields_preStr + isAdmin + listItem_otherFields_postStr + listItem_postpostStr;
            entireStr += listEntireStr;
            curIdx++;
        });

        var lastRow_showingTotal = listItem_prepreStr + listItem_idx_preStr + "總計" + listItem_idx_postStr + listItem_otherFields_preStr + " " + listItem_otherFields_postStr + listItem_otherFields_preStr + " " + listItem_otherFields_postStr + listItem_otherFields_preStr + " " + listItem_otherFields_postStr + listItem_otherFields_preStr + totalQuotaRemaining + listItem_otherFields_postStr + listItem_otherFields_preStr + totalAcculumatedUse + listItem_otherFields_postStr + listItem_otherFields_preStr + " " + listItem_otherFields_postStr + listItem_postpostStr;
        entireStr += lastRow_showingTotal;

        entireStr += "<br><span>注意：以下列表中，如果購買的是無限額度，或者具有幹部身分，則該帳號的可用餘額在加總的時候以39計算，以利幹部計算發出去的餘額是否太多。</span>"





        var moneyEarned_usingEarlyBirdsToCount = 0;
        var moneyEarned_usingOriginalToCount = 0;
        for (var i = 0; i < quotaLevel.length; i++) {
            moneyEarned_usingEarlyBirdsToCount += quotaLevelCorrespondingMoney_earlyBirds[i] * quotaLevel_eachElementCounts[i];
            moneyEarned_usingOriginalToCount += quotaLevelCorrespondingMoney_original[i] * quotaLevel_eachElementCounts[i];
        }

        var numOfPeople_andMoneyCount_str = "";
        for (var i = 0; i < quotaLevel.length; i++) {
            numOfPeople_andMoneyCount_str += "購買" + quotaLevel[i] + "個額度的社員共有" + quotaLevel_eachElementCounts[i] + "人。\n"
        }
        numOfPeople_andMoneyCount_str += "若全部以早鳥優惠計算，a.k.a. ";
        for (var i = 0; i < quotaLevel.length; i++) {
            numOfPeople_andMoneyCount_str += quotaLevelCorrespondingMoney_earlyBirds[i] + ", ";
        }
        numOfPeople_andMoneyCount_str += "respectively， 則總共收入" + moneyEarned_usingEarlyBirdsToCount + "元。\n";
        numOfPeople_andMoneyCount_str += "若全部以原價計算，a.k.a. ";
        for (var i = 0; i < quotaLevel.length; i++) {
            numOfPeople_andMoneyCount_str += quotaLevelCorrespondingMoney_original[i] + ", ";
        }
        numOfPeople_andMoneyCount_str += "respectively， 則總共收入" + moneyEarned_usingOriginalToCount + "元。\n";

        entireStr += "<br><span>" + numOfPeople_andMoneyCount_str.replace(/\n/g, "<br>") + "</span>";


        entireStr += accountsList_postStr;


        document.getElementById("recList").innerHTML = entireStr;
    });





    //     <table class="table table-striped table-hover table-sm">
    //     <thead>
    //         <tr>
    //             <th scope="col">#</th>
    //             <th scope="col">E-mail</th>
    //             <th scope="col">姓名</th>
    //             <th scope="col">UID</th>
    //             <th scope="col">剩餘額度</th>
    //             <th scope="col">已使用額度</th>
    //             <th scope="col">具有管理身分</th>
    //         </tr>
    //     </thead>
    //     <tbody>
    //         <tr>
    //             <th scope="row">1</th>
    //             <td>Mark</td>
    //             <td>Otto</td>
    //             <td>@mdo</td>
    //             <td>？？？</td>
    //             <td>？？？</td>
    //             <td>？？？</td>
    //         </tr>
    //     </tbody>
    // </table>


}

















function changeToBulletinBoard() {
    document.getElementById("QRCode").innerHTML = "";

    document.getElementById("refreshBtn").innerHTML = "";

    document.getElementById("QuotaStatus").innerHTML = "";
    document.getElementById("resInfosAndButtons").innerHTML = "";
    document.getElementById("attendanceList").innerHTML = "";
    document.getElementById("recList").innerHTML = "";


    //任何人都可以看到公告，不需要登入
    firebase.database().ref('announcements').once("value").then(snapShot => {
        var priorityYi = [];
        var priorityEr = [];
        var prioritySan = [];
        var zhiDingYi = [];
        var zhiDingEr = [];
        var zhiDingSan = [];

        snapShot.forEach(childShot => {
            if (childShot.val()[0] == '壱') {
                priorityYi[priorityYi.length] = childShot.val().replace(/壱/g, "");
            }
            else if (childShot.val()[0] == '弐') {
                priorityEr[priorityEr.length] = childShot.val().replace(/弐/g, "");
            }
            else if (childShot.val()[0] == '参') {
                prioritySan[prioritySan.length] = childShot.val().replace(/参/g, "");
            }
            else /*if (childShot.val()[0] == '玖')*/ {
                if (childShot.val()[1] == '壱') {
                    zhiDingYi[zhiDingYi.length] = childShot.val().replace(/玖壱/g, "");//.replace(/<div class="card">/g, '<div class="card bg-warning">');
                }
                else if (childShot.val()[1] == '弐') {
                    zhiDingEr[zhiDingEr.length] = childShot.val().replace(/玖弐/g, "");//.replace(/<div class="card">/g, '<div class="card bg-warning">');
                }
                else /*if (childShot.val()[1] == '参')*/ {
                    zhiDingSan[zhiDingSan.length] = childShot.val().replace(/玖参/g, "");//.replace(/<div class="card">/g, '<div class="card bg-warning">');
                }

                //原本把有置頂的公告用黃底色顯示，但覺得很醜，所以上面二個replace都註解掉了（不改成黃底色）。改成下面的：用圖釘Emoji包覆在公告標題兩側，來顯示是置頂公告
            }
        });


        var priorityYiStr = priorityYi.reverse().join(''); //reverse是為了要讓最新的公告放到最上面
        var priorityErStr = priorityEr.reverse().join('');
        var prioritySanStr = prioritySan.reverse().join('');
        var zhiDingYiStr = zhiDingYi.reverse().join('').replace(/title">/g, 'title">&#128204;&#128204;置頂公告：').replace(/<\/h5>/g, '&#128204;&#128204;</h5>');
        var zhiDingErStr = zhiDingEr.reverse().join('').replace(/title">/g, 'title">&#128204;&#128204;置頂公告：').replace(/<\/h5>/g, '&#128204;&#128204;</h5>');
        var zhiDingSanStr = zhiDingSan.reverse().join('').replace(/title">/g, 'title">&#128204;&#128204;置頂公告：').replace(/<\/h5>/g, '&#128204;&#128204;</h5>');

        var entireStr = zhiDingSanStr + zhiDingErStr + zhiDingYiStr + prioritySanStr + priorityErStr + priorityYiStr;

        document.getElementById("announceList").innerHTML = entireStr;
    });






    // 但是必須先確認是否是幹部，如果是幹部的話才可以張貼公告（放在比較後面）
    // 張貼公告的HTMLcode如下
    var announcementMainContent_preStr = '<br><div class="card"><div class="card-body"><h5 class="card-title">';
    //announcementMainContent_preStr, announcementMainContent_midStr1中間要寫公告的標題   （ex: 這是第0則公告的標題）
    var announcementMainContent_midStr1 = '</h5><span class="card-text">';
    //announcementMainContent_midStr1, announcementMainContent_midStr2中間要寫「先寫公告張貼時間與張貼人（後來新增的功能）」，再寫公告的內文   （ex: 這是第0則公告的內文）

    //後來新增的
    var announcementMainContent_midMidStr1 = '<small><span class="text-muted text-right">';
    var announcementMainContent_midMidStr2 = '</span></small><br><br>';
    //後來新增的

    var announcementMainContent_midStr2 = '<br></span><br><br>';
    //announcementMainContent_midStr2後面要接整個picList，也就是picList_totalStr。

    var picList_preStr = '<ul class="list-unstyled">';
    var picItem_preStr1 = '<li class="media"><a href="';
    //picItem_preStr1, picItem_preStr2中間要填寫server上面的圖片的網址
    var picItem_preStr2 = '" target="_blank"><img src="';
    //picItem_preStr2, picItem_midStr1中間要填寫server上面的圖片的網址
    var picItem_midStr1 = '"width="75" height="75" class="mr-3" alt="你的網路太爛，讀取圖片失敗"></a><div class="media-body"><h6 class="mt-0 mb-1 font-weight-bold">';
    //picItem_midStr1, picItem_midStr2中間要填寫圖片標題   （ex: 圖一：測試測試）
    var picItem_midStr2 = '</h6>';
    //picItem_midStr2, picItem_postStr中間要填寫圖片內文   （ex: 圖一：圖一內文）
    var picItem_postStr = '</div></li><br>';

    var picList_postStr = '</ul>';

    var announcementMainContent_postStr = '</div></div>';




    var picItems_totalStr = '';





    //先確認是否是幹部的JS code
    var curUser = firebase.auth().currentUser;
    var userName;
    firebase.database().ref('users/' + curUser.uid + '/Name').once("value").then(snapShot => {
        userName = snapShot.val();
    });//這是為了公告的時候顯示張貼人。//這個寫法是在打賭張貼人的打字速度比網路得到帳號資訊來的慢，所以有可能出現錯誤(張貼人呈現undefined)
    firebase.database().ref('users/' + curUser.uid + '/admin').once("value").then(snapShot => {
        if (snapShot.val() == "Y") {
            var uploadingPostAndImgs_str = '<h5 class="border-bottom border-gray pb-2 mb-0">New Post：<br><small>注意操作流程！<br>一、如果需要添加圖片，請<span class="text-danger">依照圖片順序</span>先填寫圖片標題以及圖片描述，之後點按<span class="text-success">上傳圖片</span>的按鈕。<br>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;只要一點按<span class="text-success">上傳圖片</span>的按鈕並且選取好圖片，馬上就會上傳到伺服器了！所以操作流程不能順序不對！<br>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;上傳成功的話會跳出通知，並且圖片標題以及內文的填寫欄位會被清空，此時就可以上傳第二、第二、第⋯⋯張圖片。<br>二、之後再填寫公告標題以及內文，確認完成後再點按<span class="text-success">張貼公告</span>的按鈕，重新整理之後就可以看到公告內容了。<br>二、建議先用word擬定好草稿，如果流程順序不對的話，請重新整理網頁之後重用。<br>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;（只要沒有點按<span class="text-success">張貼公告</span>，之前的操作(包括上傳圖片)一律會被伺服器作廢）<br>四、圖片描述兩行是最好看的，最好你能夠寫成不多不少剛好兩行。（本系統能夠正常讀取enter換行）（顏文字或表情符號也都可以！٩(˃̶͈̀௰˂̶͈́)و）<br>五、上色功能：如果要針對某段文字上色，例如：<span class="text-success">這是綠色</span>，那請你就把「這是綠色」這四個中文字用程式碼取代，<br>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;變成「&lt;span class="text-success(text-success可以替換成以下支援的顏色，例如text-info，以此類推)"&gt;這是綠色&lt;/span&gt;」，系統就會幫你上色。<br>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;總共有下列幾種顏色：<span class="text-primary">primary(藍色)</span>, <span class="text-secondary">secondary(灰色)</span>, <span class="text-success">success(綠色)</span>, <span class="text-danger">danger(紅色)</span>, <span class="text-warning">warning(黃色)</span>, <span class="text-info">info(藍中帶綠)</span>。<br>六、超連結功能：如果想針對某段文字添加超連結，一樣請你用程式碼取代一下。例如：想把「我好帥」新增超連結，則就改成<br>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;「&lt;a href="網址放這裡" target="_blank"&gt;我好帥&lt;/a&gt;」。注意，網址必須是http或https開頭，否則會出錯！<br>七、字體粗細功能：本系統支援：<br>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;(1)<span class="font-weight-bold">粗體</span>，請把想要弄成粗體的文字用程式碼「&lt;span class="font-weight-bold"&gt;那個文字&lt;/span&gt;」取代。<br>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;(2)<span class="font-weight-light">細體</span>，請把想要弄成細體的文字用程式碼「&lt;span class="font-weight-light"&gt;那個文字&lt;/span&gt;」取代。<br>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;(3)<span class="font-italic">斜體</span>，請把想要弄成斜體的文字用程式碼「&lt;span class="font-italic"&gt;那個文字&lt;/span&gt;」取代。<br><span class="text-muted">小PS：五、六、七以上這3點，不管是公告的標題或內文，或者圖片的標題或描述，都適用。</span><br><br>八、置頂功能、優先度功能：本系統設計成，由上往下，先顯示置頂貼文，再顯示非置頂貼文。<br>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;所有置頂貼文中，分成二個優先度，由上往下，從最優先顯示到最不優先。在同個優先度中，由上往下，從最新的貼文顯示到最舊的貼文。<br>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;所有非置頂貼文的排序方式亦同。<br>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;但因為置頂貼文會以黃色作為底色，所以<span class="text-danger">如果要上色，要注意</span>！</small></h5><textarea rows="2" cols="64" id="mainTitle" style="resize:none" placeholder="公告標題"></textarea><textarea rows="2" cols="64" id="picTitle" style="resize:none" placeholder="圖片標題"></textarea><textarea rows="10" cols="64" id="mainContent" style="resize:none" placeholder="公告內文"></textarea><textarea rows="10" cols="64" id="picContent" style="resize:none" placeholder="圖片描述"></textarea><div>本則公告優先度：(最不優先)&nbsp;<input type="radio" id="ichi" name="drone" value="ichi" checked><label for="ichi">1</label>&nbsp;&nbsp;&nbsp;<input type="radio" id="ni" name="drone" value="ni"><label for="ni">2</label>&nbsp;&nbsp;&nbsp;<input type="radio" id="san" name="drone" value="san"><label for="san">3</label>&nbsp;&nbsp;(最優先)&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<input type="checkbox" id="zhiDing" name="zhiDing"><label for="zhiDing">置頂這則公告</label></div><div class="media text-muted pt-3"><button id="submitButton" type="button" class="btn btn-success">張貼公告</button><label class="pl-3" for="imgButton"><div class="btn btn-success" id="upload"><input type="file" id="imgButton" style="display:none;">上傳圖片</div></label></div>';
            document.getElementById("announceBox").innerHTML = uploadingPostAndImgs_str;


            var imgBtn = document.getElementById('imgButton');
            imgBtn.addEventListener('change', function (event) {
                if (document.getElementById("picTitle").value == "" || document.getElementById("picContent").value == "") {
                    alert("圖片標題與圖片描述，都不能是空白！上傳圖片失敗！");
                    imgBtn.value = null; //因為input是file,所以不能是""，而是必須改成null
                    return;
                }
                if (imgBtn.value == null) { //這個if 是為了上面那個if裡面的code的設計，所設計的
                    return;
                }


                console.log(event);
                var toBeUploadedFile = document.getElementById('imgButton').files[0];
                console.log(toBeUploadedFile);
                var imgURL = "";


                var storageRef = firebase.storage().ref('pics');
                var imgRef = storageRef.child(toBeUploadedFile.name);
                imgRef.put(toBeUploadedFile).then((snapshot) => {
                    console.log('Uploaded a blob or file!');
                    console.log(snapshot);
                }).then(() => {
                    imgRef.getDownloadURL().then((url) => {
                        //imgURL = url;

                        var picTitle = document.getElementById("picTitle").value;
                        var picContent = document.getElementById("picContent").value;

                        picItems_totalStr += picItem_preStr1 + url + picItem_preStr2 + url + picItem_midStr1 + picTitle + picItem_midStr2 + picContent + picItem_postStr;
                        alert("成功上傳圖片！");

                        imgBtn.value = null;
                        document.getElementById("picTitle").value = "";
                        document.getElementById("picContent").value = "";
                    });
                }).catch((err) => {
                    alert("圖片上傳失敗！");
                    imgBtn.value = null; //因為input是file,所以不能是""，而是必須改成null
                });
            });




            var submitButton = document.getElementById('submitButton');
            submitButton.addEventListener('click', function (event) {
                // 先處理這則公告的優先度
                // 「是否置頂」以及「優先度」整合在一個字串中
                // ex：如果有置頂、優先度1，priority字串就會是：「玖壱」；
                // ex：如果無置頂、優先度1，priority字串就會是：「壱」；
                // 原本是想用「𥝱」，但因為JS竟然有不支援的字，所以只好改成「玖」

                //先考慮置頂
                var priority = document.getElementById("zhiDing").checked ? "玖" : "";

                //再考慮優先度
                if (document.getElementsByName("drone")[0].checked)
                    priority += "壱";
                else if (document.getElementsByName("drone")[1].checked)
                    priority += "弐";
                else if (document.getElementsByName("drone")[2].checked)
                    priority += "参";




                var picList_totalStr = ((picItems_totalStr == '') ? ('') : (picList_preStr + picItems_totalStr + picList_postStr));

                var mainTitle = document.getElementById("mainTitle").value;
                var mainContent = document.getElementById("mainContent").value;
                if (mainTitle == "" || mainContent == "") {
                    alert("公告標題與公告內容，都不能是空白！上傳公告失敗！");
                    return;
                }

                var announcerAndAnnounceTime = userName + " 於 " + getDateTimeStr();
                // console.log(announcerAndAnnounceTime);

                var announcement_totalStr = announcementMainContent_preStr + mainTitle + announcementMainContent_midStr1 + announcementMainContent_midMidStr1 + announcerAndAnnounceTime + announcementMainContent_midMidStr2 + mainContent.replace(/ /g, "&nbsp;")/*正確顯示縮排*/.replace(/&nbsp;href/g, " href").replace(/&nbsp;target/g, " target").replace(/&nbsp;class/g, " class") + announcementMainContent_midStr2 + picList_totalStr + announcementMainContent_postStr;
                announcement_totalStr = announcement_totalStr.replace(/\n/g, "<br>");//接受使用者換行，並且提供正確的換行顯示
                //announcement_totalStr = announcement_totalStr.replace(/ /g, "&nbsp;");//正確顯示縮排

                firebase.database().ref('announcements').push(priority + announcement_totalStr).then((suc) => {
                    document.getElementById("mainTitle").value = "";
                    document.getElementById("mainContent").value = "";
                    alert("成功上傳公告！重新整理網頁之後就看得到最新公告了！（幹部的操作功能我懶得設計得那麼好啦QQ）");
                }, (err) => {
                    alert("上傳公告失敗！");
                });
            });
        }
    });








}





function showQRCode() {
    var current = new Date();//獲取當前時間
    const startTime = new Date(1975, 8, 19, 17, 25, 00);
    const endTime = new Date(1975, 8, 19, 17, 35, 00);

    var curUser = firebase.auth().currentUser;
    var Name;

    var backgroundColour = 'FFE0E0';//紅色
    var mainColour = '602020';//紅色
    var curDateOfWeek;

    var curWeek;
    var curYear = "NaN";
    var curMonth = "NaN";
    var curDate = "NaN";
    var cur_time;
    var nameRef = firebase.database().ref('users/' + curUser.uid + '/Name');
    nameRef.once("value").then(snapShot => {
        Name = snapShot.val();

        var QRCodeRef = firebase.database().ref('QRCodeInfo');
        QRCodeRef.once("value").then((snapShot) => {
            backgroundColour = snapShot.val().backgroundColour;
            mainColour = snapShot.val().mainColour;
            var tempCurDateOfWeek = snapShot.val().curDateOfWeek;

            if (tempCurDateOfWeek == "Mon")
                curDateOfWeek = "Yi";
            else if (tempCurDateOfWeek == "Wed")
                curDateOfWeek = "San";
            else if (tempCurDateOfWeek == "Fri")
                curDateOfWeek = "Wu";
            else
                curDateOfWeek = "NaN";
        }).then(() => {
            var curWeekRef = firebase.database().ref('curWeek');
            curWeekRef.once("value").then(snapShot => {
                curWeek = snapShot.val();
            }).then(() => {
                var curMonthAndDateRef = firebase.database().ref('weeks/' + curWeek + '/' + curDateOfWeek);
                curMonthAndDateRef.once("value").then(snapShot => {
                    if (snapShot.val() != null) {/*如果是curDateOfWeek是NaN，這裡val()出來會是null*/
                        curYear = parseInt(snapShot.val().Year, 10);
                        curMonth = parseInt(snapShot.val().Month, 10);
                        curDate = parseInt(snapShot.val().Date, 10);
                    }
                }).then(() => {
                    cur_time = getDateTimeStr();

                    // console.log(current);
                    // console.log(current.getMonth());
                    // console.log(cur_time);
                    current.setMonth(current.getMonth() + 1);
                    // console.log(current);

                    if (curYear != "NaN") {
                        startTime.setFullYear(curYear);
                        startTime.setMonth(curMonth);
                        startTime.setDate(curDate);

                        endTime.setFullYear(curYear);
                        endTime.setMonth(curMonth);
                        endTime.setDate(curDate);
                    }
                }).then(() => {
                    var userAttendanceRef = firebase.database().ref('weeks/' + curWeek + '/' + curDateOfWeek + '/AttendanceList/' + curUser.uid);
                    userAttendanceRef.once("value").then(snapShot => {
                        /*如果是curDateOfWeek是NaN，這裡val()出來會是null*/

                        //QRCode文字和顏色「分開」處理！！！
                        // console.log(snapShot.val());
                        // 顯示QRCode顏色的部分，有嚴格按照「日期」去判定是否有到，和admissionTicket不一樣

                        var errCorLvl = qrcodegen.QrCode.Ecc.LOW; // Error correction level
                        // var qr = qrcodegen.QrCode.encodeText(QRCodeText, errCorLvl); // Make the QR Code symbol
                        if (!(snapShot.val() == "Y" && startTime <= current /*&& current <= endTime 即便改成交由幹部去操作是否開放驗票，時間上至少也一定要超過預約的期限之後才能驗票*/)) {
                            //因為在上面某一個snapShot就已經把顏色改成有預約且在有效時段內的顏色了，所以這裡的code邏輯改成
                            //如果沒有預約，或者沒有在有效時段內，就改回來成紅色的樣子
                            backgroundColour = 'FEA4A4';
                            mainColour = '3D5CA4';
                        }

                        var verificationSiteStr = window.location.protocol/*semicolon included*/ + "//" + window.location.host.replace("firebaseapp.com", "web.app")/*如果用不同網址，手機會不知道是同一個網站，所以會找不到cookie。如果用不同網址的話，幹部的手機就會一直顯示未登入，所以幹部一定要用web.app那個網址*/ + "/admissionTicket.html?UID=" + curUser.uid + "&Date=" + curDateOfWeek + "&Time=" + cur_time.replace(/ /g, "").replace(/\//g, "").replace(/:/g, "").replace(/,/g, "")/*cur_time是因為每次時間都不一樣，這樣可以有效造成每次網址都不一樣。只有網址不一樣，手機瀏覽器才會強制更新*/;
                        var qr2 = qrcodegen.QrCode.encodeText(verificationSiteStr, errCorLvl);
                        drawCanvas(qr2, 6, 5, "#" + backgroundColour, "#" + mainColour, appendCanvas(curMonth + "月" + curDate + "日通行碼"));
                        console.log(verificationSiteStr);

                    });
                });
            });
        });
    });


}



function changeQRCodeColour() {
    var backgroundColour_new = document.getElementById("QRCodeBackgroundColour").value;
    var mainColour_new = document.getElementById("QRCodeMainColour").value;
    backgroundColour_new = backgroundColour_new.replace(/#/g, "");//把原本字串開頭的'#'刪掉
    mainColour_new = mainColour_new.replace(/#/g, "");//把原本字串開頭的'#'刪掉

    var QRCodeInfoRef = firebase.database().ref('QRCodeInfo');
    QRCodeInfoRef.update({
        backgroundColour: backgroundColour_new,
        mainColour: mainColour_new
    }).then(() => {
        alert("QRCode顏色更新成功！");
        return;
    });
}



function changeQRCode_dayOfWeek(dayOfWeek) {
    var QRCodeInfoRef = firebase.database().ref('QRCodeInfo');
    QRCodeInfoRef.update({
        curDateOfWeek: dayOfWeek
    }).then(() => {
        if (dayOfWeek == "Mon") {
            alert("系統已經成功開啟週一驗票！");
        }
        else if (dayOfWeek == "Wed") {
            alert("系統已經成功開啟週二驗票！");
        }
        else if (dayOfWeek == "Fri") {
            alert("系統已經成功開啟週五驗票！");
        }
        else {
            alert("系統已經成功關閉驗票！");
        }
        return;
    });
}

function forceToRefresh(methodID) {
    var cur_time_URLuse = getDateTimeStr().replace(/ /g, "").replace(/\//g, "").replace(/:/g, "").replace(/,/g, "");

    var newURL = window.location.protocol/*semicolon included*/ + "//" + window.location.host.replace("firebaseapp.com", "web.app") + "/index.html?Time=" + cur_time_URLuse;

    if (methodID == "method1") {
        location.reload(true);
    }
    else {
        window.location = newURL;
    }
}



function daiQian() {
    var curUser = firebase.auth().currentUser;


    var goalEmail = document.getElementById("daiQianEmail").value;
    if (goalEmail.search("@") == -1) {
        goalEmail += "@gmail.com";
    }

    var goalUID;
    var curWeek;
    var curDateOfWeek;
    var curDateOfWeek_Chi;
    firebase.database().ref('users').once("value").then(snapShot => {
        snapShot.forEach(childShot => {
            if (childShot.val().Email == goalEmail) {
                goalUID = childShot.key;

                navigator.clipboard.writeText(goalUID).then(function () {
                }).then(() => {
                    firebase.database().ref('QRCodeInfo/curDateOfWeek').once("value").then(snapShot => {
                        if (snapShot.val() == 'Mon') {
                            curDateOfWeek = 'Yi';
                            curDateOfWeek_Chi = '一';
                        }
                        else if (snapShot.val() == 'Wed') {
                            curDateOfWeek = 'San';
                            curDateOfWeek_Chi = '二';
                        }
                        else if (snapShot.val() == 'Fri') {
                            curDateOfWeek = 'Wu';
                            curDateOfWeek_Chi = '五';
                        }
                        else {
                            curDateOfWeek = 'NaN';
                            curDateOfWeek_Chi = 'NaN';
                        }
                    }).then(() => {
                        if (curDateOfWeek == 'NaN') {
                            alert('請先啟用驗票功能！');
                        }
                        else {
                            firebase.database().ref('curWeek').once("value").then(snapShot => {
                                curWeek = snapShot.val();
                            }).then(() => {
                                var UID_ref = firebase.database().ref('weeks/' + curWeek + '/' + curDateOfWeek + '/AttendanceList/' + goalUID);

                                UID_ref.once("value").then(snapShot => {
                                    if (snapShot.val() == 'N' || snapShot.val() == null) {
                                        alert("沒有預約，不得入場！\n請在預約系統的預約清單內檢查是否確實有預約！\n已經將UID複製完成！\nUID：" + goalUID);
                                    }
                                    else if (snapShot.val() == 'Y') {
                                        var curTime = getDateTimeStr();

                                        // console.log(curTime);
                                        // console.log(dateOfWeek);
                                        // console.log("Verified @ " + curTime);
                                        // console.log('users/' + curUser.uid + '/YiSanWu/' + dateOfWeek);

                                        UID_ref.set("Verified @ " + curTime).then(() => {
                                            var VerifiedOKedUIDPushingRecordRef = firebase.database().ref('users/' + goalUID + '/Record');
                                            var recToPush = '入場紀錄：' + curTime + '由' + curUser.displayName + '手動驗票入場。驗票場次：第' + curWeek + '週的週' + curDateOfWeek_Chi + '。';
                                            VerifiedOKedUIDPushingRecordRef.push(recToPush).then(() => {
                                                alert("可以入場\n入場時間：" + curTime + "\n請切換到預約系統裡面檢查UID後面應該已經附註「已入場」！\n已經將UID複製完成！\nUID：" + goalUID);

                                                document.getElementById("daiQianEmail").value = "";
                                            });

                                        });
                                    }
                                    else {
                                        var prevAdmissionTime = snapShot.val().split(" ");
                                        alert("不得入場！\n\n上次入場：\n" + prevAdmissionTime[2] + "  " + prevAdmissionTime[3] + "\n已經將UID複製完成！\nUID：" + goalUID);
                                    }
                                });
                            });
                        }
                    });
                });
            }
        });
    });
}





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