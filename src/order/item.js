

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
        if ( !select.canChangeItem() ){
            return;
        }
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