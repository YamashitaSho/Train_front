var ResultScene = cc.Scene.extend({
    layer: null,
    onEnter:function () {
        this._super();
        var backgroundLayer = new cc.LayerColor(cc.color(170, 255, 255, 255));
        this.layer = new ResultLayer();
        this.addChild(backgroundLayer, 0);
        this.addChild(this.layer);
        this.apiGetResult();

        this.scheduleUpdate();
    },


    update: function () {
        this._watchBackButton();
        this._watchArenaButton();
        this._watchQuestButton();
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


    _watchBackButton: function () {
        if (this.layer.back){
            this.layer.back = false;
            this._gotoMenu();
        }
    },


    _watchArenaButton: function () {
        if (this.layer.arena){
            this.layer.arena = false;
            this._gotoBattle();
        }
    },


    _watchQuestButton: function () {
        if (this.layer.quest){
            this.layer.quest = false;
            this._gotoQuest();
        }
    },


    _gotoMenu: function () {
        var transitionScene = cc.TransitionFade.create(0.5, new MenuScene());
        cc.director.pushScene(transitionScene);
        cc.eventManager.removeAllListeners();
        this.removeAllChildren();
    },


    _gotoQuest: function () {
        var transitionScene = cc.TransitionFade.create(0.5, new QuestScene());
        cc.director.pushScene(transitionScene);
        cc.eventManager.removeAllListeners();
        this.removeAllChildren();
    },


    /**
     * バトル画面に遷移
     */
    _gotoBattle: function (){
        var transitionScene = cc.TransitionFade.create(0.5, new BattleScene());
        cc.director.pushScene(transitionScene);
        cc.eventManager.removeAllListeners();
        this.removeAllChildren();
    }
});
