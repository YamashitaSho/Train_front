var ResultScene = cc.Scene.extend({
    layer: null,
    onEnter:function () {
        this._super();
        var backgroundLayer = new cc.LayerColor(cc.color(170, 255, 255, 255));
        this.layer = new ResultLayer();
        this.addChild(backgroundLayer, 0);
        this.addChild(this.layer);
        this.apiGetResult();
    },


    onExit:function () {
        console.log("ResultScene onExit()");
    },


    /**
     * バトル結果取得APIの送信
     */
    apiGetResult: function (){
        $.ajax({
            url:"http://train-yama.nurika.be:8000/v1/battle/result/0",
            type:"PUT",
        })
        .done(this._apiGetResultSuccess.bind(this))
        .fail(error.catch, this._apiGetResultFail.bind(this));
    },

    _apiGetResultSuccess: function (data, textStatus, jqXHR) {
        console.log(data);
        this.layer.setAppearance(data);
    },

    _apiGetResultFail: function (data, textStatus, jqXHR) {
        console.log(data);
        if (data.responseJSON == "battle did not run"){
            this._gotoBattle();
        }
    },

    /**
     * バトル結果が生成されていないのでバトル画面に遷移
     */
    _gotoBattle: function (){
        var transitionScene = cc.TransitionFade.create(0.5, new BattleScene());
        cc.director.pushScene(transitionScene);
        cc.eventManager.removeAllListeners();
        this.removeAllChildren();
    }
});
