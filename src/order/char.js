/**
 * キャラ編成モードで表示するレイヤー
 */
var CharLayer = cc.Layer.extend({
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
     makeTab: function (){
        var tab_char = new cc.MenuItemImage(res.order_tab_char_on);
        var tab_item = new cc.MenuItemImage(res.order_tab_item_off);
        tab_char.setPosition(505,450);
        tab_item.setPosition(650,450);
        this.addChild(tab_char);
        this.addChild(tab_item);
     },


     /**
      * キャラ詳細表示グループの作成
      *
      */
    makeDetail: function () {
        var detail = [
        {
            name: "detail_partytitle",
            pos: {x: 100, y: 185},
            category: false
        },
        {
            name: "detail_partychar",
            pos: {x: 100, y: 185},
            category: true
        },
        {
            name: "detail_chartitle",
            pos: {x: 100, y: 115},
            category: false
        },
        {
            name: "detail_char",
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
            name: "name",
            title: "なまえ:",
            pos: {x: 0, y: 40}
        },
        {
            name: "level",
            title: "れべる:",
            pos: {x: 120, y: 40}
        },
        {
            name: "exp",
            title: "けいけん:",
            pos: {x: 200.5, y: 40}
        },
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
            pos: {x: 60, y: 40}
        },
        {
            name: "level",
            status: "--",
            pos: {x: 157, y: 40}
        },
        {
            name: "exp",
            status: "--",
            pos: {x: 240, y: 40}
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

     /*
      * キャラ表示の更新
      */
    updateChars: function () {
        var target = this.getChildByName("update");
        while ( target !== null) {
            target.removeFromParent();
            target = this.getChildByName("update");
        }
        this.putCharFrame();
        this.putPartyFrame();
        this.select.setUpdate();
    },


    /**
     * 所持キャラメニューの配置
     * 一つのボタンに対してキャラ、フレームの順でメニューを重ねている
     */
    putCharFrame: function () {
        var xRow = 3;
        var yColomn = 4;

        var frames = [];
        var chars = [];

        var count = 0;
        var x;
        var y;
        var url;
        for (y = 0; y < yColomn; y += 1){
            for (x = 0; x < xRow; x += 1){
                frames[count] = new cc.MenuItemImage(res.order_frame, res.order_frame, this.selectChar, this);
                frames[count].setPosition(480 + x * 100, 384 - y * 100);
                frames[count].setTag(count);

                if ( order.chars[count] && order.chars[count].char_id ){
                    url = "res/char/icon/char"+("0"+order.chars[count].char_id).slice(-2)+".png";
                } else {
                    url = "res/char/icon/char00.png";
                }
                chars[count] = new cc.MenuItemImage(url, url, function(){}, this);
                chars[count].setPosition(480 + x * 100, 384 - y * 100);

                count += 1;
            }
        }
        chars.push.apply(chars, frames);    //ここでの重ね順がボタンの重ね順になる(後が上)
        var char_frame = new cc.Menu(chars);
        char_frame.setPosition(0, 0);
        char_frame.setName("update");
        this.addChild(char_frame);
    },


    /**
     * 編成キャラメニューの配置
     * 一つのボタンに対してキャラ、フィルタ、フレームの順でメニューを重ねている
     */
    putPartyFrame: function (){
        var filter_url = [res.order_icon_white, res.order_icon_gray];
        var xRow = 3;
        var yColomn = 2;

        var frames = [];
        var filters = [];
        var chars = [];

        var count = 0;
        var x;
        var y;
        var url;
        for (y = 0; y < yColomn; y += 1){
            for (x = 0; x < xRow; x += 1){
                frames[count] = new cc.MenuItemImage(res.order_frame, res.order_frame, this.selectPartyChar, this);
                frames[count].setPosition(110 + x * 100, 384 - y * 100);
                frames[count].setTag(x);

                filters[count] = new cc.MenuItemImage(filter_url[y],filter_url[y], function(){}, this);
                filters[count].setPosition(110 + x * 100, 384 - y * 100);

                if (y === 0){
                    if ( order.party[x] ){
                        url = "res/char/icon/char"+("0"+order.party[x].char_id).slice(-2)+".png";
                    } else {
                        url = "res/char/icon/char00.png";
                    }
                    chars[count] = new cc.MenuItemImage(url, url, function(){}, this);
                    chars[count].setPosition(110 + x * 100, 384);
                } else if (y === 1) {
                    if ( order.party[x] ){
                        url = "res/item/item"+("0"+order.party[x].item_id).slice(-2)+".png";
                    } else {
                        url = "res/item/item00.png";
                    }
                    chars[count] = new cc.MenuItemImage(url, url, function(){}, this);
                    chars[count].setPosition(110 + x * 100, 284);
                }
                count += 1;
            }
        }
        chars.push.apply(chars, filters);
        chars.push.apply(chars, frames);
        var party_frame = new cc.Menu(chars);
        party_frame.setPosition(0, 0);
        party_frame.setName("update");
        this.addChild(party_frame);
    },


    /**
     * 編成キャラのキャラが選択された
     */
    selectPartyChar: function (sender) {
        var tag = sender.getTag();
        this.select.setPartyChar(tag);
    },


    /**
     * キャラ一覧のキャラが選択された
     */
    selectChar: function (sender){
        var tag = sender.getTag();
        if ( order.chars[tag] ){
            this.select.setChar(tag);
        } else {
            this.select.setChar(null);
        }
    },


    /**
     * キャラ選択状態を更新する
     */
    updateSelect: function () {
        if (this.select.isToUpdate()){
            this.removeSelect();

            this.highLightPartyChar();
            this.highLightChar();

            this.getDetailPartyChar(); //選択パーティキャラのステータスを表示
            this.getDetailChar();      //選択キャラのステータスを表示

        }
    },


    highLightPartyChar: function () {
        var sel = this.select.getPartyChar();
        if (sel !== null){
            var party = new cc.Sprite(res.order_frame_selected);
            party.setPosition(110 + sel * 100, 384);
            party.setName("select");
            this.addChild(party, 300);
        }
    },


    highLightChar: function () {
        var sel = this.select.getChar();
        if (sel !== null){
            var char = new cc.Sprite(res.order_frame_selected);
            char.setPosition(480 + 100 * (sel % 3), 384 - 100 * (sel / 3 | 0) );
            char.setName("select");
            this.addChild(char,300);
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
     * 選択中のパーティキャラのステータスを取得して返す
     */
    getDetailPartyChar: function(){
        var sel = this.select.getPartyChar();
        var format;
        if (sel === null){
            format = this.formatDetailChar();
        } else {
            var char_id = order.party[sel].char_id;
            var char_detail;
            _(order.chars).forEach(function(val, count) {
                if (val.char_id == char_id){
                    char_detail = val;
                    return false;
                }
            });

            format = this.formatDetailChar(char_detail);
        }

        this.setDetailChar("detail_partychar", format);
        return format;
    },


    /**
     * 選択中のキャラのステータスを取得する
     */
    getDetailChar: function(){
        var sel = this.select.getChar();
        var format;
        if (sel === null) {
            format = this.formatDetailChar();
        } else {
            var char_detail = order.chars[sel];
            format = this.formatDetailChar(char_detail);
        }

        this.setDetailChar("detail_char", format);
    },


    /**
     * ステータスをラベルに設定しやすいよう整形する
     */
    formatDetailChar: function (detail) {
        var format = {
        name: {
            text: "----",
            color: {r:30, g:30, b:30, a:255},
        },
        level: {
            text: "--",
            color: {r:30, g:30, b:30, a:255},
        },
        exp: {
            text: "--",
            color: {r:30, g:30, b:30, a:255},
        },
        attack: {
            text: "--",
            color: {r:30, g:30, b:30, a:255},
        },
        endurance: {
            text: "--",
            color: {r:30, g:30, b:30, a:255},
        },
        agility: {
            text: "--",
            color: {r:30, g:30, b:30, a:255},
        },
        debuf: {
            text: "--",
            color: {r:30, g:30, b:30, a:255},
        }
        };
        if (detail){
            format.name.text = detail.name;
            format.level.text = detail.level;
            format.exp.text = detail.exp;
            for (var key in detail.status){
                format[key].text = detail.status[key];
                if (detail.status[key] >= detail.status_max[key]){
                    format[key].color = {r:0, g:0, b:200, a:255};
                }
            }
        }
        return format;
    },


    /**
     * 取得したキャラのステータスをラベルに設定する
     * 設定先は引数で指定する ( "detail_char" or "detail_partychar" )
     */
    setDetailChar: function (label, format) {
        var label_group = this.getChildByName(label);
        var target;
        for (var key in format){
            target = label_group.getChildByName(key);
            target.setString(format[key].text);
            target.color = format[key].color;
        }
    },
});