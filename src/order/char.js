
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


    selectChar: function (sender){
        var tag = sender.getTag();
        if ( order.chars[tag] ){
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