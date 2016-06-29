var error = {
    catch: function (data) {
        switch (data.status){
            case 400:
                error._badrequest(data.statusText);
                break;
            case 401:
                error._unauthorized();
                break;
            case 404:
                error._notfound(data.statusText);
                break;
        }
    },


    _badrequest: function (text) {
        console.log(text);
        return ;
    },


    _unauthorized: function () {
        window.alert("エラーが発生しました。トップページに戻ります。");
        location.href = "http://train-yama.nurika.be:8000/Train_front/";
    },


    _notfound: function (text) {
        console.log(text);
        return ;
    },
};