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
    
    // 写真撮影
    navigator.camera.getPicture(onSuccess, onFail, setOptions());
    
    // 撮影成功時
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
    
    // 撮影失敗時
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

    // CameraOption
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

    // ファイルダウンロード (main)
    function getImage(ncmb, fileName){
        
        var reader = new FileReader();

        reader.onload = function(e) {
            var dataUrl = reader.result;
            document.getElementById("image").src = dataUrl;
            document.getElementById("image").style.display = "block";
            alert(reader.result);
        }
        
        // ダウンロード（データ形式をblobを指定）
        ncmb.File.download(fileName, "blob")
            .then(function(blob) {
                // ファイルリーダーにデータを渡す
                reader.readAsDataURL(blob);
                // alert("DL_success!!\n fileName is "+fileName);
            })
            .catch(function(err) {
                alert("DL_error");
                console.log(err);
           })
    }
    
    // ファイルのダウンロード
    function downloadImage(ncmb, gameId){
        var fileName = "";
        
        var FileInfo = ncmb.DataStore("FileInfo");
        
        FileInfo.equalTo("GameId", gameId)
            .fetchAll()
            .then(function(results){
                for (var i = 0; i < results.length; i++) {
                    var object = results[i];
                    fileName = object.get("FileName");
                    getImage(ncmb, fileName);
                }
            })
            .catch(function(err){
                console.log(err);
            });
        
        
        return;
    }

// FileInfoの送信情報を更新する
function sendPic(ncmb, gameId, srcId, dstId){
    
    var FileInfo = ncmb.DataStore("FileInfo");
    
    alert("gameId is " + gameId);
    FileInfo.equalTo("GameId",gameId)
        .fetchAll()
        .then(function(results){
            for(var i = 0; i < results.length; i++){
                var obj = results[i];
                obj.set("SrcUserId", srcId)
                    .set("DstUserId", dstId);
                return obj.update();
            }
        })
        .catch(function(err){
            console.log(err);
        });
}




