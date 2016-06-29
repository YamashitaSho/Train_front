window.onload = function(){
    cc.game.onStart = function(){
        cc.view.setDesignResolutionSize(800, 600, cc.ResolutionPolicy.UNKNOWN);
        cc.director.runScene(new TopScene());
    };
    cc.game.run("gameCanvas");
};


var TopScene = cc.Scene.extend({
    onEnter:function () {
        this._super();

        var backgroundLayer = new cc.LayerColor(cc.color(170, 255, 255, 255));
        this.auth = new AuthLayer();
        this.addChild(backgroundLayer, 0);
        this.addChild(this.auth);
    },

    onExit:function () {
        console.log("GachaScene onExit()");
    }
});

var AuthLayer = cc.Layer.extend({
    ctor: function () {
        this._super();
        this._addButton();
        this._addTitle();
    },


    /**
     * タイトルロゴの表示
     */
    _addTitle: function () {
        url = "res/title.png";
        var title = new cc.Sprite(url);
        title.setPosition(400,400);
        this.addChild(title);
    },


    /**
     * ボタンメニューの表示
     */
    _addButton: function () {
        url = "res/google.png";
        var button_google = new cc.MenuItemImage(url, url, this._selectGoogle, this);
        button_google.setPosition(400,150);
        button_google.setName("yes");

        var menu = new cc.Menu(button_google);
        menu.setPosition(0, 0);
        menu.setName("menu");
        this.addChild(menu);
    },

    _selectGoogle: function () {
        var uri = "http://train-yama.nurika.be:8000/v1/auth/google";
        location.href = uri;
    },
});