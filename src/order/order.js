var size;
var order;
var update_flag = false;
var char_mode = true;

var select = new SelectState();

/**
 * モード切り替えで変化しない情報を記述するレイヤー
 */
var OrderLayer = cc.Layer.extend({
    ctor: function () {
        this._super();

        size = cc.director.getWinSize();

        var head = new cc.Sprite(res.order_ttl);
        head.setPosition(size.width / 2, size.height - 80);
        this.addChild(head,1);

        var frame = new cc.Sprite(res.frame);
        frame.setPosition(400,300);
        this.addChild(frame,2);

        this.makeList();
        this.makeParty();
        this.makeDetail();
        this.updateSelect();
    },


    makeList: function () {
        var frames = [];
        var x;
        var y;
        var xRow = 3;
        var yColomn = 4;
        for (y = 0; y < yColomn; y+=1){
            for (x = 0; x < xRow; x+=1){
                frames[i] = new cc.Sprite(res.order_frame);
                frames[i].setPosition(480 + x * 100, 384 - y * 100);   //100 = 96 + 2(padding) + 2(padding)
                this.addChild(frames[i],100);
                ++i;
            }
        }
    },


    makeParty: function () {
        var frames = [];
        var x;
        var y;
        var xRow = 3;
        var yColomn = 2;
        for (y = 0; y < yColomn; y+=1){
            for (x = 0; x < xRow; x+=1){
                frames[i] = new cc.Sprite(res.order_frame);
                frames[i].setPosition(110 + x * 100, 384 - y * 100);   //100 = 96 + 2(padding) + 2(padding)
                this.addChild(frames[i],100);
                ++i;
            }
        }
    },


    makeDetail: function () {
        var frame = new cc.Sprite(res.order_detail);
        frame.setPosition(215, 148);
        this.addChild(frame,100);
    },


    /*
     * 受信したパーティ情報を画面に反映する
     */
    updatePartyList: function (){
        var chars = [];
        var items = [];
        var xRow = 3;
        var char_url;
        var item_url;
        var x;
        for (x = 0; x < xRow; x+=1){
            if ( order.party[x] ){
                char_url = "res/char/icon/char"+("0"+order.party[x].char_id).slice(-2)+".png";
                item_url = "res/item/item"+("0"+order.party[x].item_id).slice(-2)+".png";
            } else {
                char_url = "res/char/icon/char00.png";
                item_url = "res/item/item00.png";
            }
            chars[x] = new cc.MenuItemImage(char_url, char_url, this.selectChar ,this);
            chars[x].setPosition(110 + x * 100, 384);
            chars[x].tag = x;
            items[x] = new cc.MenuItemImage(item_url, item_url, this.selectItem ,this);
            items[x].setPosition(110 + x * 100, 284);
            items[x].tag = x;
        }
        var chars_party = new cc.Menu(chars);
        var items_party = new cc.Menu(items);
        chars_party.setPosition(0, 0);
        items_party.setPosition(0, 0);
        chars_party.setName("update"); //変化があった場合に更新する
        items_party.setName("update");
        this.addChild(chars_party);
        this.addChild(items_party);
    },


    selectChar: function (sender){
        var tag = sender.getTag();
        if ( (order.party[tag] ) && (order.party[tag].char_id !== 0) ){
            select.setPartyChar(tag);
        } else {
            select.setPartyChar(null);
        }
    },


    selectItem: function (sender){
        var tag = sender.getTag();
        if ( (order.party[tag] ) && (order.party[tag].item_id !== 0) ){
            select.setPartyItem(tag);
        } else {
            select.setPartyItem(null);
        }
    },


    /**
     * 選択されているキャラ・アイテムをハイライト表示する
     */
    updateSelect: function (){
        if (select.party_char !== null){
            var party_char = new cc.Sprite(res.order_frame_selected);
            party_char.setPosition(110 + select.party_char * 100, 384);
            party_char.setName("select");
            this.addChild(party_char,300);
        }
        if (select.party_item !== null){
            var party_item = new cc.Sprite(res.order_frame_selected);
            party_item.setPosition(110 + select.party_item * 100, 284);
            party_item.setName("select");
            this.addChild(party_item,300);
        }
        if (select.char !== null && char_mode === true){
            var char = new cc.Sprite(res.order_frame_selected);
            char.setPosition(480 + 100 * (select.char % 3), 384 - 100 * (select.char / 3 | 0) );
            char.setName("select");
            this.addChild(char,300);
        }
        if (select.item !== null && char_mode === false){
            var item = new cc.Sprite(res.order_frame_selected);
            item.setPosition(480 + 100 * (select.item % 3), 384 - 100 * (select.item / 3 | 0) );
            item.setName("select");
            this.addChild(item,300);
        }
    }
});


