// [NCMB] API Key
var applicationKey = "7c55072cff14d0d7f4e0414df3c42a74499e30911472977e6deb67db418b9a6b";
var clientKey = "2e064df09fd00b231247b798c19f78e1e17fec2393c3d9cc9b4f928c2daba99d";

// [FCM]送信者ID
var senderId = "591757477595";

// SDKの初期化
var ncmb = new NCMB(applicationKey, clientKey);
var push = new ncmb.Push();

// installationのobjectId
var installation_objectId = "";

// installationのすべてのkey
var keys = new Object();

// プッシュ通知受信設定
document.addEventListener("deviceready", function() {
    // [NCMB] プッシュ通知受信時のコールバックを登録します
    window.NCMB.monaca.setHandler (function(jsonData){
        // 送信時に指定したJSONが引数として渡されます
        alert("callback:" + JSON.stringify(jsonData));
        alert("コールバック完了");
    });

    /* 端末登録成功時の処理 */
    var successCallback = function () {
        if (installation_objectId != null){
            // 画面にinstallation 一覧表を表示
            setup();
        } else {
            alert("端末登録に成功しました。\nアプリを再起動してください。");
        }
    };

    /* 端末登録失敗時の処理処理 */
    var errorCallback = function (err) {
        alert("端末登録に失敗しました:" + err);
    };

    // [NCMB] デバイストークンを取得しinstallationに登録
    window.NCMB.monaca.setDeviceToken(
        applicationKey,
        clientKey,
        senderId,
        successCallback,
        errorCallback
    );

    // installationのobjectIdを取得
    getInstallationId();

},false)

// 画面にinstallation 一覧表を表示する処理
function setup() {
    // [NCMB] installation を取得
    ncmb.Installation.fetchById(installation_objectId)
        .then(function(installation){
            /* installation取得成功時の処理 */
            keys = Object.keys(installation);
            // リストを作成
            for (var j = 0; j < keys.length; j++) {
                var value =  installation[keys[j]];

                $.mobile.changePage($("#installationList"));
                if (keys[j] == "objectId" || keys[j] == "deviceToken" || keys[j] == "createDate" || keys[j] == "updateDate") {
                    $("#installationData").append("<tr><th id='" + keys[j] + "'>" + keys[j] + "</th><td><input type='text' style='width: 90%; color: #959595;' readonly='readonly'; id='" + keys[j] + "_v' value='" + value + "'/></tr>");

                } else if (keys[j] =="acl") {
                    // 表示しない

                } else {
                    $("#installationData").append("<tr><th id='" + keys[j] + "'>" + keys[j] + "</th><td><input type='text' style='width: 90%;' id='" + keys[j] + "_v' value='" + value + "'/></td></tr>");

                }
            }

            // リストを更新
            $("#installationData").listview('refresh');

        })
        .catch(function(err){
            /* installation取得失敗時の処理 */
            alert("installation取得に失敗しました" + err);

        });

}

// [NCMB] installationのobjectIdを取得する処理
function getInstallationId() {
    window.NCMB.monaca.getInstallationId(function(id) {
        installation_objectId = id;
    });
}

/* updateボタン押下時の処理 */
function updateInstallation() {
    // [NCMB] installation取得
    ncmb.Installation.fetchById(installation_objectId)
        .then(function(installation){
            /* installation取得成功時の処理 */
            // 値の設定
            for (var i = 0; i < keys.length; i++) {
                if (keys[i] =="acl" || keys[i] == "deviceToken" || keys[i] == "createDate" || keys[i] == "updateDate" || keys[i] =="objectId") {
                    // 何もしない
                } else {
                    // 入力値を取得
                    if (keys[i] == "badge") { /* 数値 */
                        var originalValue = document.getElementById(keys[i] + "_v").value
                        if (originalValue.match(/[^0-9]+/)) {
                            /* 入力値が数値でない */
                            throw "badgeは半角数字を入力してください";

                        } else {
                            var key = document.getElementById(keys[i]).innerHTML;
                            var value = parseInt(document.getElementById(keys[i] + "_v").value);

                        }

                    } else if (keys[i] == "channels") { /* 配列 */
                        var key = document.getElementById(keys[i]).innerHTML;
                        var originalValue = document.getElementById(keys[i] + "_v").value;
                        var value = originalValue.split(',');

                    } else { /* 文字列 */
                        var key = document.getElementById(keys[i]).innerHTML;
                        var value = document.getElementById(keys[i] + "_v").value;
                    }

                    installation.set(key, value);
                }

            }

            // [NCMB] installationの更新
            return installation.update();

        })
        .then(function(installation){
            /* installation更新成功時の処理 */
            alert("installation更新に成功しました");

        })
        .catch(function(err){
            /* installation取得または更新失敗時の処理 */
            alert("installation更新に失敗しました:" + err);

        });

}

// addボタン押下時の処理
function addField() {
    // アラートでkeyを入力させる
    var key = window.prompt("keyを入力してください", "");
    
    if (key == "") { /* 入力値なし */
        alert("keyを入力してください");

    } else if(key.match( /[^A-Za-z0-9\s.-]+/ )) { /* 半角英数でない */
        alert("半角英数を入力してください");

    } else if (keys.indexOf(key) >= 0) { /* 既存key */
        alert("既存keyは使用できません");

    } else {
        // フィールドの追加
        try{
            
        // $.mobile.changePage($("#installationList"));
        // $("#installationData").append("<tr><th id='" + key + "'>" + key + "</th><td><input type='text' style='width: 90%;' id='" + key + "_v'/></td></tr>");
        // $("#installationData").listview('refresh');
        // keysに追加
        keys.push(key);
        }catch(e){
            alert(e);
        }

    }

}

function sendMessage() {
    push.set("immediateDeliveryFlag", true)
        .set("message", "Hello, World!")
        .set("target", ["android"]);

    push.send()
        .then(function(push){
          // 送信後処理
            alert("送信後処理");
         })
        .catch(function(err){
           // エラー処理
            alert("エラー処理");
         });
}