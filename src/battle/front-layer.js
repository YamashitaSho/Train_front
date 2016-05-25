var BattleFrontLayer = cc.Layer.extend({
    ctor:function () {
        this._super();
        this._addButton();
    },


    /**
     * ボタンメニューの表示
     */
    _addButton: function () {
        var button_next = new cc.MenuItemImage(res.yes, res.yes, this._selectNext, this);
        button_next.setPosition(400, 96);
        button_next.setName("next");
//        button_next.setVisible(false);


        var menu = new cc.Menu(button_next);
        menu.setPosition(0, 0);
        menu.setName("menu");
        this.addChild(menu);
    },


    /**
     * はいボタンの選択
     */
    _selectNext: function (){
        var transitionScene = cc.TransitionFade.create(0.5, new MenuScene());
        cc.director.pushScene(transitionScene);
        cc.eventManager.removeAllListeners();
        this.removeAllChildren();
    },
});
