/**
 * アイテム編成モードで表示するレイヤー
 */
var ItemLayer = cc.Layer.extend({
    select: null,
    ctor: function () {
        this._super();
        this.makeTab();
        this.makeDetail();
        this.select = new SelectState();
    },


    /**
     * モードタブの表示を更新
     */
    makeTab: function () {
        var tab_char = new cc.MenuItemImage(res.order_tab_char_off);
        var tab_item = new cc.MenuItemImage(res.order_tab_item_on);
        tab_char.setPosition(505,450);
        tab_item.setPosition(650,450);
        this.addChild(tab_char);
        this.addChild(tab_item);
    },


     /**
      * キャラ詳細表示グループの作成
      */
    makeDetail: function () {
        var detail = [
        {
            name: "detail_partytitle",
            pos: {x: 100, y: 185},
            category: false
        },
        {
            name: "detail_partyitem",
            pos: {x: 100, y: 185},
            category: true
        },
        {
            name: "detail_chartitle",
            pos: {x: 100, y: 115},
            category: false
        },
        {
            name: "detail_item",
            pos: {x: 100, y: 115},
            category: true
        },
        ];
        var detail_object = [];
        _(detail).forEach(function (val, count) {
            detail_object[count] = new cc.LabelTTF("", "Arial", 32);
            detail_object[count].setName(val.name);
            detail_object[count].setPosition(val.pos);
            this.addChild(detail_object[count]);
            if (val.category){
                this.setDetailLabel(detail_object[count]);
            } else {
                this.setDetailTitle(detail_object[count]);
            }
        }.bind(this));
    },


    /**
     * 詳細表示の項目名を表示
     */
    setDetailTitle: function (detail_char) {
        var title = [
        {
            name: "attack",
            title: "こうげき:",
            pos: {x: 10.5, y: 20}
        },
        {
            name: "endurance",
            title: "たいりょく:",
            pos: {x: 150, y: 20}
        },
        {
            name: "agility",
            title: "すばやさ:",
            pos: {x: 10.5, y: 0}
        },
        {
            name: "debuf",
            title: "いあつ:",
            pos: {x: 150, y: 0}
        },
        ];

        var create = [];
        _(title).forEach( function (val, count) {
            create[count] = new cc.LabelTTF(val.title, "Arial", 13);
            create[count].setPosition(val.pos);
            create[count].setName(val.name);
            create[count].color = {r:30, g:30, b:30, a:255};
            detail_char.addChild(create[count]);
        });
    },

    /**
     *　詳細表示の数値のラベルを作成
     */
    setDetailLabel: function (detail_char) {
        var char = [
        {
            name: "name",
            status: "----",
            pos: {x: 30, y: 40}
        },
        {
            name: "text",
            status: "----------------",
            pos: {x: 160, y: 40}
        },
        {
            name: "attack",
            status: "--",
            pos: {x: 60, y: 20}
        },
        {
            name: "endurance",
            status: "--",
            pos: {x: 210, y: 20}
        },
        {
            name: "agility",
            status: "--",
            pos: {x: 60, y: 0}
        },
        {
            name: "debuf",
            status: "--",
            pos: {x: 210, y: 0}
        },
        ];
        var create = [];
        _(char).forEach( function (val, count) {
            create[count] = new cc.LabelTTF(val.status, "Arial", 13);
            create[count].setPosition(val.pos);
            create[count].setName(val.name);
            create[count].color = {r:30, g:30, b:30, a:255};
            detail_char.addChild(create[count]);
        });
    },


    /**
     * アイテム表示の更新
     */
    updateItems: function () {
        var target = this.getChildByName("update");
        while ( target !== null) {
            target.removeFromParent();
            target = this.getChildByName("update");
        }
        this.putItemFrame();
        this.putPartyFrame();
        this.select.setUpdate();
    },


    /**
     * 所持アイテムメニューの配置
     * 一つのボタンに対してアイテム、フレームの順でメニューを重ねている
     */
    putItemFrame: function () {
        var xRow = 3;
        var yColomn = 4;

        var frames = [];
        var items = [];

        var count = 0;
        var x;
        var y;
        var url;
        for (y = 0; y < yColomn; y += 1){
            for (x = 0; x < xRow; x += 1){
                frames[count] = new cc.MenuItemImage(res.order_frame, res.order_frame, this.selectItem, this);
                frames[count].setPosition(480 + x * 100, 384 - y * 100);
                frames[count].setTag(count);

                if ( order.items[count] && order.items[count].item_id ){
                    url = "res/item/item"+("0"+order.items[count].item_id).slice(-2)+".png";
                } else {
                    url = "res/item/item00.png";
                }
                items[count] = new cc.MenuItemImage(url, url, function(){}, this);
                items[count].setPosition(480 + x * 100, 384 - y * 100);

                count += 1;
            }
        }
        items.push.apply(items, frames);    //ここでの重ね順がボタンの重ね順になる(後が上)
        var item_frame = new cc.Menu(items);
        item_frame.setPosition(0, 0);
        item_frame.setName("update");
        this.addChild(item_frame);
    },


    /**
     * 編成アイテムメニューの配置
     * 一つのボタンに対してアイテム、フィルタ、フレームの順でメニューを重ねている
     */
    putPartyFrame: function (){
        var filter_url = [res.order_icon_gray, res.order_icon_white];
        var xRow = 3;
        var yColomn = 2;

        var frames = [];
        var filters = [];
        var items = [];

        var count = 0;
        var x;
        var y;
        var url;
        for (y = 0; y < yColomn; y += 1){
            for (x = 0; x < xRow; x += 1){
                frames[count] = new cc.MenuItemImage(res.order_frame, res.order_frame, this.selectPartyItem, this);
                frames[count].setPosition(110 + x * 100, 384 - y * 100);
                frames[count].setTag(x);

                filters[count] = new cc.MenuItemImage(filter_url[y], filter_url[y], function(){}, this);
                filters[count].setPosition(110 + x * 100, 384 - y * 100);

                if (y === 0) {
                    if ( order.party[x] ){
                        url = "res/char/icon/char"+("0"+order.party[x].char_id).slice(-2)+".png";
                    } else {
                        url = "res/char/icon/char00.png";
                    }
                    items[count] = new cc.MenuItemImage(url, url, function(){}, this);
                    items[count].setPosition(110 + x * 100, 384);
                } else if (y === 1) {
                    if ( order.party[x] ){
                        url = "res/item/item"+("0"+order.party[x].item_id).slice(-2)+".png";
                    } else {
                        url = "res/item/item00.png";
                    }
                    items[count] = new cc.MenuItemImage(url, url, function(){}, this);
                    items[count].setPosition(110 + x * 100, 284);
                }
                count += 1;
            }
        }
        items.push.apply(items, filters);
        items.push.apply(items, frames);
        var party_frame = new cc.Menu(items);
        party_frame.setPosition(0, 0);
        party_frame.setName("update");
        this.addChild(party_frame);
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


    /**
     * アイテム選択状態を更新する
     */
    updateSelect: function () {
        if (this.select.isToUpdate()) {
            this.removeSelect();

            this.highLightPartyItem();
            this.highLightItem();

            this.getDetailPartyItem();
            this.getDetailItem();
        }
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
            var item = new cc.Sprite(res.order_frame_selected);
            item.setPosition(480 + 100 * (sel % 3), 384 - 100 * (sel / 3 | 0) );
            item.setName("select");
            this.addChild(item, 300);
        }
    },


    removeSelect: function(){
        var target = this.getChildByName("select");
        while (target !== null){
            target.removeFromParent();
            target = this.getChildByName("select");
        }
    },


    /**
     * 選択中の装備アイテムのステータスを取得して返す
     */
    getDetailPartyItem: function(){
        var sel = this.select.getPartyItem();
        var format;
        if (sel === null){
            format = this.formatDetailItem();
        } else {
            var item_id = order.party[sel].item_id;
            var item_detail;
            _(order.items).forEach(function(val, count) {
                if (val.item_id == item_id){
                    item_detail = val;
                    return false;
                }
            });

            format = this.formatDetailItem(item_detail);
        }

        this.setDetailItem("detail_partyitem", format);
        return format;
    },


    /**
     * 選択中のアイテムのステータスを取得する
     */
    getDetailItem: function(){
        var sel = this.select.getItem();
        var format;
        if (sel === null) {
            format = this.formatDetailItem();
        } else {
            var item_detail = order.items[sel];
            format = this.formatDetailItem(item_detail);
        }

        this.setDetailItem("detail_item", format);
    },


    /**
     * ステータスをラベルに設定しやすいよう整形する
     */
    formatDetailItem: function (detail) {
        var format = {
            name: "----",
            text: "----------------",
            attack: "--",
            endurance: "--",
            agility: "--",
            debuf: "--"
        };
        if (detail){
            format.name = detail.name;
            format.text = detail.text;
            format.attack = detail.status.attack;
            format.endurance = detail.status.endurance;
            format.agility = detail.status.agility;
            format.debuf = detail.status.debuf;
        }
        return format;
    },


    /**
     * 取得したアイテムのステータスをラベルに設定する
     * 設定先は引数で指定する ( "detail_item" or "detail_partyitem" )
     */
    setDetailItem: function (label, format) {
        var label_group = this.getChildByName(label);
        var target;
        for (var key in format){
            target = label_group.getChildByName(key);
            target.setString(format[key]);
        }
    }
});