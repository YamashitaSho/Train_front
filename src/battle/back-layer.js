var BattleBackLayer = cc.Layer.extend({
    size: null,
    ctor:function () {
        this._super();

        this.size = cc.director.getWinSize();
        this._putTitle();
        this._putFrame();
    },


    _putTitle: function () {
        var head = new cc.Sprite(res.quest_ttl);
        head.setPosition(this.size.width / 2, this.size.height - 80);
        this.addChild(head);
    },


    _putFrame: function (){
        var frame = new cc.Sprite(res.frame);
        frame.setPosition(this.size.width / 2, this.size.height / 2);
        this.addChild(frame);
    },

});