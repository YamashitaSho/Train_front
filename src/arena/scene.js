var ArenaScene = cc.Scene.extend({
    layer: null,
    onEnter:function () {
        this._super();
        var backgroundLayer = new cc.LayerColor(cc.color(170, 255, 255, 255));
        this.layer = new ArenaLayer();
        this.addChild(backgroundLayer);
        this.addChild(this.layer);
        this.apiGetBattleList();
        this.scheduleUpdate();
    },


    /**
     * 各ボタンに押された判定が入っていれば遷移を行う
     */
    update: function () {
        this._watchBackButton();
        this._watchArenaButton();
    },

    onExit:function () {
        console.log("ArenaScene onExit()");
    },


    /**
     * backボタンが押された
     */
    _watchBackButton: function (){
        if (this.layer.back !== false){
            this.layer.back = false;
            this.gotoMenu();
        }
    },

    /**
     * arenaボタンが押された
     */
    _watchArenaButton: function (){
        if (this.layer.join !== null){
            var arena_id = this.layer.join;
            this.layer.join = null;
            this._apiJoinArenaBattle(arena_id);
            console.log(arena_id);
        }

    },


    /**
     * アリーナ情報取得APIの送信
     */
    apiGetBattleList: function (){
        $.ajax({
            url:"http://train-yama.nurika.be:8000/v1/stage",
            type:"GET",
        }).done(this._apiGetBattleListSuccess.bind(this))
        .fail(error.catch);
    },


    _apiGetBattleListSuccess: function (data){
        this.layer.updateStatus(data);
    },


    /**
     * バトル発行APIの送信
     */
    _apiJoinArenaBattle: function (arena_id){
        var body = {
            'arena_id': arena_id
        };
        $.ajax({
            url:"http://train-yama.nurika.be:8000/v1/stage/",
            data: body,
            type:"POST",
        }).done(this._apiJoinArenaBattleSuccess.bind(this))
        .fail(error.catch);
    },


    _apiJoinArenaBattleSuccess: function (){
        var transitionScene = cc.TransitionFade.create(0.5, new BattleScene());
        cc.director.pushScene(transitionScene);
        cc.eventManager.removeAllListeners();
        this.removeAllChildren();
    },


    gotoMenu: function (){
        var transitionScene = cc.TransitionFade.create(0.5, new MenuScene());
        cc.director.pushScene(transitionScene);
        cc.eventManager.removeAllListeners();
        this.removeAllChildren();
    },
});