var CharLayer = cc.Layer.extend({
    ctor: function () {
        this._super();
        this.makeTab();         //モードタブ作成
        this.makeChangeButton();//入れ替えボタン作成
    },


    /**
     * タブボタン生成
     */
     makeTab: function (){
        var tab_char = new cc.MenuItemImage(res.order_tab_char_on, res.order_tab_char_on, this.toItemMode, this);
        var tab_item = new cc.MenuItemImage(res.order_tab_item_off, res.order_tab_item_off, this.toItemMode, this);
        tab_char.setPosition(505,450);  // 480 + 48
        tab_item.setPosition(650,450);

        var tab = new cc.Menu(tab_char, tab_item);
        tab.setPosition(0,0);
        this.addChild(tab);
     },

    /**
     * 所持キャラボタン表示メソッド
     */
    updateCharList: function () {
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


    selectChar: function (sender){
        var tag = sender.getTag();
        if ( (order.chars[tag]) && (order.chars[tag].char_id !== 0) ){
            select.setChar(tag);
        } else {
            select.setChar(null);
        }
    },


    toItemMode: function (){
        console.log("toItemMode");
        var scene = this.getParent();
        var charLayer = scene.getChildByName("char");
        var itemLayer = scene.getChildByName("item");
        charLayer.setVisible(false);
        itemLayer.setVisible(true);
        char_mode = false;
        select.setUpdate();
    },


    makeChangeButton: function (){
        var change_button = new cc.MenuItemImage(res.order_change, res.order_change, this.apiChangeOrderChar, this);
        var change_menu = new cc.Menu(change_button);
        change_menu.setPosition(200,40);
        this.addChild(change_menu);
    },


    /**
     * キャラ編成変更情報APIの送信
     */
    apiChangeOrderChar: function (){
        if ( !select.canChangeChar() ){
            return;
        }
        var request = {
            slot: select.party_char,
            new_id: order.chars[select.getChar()].char_id
        };
        $.ajax({
            url:"http://homestead.app:8000/v1/order/char/",
            data:request,
            type:"PUT"
        }).done(function(data){
            console.log("success!");
            console.log(data);
            update_flag = true;
        }).fail(function(data){
            console.log("failed...");
            console.log(data);
        });
    }
});


var ItemLayer = cc.Layer.extend({
    ctor: function () {
        this._super();
        //タブボタン生成
        var tab_char = new cc.MenuItemImage(res.order_tab_char_off, res.order_tab_char_off, this.toCharMode, this);
        var tab_item = new cc.MenuItemImage(res.order_tab_item_on, res.order_tab_item_on, this.toCharMode, this);
        tab_char.setPosition(505,450);  // 480 + 48
        tab_item.setPosition(650,450);
        var tab = new cc.Menu(tab_char, tab_item);
        tab.setPosition(0,0);
        this.makeChangeButton();
        this.addChild(tab);
    },


    updateItemList: function () {
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


    selectItem: function (sender){
        var tag = sender.getTag();
        if ( (order.items[tag]) && (order.items[tag].item_id !== 0) ){
            select.setItem(tag);
        } else {
            select.setItem(null);
        }
    },


    toCharMode: function (){
        console.log("toCharMode");
        var scene = this.getParent();
        var charLayer = scene.getChildByName("char");
        var itemLayer = scene.getChildByName("item");
        charLayer.setVisible(true);
        itemLayer.setVisible(false);
        char_mode = true;
    },


    makeChangeButton: function (){
        var change_button = new cc.MenuItemImage(res.order_change, res.order_change, this.apiChangeOrderItem, this);
        var change_menu = new cc.Menu(change_button);
        change_menu.setPosition(200,40);
        this.addChild(change_menu);
    },


    /**
     * アイテム編成変更APIの送信
     */
    apiChangeOrderItem: function (){
        var request = {
            slot: select.party_item,
            new_id: order.items[select.item].item_id
        };
        $.ajax({
            url:"http://homestead.app:8000/v1/order/item/",
            data:request,
            type:"PUT"
        }).done(function(data){
            console.log("success!");
            console.log(data);
            update_flag = true;
        }).fail(function(data){
            console.log("failed...");
            console.log(data);
        });
    }

});


var OrderScene = cc.Scene.extend({
    // Layerクラスをnewするにはthis._super()が必要
    charLayer: null,
    itemLayer: null,
    commonLayer: null,
    onEnter: function () {
        this._super();
        var backgroundLayer = new cc.LayerColor(cc.color(170, 255, 255, 255));
        this.commonLayer = new OrderLayer();
        this.charLayer = new CharLayer();
        this.itemLayer = new ItemLayer();

        this.charLayer.setName("char");
        this.itemLayer.setName("item");
        this.itemLayer.setVisible(false);   //itemLayerは初期で非表示

        this.addChild(backgroundLayer, 0);
        this.addChild(this.charLayer, 100);
        this.addChild(this.itemLayer, 101);
        this.addChild(this.commonLayer, 200);

        this.apiGetOrder();

        this.scheduleUpdate();
    },


    /**
     * 編成情報取得APIの送信
     * 各レイヤーに取得した情報を反映する
     */
    apiGetOrder: function (){
        $.ajax({
            url: "http://homestead.app:8000/v1/order/",
            type: "GET"
        }).done(function (data) {
            console.log("success!");
            console.log(data);
            order = data;
            this.updateAppearance();
        }.bind(this)).fail(function (data) {
            console.log("failed...");
            console.log(data);
        });
    },


    update: function () {
        if (update_flag === true){
            update_flag = false;
            this.apiGetOrder();
        }
        var stat = select.isToUpdate();
        if (stat === true){
            var target = this.commonLayer.getChildByName("select");
            while ( target !== null ) {
                target.removeFromParent();
                target = this.commonLayer.getChildByName("select");
            }
            this.commonLayer.updateSelect();
        }

    },


    updateAppearance: function () {
        //update対象のものを削除する
        var target = this.commonLayer.getChildByName("update");
        while ( target !== null ) {
            target.removeFromParent();
            target = this.commonLayer.getChildByName("update");
        }
        target = this.charLayer.getChildByName("update");
        while ( target !== null ) {
            target.removeFromParent();
            target = this.commonLayer.getChildByName("update");
        }
        target = this.itemLayer.getChildByName("update");
        while ( target !== null ) {
            target.removeFromParent();
            target = this.commonLayer.getChildByName("update");
        }
        this.charLayer.updateCharList();
        this.itemLayer.updateItemList();
        this.commonLayer.updatePartyList();
    },


    onExit: function () {
        console.log("OrderScene onExit()");
    }
});
