/**
 * キャラ編成モードで表示するレイヤー
 */
var CharLayer = cc.Layer.extend({
    select: null,
    ctor: function () {
        this._super();
        this.makeTab();         //モードタブ作成
        this.select = new SelectState();
    },


    /**
     * タブボタン生成
     */
     makeTab: function (){
        var tab_char = new cc.MenuItemImage(res.order_tab_char_on);
        var tab_item = new cc.MenuItemImage(res.order_tab_item_off);
        tab_char.setPosition(505,450);
        tab_item.setPosition(650,450);
        this.addChild(tab_char);
        this.addChild(tab_item);
     },


    updateChars: function () {
        var target = this.getChildByName("update");
        while ( target !== null) {
            target.removeFromParent();
            target = this.getChildByName("update");
        }
        this.putCharList();
        this.putPartyList();
    },


    /**
     * 所持キャラボタン表示メソッド
     */
    putCharList: function () {
        var chars = [];
        var xRow = 3;
        var yColomn = 4;
        var x;
        var y;
        var i = 0;
        var url = "res/char/icon/char00.png";
        for (y = 0; y < yColomn; y+=1){
            for (x = 0; x < xRow; x+=1){
                if ( order.chars[i] && order.chars[i].char_id ){
                    url = "res/char/icon/char"+("0"+order.chars[i].char_id).slice(-2)+".png";
                } else {
                    url = "res/char/icon/char00.png";
                }
                chars[i] = new cc.MenuItemImage(url, url, this.selectChar ,this);
                chars[i].setPosition(480 + x * 100, 384 - y * 100);   //100 = 96 + 2(padding) + 2(padding)
                chars[i].tag = i;
                i+=1;
            }
        }
        var chars_menu = new cc.Menu(chars);
        chars_menu.setPosition(0, 0);
        chars_menu.setName("update");
        this.addChild(chars_menu);
    },


    /*
     * 編成中キャラを選択するボタンを作成する
     *
     * キャラの位置には透明画像のボタンを配置する
     * アイテムの位置には灰色画像のスプライトを配置する
     */
    putPartyList: function (){
        var chars = [];
        var items = [];
        var xRow = 3;
        var x;
        var white = res.order_icon_white;
        var gray = res.order_icon_gray;
        for (x = 0; x < xRow; x+=1){
            chars[x] = new cc.MenuItemImage(white, white, this.selectPartyChar ,this);
            chars[x].setPosition(110 + x * 100, 384);
            chars[x].tag = x;
            items[x] = new cc.MenuItemImage(gray, gray, function(){}, this);
            items[x].setPosition(110 + x * 100, 284);
            items[x].tag = x;
        }
        var items_party = new cc.Menu(items);
        var chars_party = new cc.Menu(chars);
        chars_party.setPosition(0, 0);
        chars_party.setName("update");
        items_party.setPosition(0, 0);
        items_party.setName("update");
        this.addChild(items_party);
        this.addChild(chars_party);
    },


    /**
     * キャラ編成スロットの選択
     */
    selectPartyChar: function (sender) {
        console.log("button");
        var tag = sender.getTag();
        this.select.setPartyChar(tag);
    },


    selectChar: function (sender){
        var tag = sender.getTag();
        if ( order.chars[tag] ){
            this.select.setChar(tag);
        } else {
            this.select.setChar(null);
        }
    },


    updateSelect: function () {
        if (this.select.isToUpdate()){
            this.removeSelect();
            this.highLightSelect();
        }
    },


    /**
     * 選択されているキャラをハイライト表示する
     */
    highLightSelect: function (){
        this.highLightPartyChar();
        this.highLightChar();
    },


    highLightPartyChar: function () {
        var sel = this.select.getPartyChar();
        if (sel !== null){
            var party = new cc.Sprite(res.order_frame_selected);
            party.setPosition(110 + sel * 100, 384);
            party.setName("select");
            this.addChild(party, 300);
        }
        console.log(this.select);
    },


    highLightChar: function () {
        var sel = this.select.getChar();
        if (sel !== null){
            var char = new cc.Sprite(res.order_frame_selected);
            char.setPosition(480 + 100 * (sel % 3), 384 - 100 * (sel / 3 | 0) );
            char.setName("select");
            this.addChild(char, 300);
        }
    },


    removeSelect: function(){
        var target = this.getChildByName("select");
        while (target !== null){
            target.removeFromParent();
            target = this.getChildByName("select");
        }
    }
});