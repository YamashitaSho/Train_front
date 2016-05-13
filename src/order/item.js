

var ItemLayer = cc.Layer.extend({
    select: null,
    ctor: function () {

        this._super();
        this.makeTab();
        this.select = new SelectState();
    },


    /**
     * タブボタン生成
     */
    makeTab: function () {
        var tab_char = new cc.MenuItemImage(res.order_tab_char_off);
        var tab_item = new cc.MenuItemImage(res.order_tab_item_on);
        tab_char.setPosition(505,450);
        tab_item.setPosition(650,450);
        this.addChild(tab_char);
        this.addChild(tab_item);
    },


    updateItems: function () {
        var target = this.getChildByName("update");
        while ( target !== null) {
            target.removeFromParent();
            target = this.getChildByName("update");
        }
        this.putItemList();
        this.putPartyList();
    },

    /*
     * 編成中アイテムを選択するボタンを作成する
     *
     * アイテムの位置には透明画像のボタンを配置する
     * キャラの位置には灰色画像のスプライトを配置する
     */
    putPartyList: function (){
        var chars = [];
        var items = [];
        var xRow = 3;
        var x;
        var white = res.order_icon_white;
        var gray = res.order_icon_gray;
        for (x = 0; x < xRow; x+=1){
            chars[x] = new cc.MenuItemImage(gray, gray, function(){}, this);
            chars[x].setPosition(110 + x * 100, 384);
            chars[x].tag = x;
            items[x] = new cc.MenuItemImage(white, white, this.selectPartyItem ,this);
            items[x].setPosition(110 + x * 100, 284);
            items[x].tag = x;
        }
        var chars_party = new cc.Menu(chars);
        var items_party = new cc.Menu(items);
        chars_party.setPosition(0, 0);
        items_party.setPosition(0, 0);
        chars_party.setName("update");
        items_party.setName("update"); //変化があった場合に更新する
        this.addChild(chars_party);
        this.addChild(items_party);
    },


    putItemList: function () {
        var items = [];
        var xRow = 3;
        var yColomn = 4;
        var x;
        var y;
        var i = 0;
        var url = "res/item/item00.png";
        for (y = 0; y < yColomn; y+=1){
            for (x = 0; x < xRow; x+=1){
                if ( order.items[i] && order.items[i].item_id ) {
                    url = "res/item/item"+("0"+order.items[i].item_id).slice(-2)+".png";
                }
                items[i] = new cc.MenuItemImage(url, url, this.selectItem ,this);
                items[i].setPosition(480 + x * 100, 384 - y * 100);   //100 = 96 + 2(padding) + 2(padding)
                items[i].setTag(i);
                ++i;
            }
        }
        var items_menu = new cc.Menu(items);
        items_menu.setPosition(0, 0);
        items_menu.setName("update");       //更新するための設定
        this.addChild(items_menu);
    },


        /**
     * アイテム編成スロットの選択
     */
    selectPartyItem: function (sender) {
        var tag = sender.getTag();
        this.select.setPartyItem(tag);
    },


    selectItem: function (sender){
        var tag = sender.getTag();
        if ( (order.items[tag]) && (order.items[tag].item_id !== 0) ){
            this.select.setItem(tag);
        } else {
            this.select.setItem(null);
        }
    },

    updateSelect: function () {
        if (this.select.isToUpdate()) {
            this.removeSelect();
            this.highLightSelect();
        }
    },


    /**
     * 選択されているキャラをハイライト表示する
     */
    highLightSelect: function (){
        this.highLightPartyItem();
        this.highLightItem();
    },


    highLightPartyItem: function () {
        var sel = this.select.getPartyItem();
        if (sel !== null){
            var party = new cc.Sprite(res.order_frame_selected);
            party.setPosition(110 + sel * 100, 284);
            party.setName("select");
            this.addChild(party, 300);
        }
    },


    highLightItem: function () {
        var sel = this.select.getItem();
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