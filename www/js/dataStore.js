// This is a JavaScript file

//----------------------------------
//  �����o�[�o�^
//----------------------------------
function AppendMember(userName)
{
    //�����o�[���擾
    
    
    //�T���ɒB���Ă��Ȃ���΁A�o�^���\��
    var MemberList = ncmb.DataStore("MemberList");
    MemberList
        .fetchAll()
        .then(function(results){
            var memberCnt = results.length;
            if (memberCnt < 5) 
            {
                //�o�^
                var myId = Number(memberCnt) + 1;
                var member = new MemberList();
                member
                    .set("GameId", "1")
                    .set("UserId", myId)
                    .set("UserName", userName)
                         .save()
                     .then(function(){
                        // �ۑ���̏���
                        document.getElementById("txtName" + myId).value = userName;
                     })
                     .catch(function(err){
                       // �G���[����
                     });
                
            }
        })
        ;
}

//----------------------------------
//  �Q�[���̏�Ԃ�ݒ�
//      0:�҂��󂯒�
//      1�F�҂��󂯏I��
//      9�F���݂��Ȃ�
//----------------------------------
function SetGameState()
{
    try
    {
        var a;
        var GameMaster = ncmb.DataStore("GameMaster");
        //�f�[�^������
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
//  �Q�[���Ǘ��}�X�^�쐬
//----------------------------------
function CreateGameMaster()
{
    //�V�K�o�^
    var GameMaster = ncmb.DataStore("GameMaster");
    var gMaster = new GameMaster();
    gMaster
        .set("GameId", "1")
        .set("State", 0)
        .set("member", "onishi")
             .save()
             .then(function(gameScore){
              // �ۑ���̏���
             })
             .catch(function(err){
               // �G���[����
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
//  �Q�[�����S�N���A
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

