function initApp() {
    var btnGoogle = document.getElementById('GoogleLogIn');

    btnGoogle.addEventListener('click', () => {
        var provider = new firebase.auth.GoogleAuthProvider();

        firebase.auth().signInWithPopup(provider).then(result => {
            /** @type {firebase.auth.OAuthCredential} */
            var credential = result.credential;
            var token = credential.accessToken;//這是一串人類無法看懂的東西
            // The signed-in user info.
            var user = result.user;
            /*
            user.displayName: 顯示名稱。ex：望月的犀牛
            user.email: 電子信箱
            user.emailVerified: 這個電子信箱是否有驗證
            user.photoURL: 大頭照的路徑
            user.uid: Firebase Auth 派給這個使用者的 User ID
            */

            firebase.database().ref('users/' + user.uid).once("value").then((snapShot) => {
                var num = snapShot.numChildren();

                if (num != 0 /*帳號已經存在*/) {
                    alert("登入成功！請等待系統自動跳轉");
                }
                else {
                    firebase.database().ref('users/' + user.uid).set({
                        Name: user.displayName,
                        Email: user.email,
                        Photo: user.photoURL,
                        UID: user.uid,
                        QuotaRemaining: (timeExpiredToHaveExperiencingClasses() ? 0 : 3),
                        QuotaToUseThisWeek: 0,
                        AccumulatedUse: 0,
                        admin: "N",
                        YiSanWu: {
                            Yi: "N",
                            San: "N",
                            Wu: "N"
                        }
                    }).then(() => {
                        var curTime = getDateTimeStr();

                        var recRef = firebase.database().ref('users/' + user.uid + '/Record');
                        var recToPush = "註冊帳號：" + curTime + "由您於本系統註冊。";
                        recToPush += (timeExpiredToHaveExperiencingClasses() ? "" : "內含3堂體驗額度，已經儲存在餘額之中。");
                        recRef.push(recToPush).then(() => {
                            alert(user.email + "成功在本系統註冊帳號！");
                        });
                    });
                }
            }).then(() => {
                setTimeout(() => {
                    location.replace("./index.html");
                }, 2000);
            });
        }).catch((error) => {
            var errorCode = error.code;
            var errorMessage = error.message;
            // The email of the user's account used.
            var email = error.email;
            // The firebase.auth.AuthCredential type that was used.
            var credential = error.credential;
            // ...
        });
    });

}

window.onload = function () {
    initApp();
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



function timeExpiredToHaveExperiencingClasses() {
    const expiry = new Date(2021, 9, 2, 23, 59, 59); // 其他部分一切照常，但月份的部分要特別注意，他是0-based，和人類的習慣不同，所以要「-1（減一）」才會是正確的。ex: 你想要10月，那你就必須填「9」。
    const current = new Date();

    return current > expiry;
}