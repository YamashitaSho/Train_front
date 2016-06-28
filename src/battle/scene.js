var BattleScene = cc.Scene.extend({
    back: null,
    middle: null,
    front: null,
    onEnter:function () {
        this._super();
        var backgroundLayer = new cc.LayerColor(cc.color(170,255,255,255));
        this.apiSetBattle();
        this.back = new BattleBackLayer();
        this.middle = new BattleMiddleLayer();
        this.addChild(backgroundLayer);
        this.addChild(this.back);
        this.addChild(this.middle);
    },



    onExit:function () {
        console.log("BattleScene onExit()");
    },


    /**
     * バトル進行APIの送信
     */
    apiSetBattle: function (){
        $.ajax({
            url:"http://train-yama.nurika.be:8000/v1/battle/0",
            type:"PUT",
        }).done(this._apiSetBattleSuccess.bind(this))
        .fail(error.catch);
    },


    _apiSetBattleSuccess: function (data){
        console.log(data);
        this.middle.makeSpriteChar(data);
        this.apiTurnoverBattle();
    },


    /**
     * バトル経過取得APIの送信
     */
    apiTurnoverBattle: function (){
        $.ajax({
            url:"http://train-yama.nurika.be:8000/v1/battle/0",
            type:"GET",
        }).done(this._apiTurnoverBattleSuccess.bind(this))
        .fail(this._apiTurnoverBattleFail.bind(this));
    },

    _apiTurnoverBattleSuccess: function (data) {
        console.log(data);
        this.middle.makeTimeline(data);
    },

    _apiTurnoverBattleFail: function (data) {
        if (data.responseJSON == "status: Already Closed Battle"){
            this._gotoResult();
        }
        console.log("failed...");
        console.log(data);
    },


    _gotoResult: function () {
        var transitionScene = cc.TransitionFade.create(0.5, new ResultScene());
        cc.director.pushScene(transitionScene);
        cc.eventManager.removeAllListeners();
        this.removeAllChildren();
    },
});
