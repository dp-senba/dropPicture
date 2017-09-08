// This is a JavaScript file

// Camera
function takePicture(ncmb) {
    
    var dt = new Date();
    var y = dt.getFullYear();
    var m = ("00" + (dt.getMonth()+1)).slice(-2);
    var d = ("00" + dt.getDate()).slice(-2);
    var h = ("00" + dt.getHours()).slice(-2);
    var min = ("00" + dt.getMinutes()).slice(-2);
    var s = ("00" + dt.getSeconds()).slice(-2);
    var result = y + m + d + h + min + s;
    
    var fileName = result + ".png";
    
    navigator.camera.getPicture(onSuccess, onFail, setOptions());
    
    // 
    function onSuccess(data) {
        var byteCharacters = toBlob(data);
        ncmb.File.upload(fileName, byteCharacters)
        .then(function() {
          savePicInfo();
        })
        .catch(function(error) {
          alert(JSON.stringify(error));
        });
    }
    
    function onFail(e){
        switch (e.code) {
            case FileError.QUOTA_EXCEEDED_ERR:
              msg = 'QUOTA_EXCEEDED_ERR';
              break;
            case FileError.NOT_FOUND_ERR:
              msg = 'NOT_FOUND_ERR';
              break;
            case FileError.SECURITY_ERR:
              msg = 'SECURITY_ERR';
              break;
            case FileError.INVALID_MODIFICATION_ERR:
              msg = 'INVALID_MODIFICATION_ERR';
              break;
            case FileError.INVALID_STATE_ERR:
              msg = 'INVALID_STATE_ERR';
              break;
            default:
              msg = 'Unknown Error';
              break;
        };
    
      alert('Error: ' + msg);
    }

    // Option
    function setOptions(){
        var options = {
            quality : 50,
            destinationType: Camera.DestinationType.DATA_URL,
            saveToPhotoAlbum:true
        };
        
        return options;
    }

    // Base64 to Blob
    function toBlob(base64) {
        var bin = atob(base64.replace(/^.*,/, ''));
        var buffer = new Uint8Array(bin.length);
        for (var i = 0; i < bin.length; i++) {
            buffer[i] = bin.charCodeAt(i);
        }
        // Blobを作成
        try{
            var blob = new Blob([buffer.buffer], {
                type: 'image/png'
            });
        }catch (e){
            console.log("toBlob" + e);
            return false;
        }
        return blob;
    }
    
    // ファイル情報を保存
    function savePicInfo(){
        // 保存先クラスの作成
        var ncmbFileInfo = ncmb.DataStore("FileInfo");

        // 保存先クラスのインスタンスを生成
        var fileInfo = new ncmbFileInfo();
        
        // 値を設定と保存
        fileInfo
            .set("GameId", "9999")
            .set("SrcUserId","aaa")
            .set("DstUserId","bbb")
            .set("FileName",fileName)
            .save()
            .then(function(object){
                // 保存に成功した場合の処理
                alert("success");
            })
            .catch(function(err){
                // 保存に失敗した場合の処理
                alert("error");
                console.log(err);
            });
    }
}