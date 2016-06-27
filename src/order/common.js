/**
 * モード切り替えや選択状態で変化しない情報を記述するレイヤー
 */
var OrderLayer = cc.Layer.extend({
    tab_flag : false,
    change_flag : false,
    back_flag : false,

    ctor: function () {
        this._super();

        this.putTitle();
        this.putFrame();

        //アイテム機能削除によりタブ撤廃
        //this.makeTabButton();
        this.addBackButton();
        this.putDetailFrame();
        this.makeChangeButton();//入れ替えボタン作成
    },


    putTitle: function () {
        var size = cc.director.getWinSize();

        var head = new cc.Sprite(res.order_ttl);
        head.setPosition(size.width / 2, size.height - 80);
        this.addChild(head,1);
    },


    putFrame: function (){
        var frame = new cc.Sprite(res.frame);
        frame.setPosition(400,300);
        this.addChild(frame,2);
    },


    /**
     * 透明のタブボタン生成
     */
     makeTabButton: function (){
        var tab_char = new cc.MenuItemImage(res.order_tab_char_on, res.order_tab_char_on, this.selectTab, this);
        var tab_item = new cc.MenuItemImage(res.order_tab_item_off, res.order_tab_item_n, this.selectTab, this);
        tab_char.setPosition(505,450);
        tab_item.setPosition(650,450);

        var tab = new cc.Menu(tab_char, tab_item);
        tab.setOpacity(0);
        tab.setPosition(0,0);
        this.addChild(tab);
     },


     /**
      * タブボタンが押された
      */
     selectTab: function (){
        this.tab_flag = true;
     },


     /**
      * タブボタンがタップされたかを検出
      */
     getTabFlag: function () {
        var res = this.tab_flag;
        this.tab_flag = false;
        return res;
    },


    /**
     * 選択項目詳細フレームの表示
     */
    putDetailFrame: function () {
        var frame = new cc.Sprite(res.order_detail);
        frame.setPosition(215, 148);
        this.addChild(frame,100);
    },


    /**
     * 戻るボタンの表示
     */
    addBackButton: function (){
        var back = new cc.MenuItemImage(res.back, res.back, this.selectBack, this);
        var back_menu = new cc.Menu(back);
        back_menu.setPosition(50, 50);
        this.addChild(back_menu,200);
    },


    /**
     * 戻るボタンが押された
     */
    selectBack: function () {
        this.back_flag = true;
    },


    /**
     * 戻るボタンが押されたかどうかの検出
     */
    getBackFlag: function (){
        var res = this.back_flag;
        this.back_flag = false;
        return res;
    },


    /**
     * 編成変更ボタンの作成
     */
    makeChangeButton: function () {
        var change_button = new cc.MenuItemImage(res.order_change, res.order_change, this.selectChange, this);
        var change_menu = new cc.Menu(change_button);
        change_menu.setPosition(230,40);
        this.addChild(change_menu);
    },


    /**
     * 編成変更ボタンが押された
     */
    selectChange: function () {
        this.change_flag = true;
    },


    /**
     * 編成変更ボタンが押されたかどうかの検出
     */
    getChangeFlag: function () {
        var res = this.change_flag;
        this.change_flag = false;
        return res;
    }
});