// This is a JavaScript file

//----------------------------------
//  通知チェック
//----------------------------------
function CheckStatus()
{
    if (IsStarting == true) {
        //ゲーム開始時
        CheckBaba();
    }
    else {
        //ゲーム参加待ち中
        InitFormByGameState();
    }
}

//----------------------------------
//  ゲームステイタスによって画面を設定
//----------------------------------
function InitFormByGameState()
{
    //ボタン制御
    document.getElementById("btnCamera").style.display = "none";
    document.getElementById("btnStart").style.display = "none";
    document.getElementById("btnStop").style.display = "none";
    document.getElementById("btnSend").style.display = "none";
    document.getElementById("btnAppend").style.display = "none";
    
    for(var i=1; i<=5; i++)
    {
        $("#txtName" + i).val("");
    }
    
    //メンバー情報を表示
    var MemberList = ncmb.DataStore("MemberList");
    MemberList
        .fetchAll()
        .then(function(results){
            for (var i = 0; i < results.length; i++) {
                var member = results[i];
                var name = member.get("UserName");
                document.getElementById("txtName" + (i+1)).value = name;
            }
        });
    
    
    //ゲーム情報を取得
    var GameInfo = ncmb.DataStore("GameInfo");
    GameInfo
        .fetchAll()
        .then(function(results){
            var cnt = results.length;
            if (cnt == 0) 
            {
                //該当データがなければ、「参加する」が選択可能
                document.getElementById("nowStatus").innerHTML = "参加者受付中～!(^^)!";
                
                //ボタン制御
                if ($("#txtMyName").attr("readonly") != "readonly") {
                    document.getElementById("btnAppend").style.display = "block";
                }
            }
            else
            {
                //該当有の場合は、待ってもらう   
                document.getElementById("nowStatus").innerHTML = "次のゲーム開始を待ってね★＾＾★";
            }
            if (IsParent == true) {
                //親の場合は、写真撮影ができる
                document.getElementById("btnCamera").style.display = "block";
            }
            
        })
        ;
    
}

//----------------------------------
//  ゲーム開始情報作成
//----------------------------------
function SetGameStart(startTime, endTime)
{
    document.getElementById("nowStatus").innerHTML = "ゲーム実行中★＾＾★";
    
    
    deleteAll("GameInfo");
    
    //新規登録
    var GameInfo = ncmb.DataStore("GameInfo");
    var gInfo = new GameInfo();
    gInfo
        .set("GameId", "1")
        .set("StartDate", startTime)
        .set("EndDate", endTime)
        .set("BabaId", MyId)
             .save()
             .then(function(a){
              // 保存後の処理
             })
             .catch(function(err){
               // エラー処理
             });
}

//----------------------------------
//  ゲーム情報のババIDを更新
//----------------------------------
function UpdateBaba(babaId)
{
    var GameInfo = ncmb.DataStore("GameInfo");
    GameInfo
        .fetchAll()
        .then(function(results){
            if (results.length > 0) {
                var gInfo = results[0];
                gInfo.set("BabaId", babaId);
                gInfo.update();
            }
        });
}

//----------------------------------
//  ゲーム情報のババIDをチェック
//----------------------------------
function CheckBaba()
{
    var GameInfo = ncmb.DataStore("GameInfo");
    GameInfo
        .fetchAll()
        .then(function(results){
            if (results.length > 0) {
                var gInfo = results[0];
                var babaId = gInfo.get("BabaId");
                
                if (babaId == myId) {
                    //自分がババになってた
                    document.getElementById("btnSend").style.display = "none";
                }
                else {
                    //他の人がババだった
                    document.getElementById("btnSend").style.display = "block";
                }
            }
        });
}

//----------------------------------
//  メンバー登録
//----------------------------------
function AppendMember(userName)
{
    //メンバー情報取得
    
    
    //５名に達していなければ、登録し表示
    var MemberList = ncmb.DataStore("MemberList");
    MemberList
        .fetchAll()
        .then(function(results){
            var memberCnt = results.length;
            if (memberCnt < 5) 
            {
                //登録
                var myId = Number(memberCnt) + 1;
                IsParent = (myId == 1);
                var member = new MemberList();
                member
                    .set("GameId", "1")
                    .set("UserId", myId)
                    .set("UserName", userName)
                         .save()
                     .then(function(){
                        // 保存後の処理
                        document.getElementById("txtName" + myId).value = userName;
                        
                        $("#txtMyName").attr("readonly","true");
                        
                        //ボタン制御
                        document.getElementById("btnAppend").style.display = "none";        //参加するボタン
                        if (IsParent == true) {
                            //親の場合は、写真撮影ができる
                            document.getElementById("btnCamera").style.display = "block";
                        }
                        
                     })
                     .catch(function(err){
                       // エラー処理
                     });
                
            }
        })
        ;
}

//----------------------------------
//  ゲームの状態を設定
//      0:待ち受け中
//      1：待ち受け終了
//      9：存在しない
//----------------------------------
function SetGameState()
{
    try
    {
        var a;
        var GameMaster = ncmb.DataStore("GameMaster");
        //データを検索
        GameMaster
            .fetchAll()
            .then(function(results){
                var sts;
                for (var i = 0; i < results.length; i++) {
                    var object = results[i];
                    sts = object.get("State");
                    break;
                }
                if(Number(sts) == 0)
                {
                    UpdateGameMaster("1");
                }
                else if(Number(sts) == 1)
                {
                    UpdateGameMaster("0");
                }
                else
                {
                    //該当なし
                    CreateGameMaster();
                }
            })
            .catch(function(err){
                console.log(err);
            })
        ;
    }
    catch(e)
    {
        alert("GetGameState\r\n" + e);
    }
}

//----------------------------------
//  ゲーム管理マスタのステイタスを更新
//----------------------------------
function UpdateGameMaster(sts)
{
    var GameMaster = ncmb.DataStore("GameMaster");
    //データを検索
    GameMaster
        .fetchAll()
        .then(function(results){
            for (var i = 0; i < results.length; i++) {
                var gMaster = results[i];
                gMaster.set("State", sts);
                gMaster.update();
            }
            });
    return;
}


//----------------------------------
//  ゲーム管理マスタ作成
//----------------------------------
function CreateGameMaster()
{
    //新規登録
    var GameMaster = ncmb.DataStore("GameMaster");
    var gMaster = new GameMaster();
    gMaster
        .set("GameId", "1")
        .set("State", 0)
        .set("member", "onishi")
             .save()
             .then(function(gameScore){
              // 保存後の処理
             })
             .catch(function(err){
               // エラー処理
             });
    
}

function deleteAll(className)
{
    var targetClass = ncmb.DataStore(className);
        targetClass
            .fetchAll()
            .then(function(results){
                for (var i = 0; i < results.length; i++) {
                    results[i].delete();
                }
            });
}

//----------------------------------
//  ゲーム情報全クリア
//----------------------------------
function ResetGameData()
{
    //GameMaster
    deleteAll("GameMaster");
    
    //GameInfo
    deleteAll("GameInfo");
    
    //MemberList
    deleteAll("MemberList");
    
    //FileInfo
    
    
    InitFormByGameState();
}

