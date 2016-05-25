var BattleScene = cc.Scene.extend({
    back: null,
    middle: null,
    front: null,
    onEnter:function () {
        this._super();
        var backgroundLayer = new cc.LayerColor(cc.color(170,255,255,255));
        this.apiSetBattle();
        this.apiTurnoverBattle();
        this.back = new BattleBackLayer();
        this.middle = new BattleMiddleLayer();
        this.front = new BattleFrontLayer();
        this.addChild(backgroundLayer);
        this.addChild(this.back);
        this.addChild(this.middle);
        this.addChild(this.front);
    },



    onExit:function () {
        console.log("BattleScene onExit()");
    },


    /**
     * バトル進行APIの送信
     */
    apiSetBattle: function (){
        $.ajax({
            url:"http://homestead.app:8000/v1/battle/0",
            type:"PUT",
        }).done(function(data){
            console.log(data);
            this.middle.makeSpriteChar(data);
        }.bind(this)).fail(function(data){
            console.log("failed...");
            console.log(data);
        });
    },


    /**
     * バトル経過取得APIの送信
     */
    apiTurnoverBattle: function (){
        $.ajax({
            url:"http://homestead.app:8000/v1/battle/0",
            type:"GET",
        }).done(function(data){
            console.log(data);
            this.middle.makeTimeline(data);
        }.bind(this)).fail(function(data){
            console.log("failed...");
            console.log(data);
        });
    },
});
