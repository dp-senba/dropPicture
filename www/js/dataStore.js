// This is a JavaScript file

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
                var member = new MemberList();
                member
                    .set("GameId", "1")
                    .set("UserId", myId)
                    .set("UserName", userName)
                         .save()
                     .then(function(){
                        // 保存後の処理
                        document.getElementById("txtName" + myId).value = userName;
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
                    
                }
                else if(Number(sts) == 1)
                {
                    
                }
                else
                {
                    CreateGameMaster();
                }
                return sts;
            })
            .catch(function(err){
                console.log(err);
            })
        ;
        
        return a;
    }
    catch(e)
    {
        alert("GetGameState\r\n" + e);
    }
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
}

