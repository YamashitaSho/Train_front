var QuestScene = cc.Scene.extend({
    layer: null,
    onEnter:function () {
        this._super();
        var backgroundLayer = new cc.LayerColor(cc.color(170, 255, 255, 255));
        this.layer = new QuestConfirmLayer();
        this.addChild(backgroundLayer, 0);
        this.addChild(this.layer);
        this.apiGetMyParty();

        this.scheduleUpdate();
    },


    update: function () {
        this._watchBackButton();
        this._watchJoinButton();
    },


    onExit:function () {
        console.log("QuestScene onExit()");
    },


    apiGetMyParty: function () {
        $.ajax({
            url:"http://train-yama.nurika.be:8000/v1/quest/",
            type:"GET",
        }).done(this._apiGetMyPartySuccess.bind(this))
        .fail(error.catch);
    },


    _apiGetMyPartySuccess: function (data) {
            console.log(data);
            this.layer.updateStatus(data);
    },

    _watchBackButton: function () {
        if (this.layer.back){
            this.layer.back = false;
            this._gotoMenu();
        }
    },

    _watchJoinButton: function () {
        if (this.layer.join){
            this.layer.join = false;
            this.apiJoinQuestBattle();
        }
    },



    /**
     * バトル発行APIの送信
     */
    apiJoinQuestBattle: function (){
        $.ajax({
            url:"http://train-yama.nurika.be:8000/v1/quest/",
            type:"POST",
        }).done(this._apiJoinQuestBattleSuccess.bind(this))
        .fail(error.catch);
    },


    _apiJoinQuestBattleSuccess: function (data, textStatus, jqXHR){
        console.log(data);
        var transitionScene = cc.TransitionFade.create(0.5, new BattleScene());
        cc.director.pushScene(transitionScene);
        cc.eventManager.removeAllListeners();
        this.removeAllChildren();
    },


    _gotoMenu: function (){
        var transitionScene = cc.TransitionFade.create(0.5, new MenuScene());
        cc.director.pushScene(transitionScene);
        cc.eventManager.removeAllListeners();
        this.removeAllChildren();
    },

});
