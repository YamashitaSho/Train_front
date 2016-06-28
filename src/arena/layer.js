var ArenaLayer = cc.Layer.extend({
    size: null,
    message: null,
    back: false,
    join: null,
    ctor:function () {
        this._super();
        this.size = cc.director.getWinSize();

        this._putTitle();
        this._putFrame();
        this._putMessage();
        this._putCharSprite();
        this._putDetail();
        this._addBackButton();
    },


    _putTitle: function () {
        var head = new cc.Sprite(res.arena_ttl);
        head.setPosition(this.size.width / 2, this.size.height - 80);
        this.addChild(head);
    },


    _putFrame: function (){
        var frame = new cc.Sprite(res.frame);
        frame.setPosition(this.size.width / 2, this.size.height / 2);
        this.addChild(frame);
    },


    _putMessage: function (){
        this.message = new cc.LabelTTF("挑むアリーナを挑んでください", "Arial", 16);
        this.message.setVisible(false);
        this.message.setPosition(200, 270);
        this.message.setColor(30,30,30,255);
        this.addChild(this.message);
    },


    /*
     * キャラ表示用スプライトを作成
     */
    _putCharSprite: function () {
        var chars = new cc.Sprite();
        chars.setPosition(0,0);
        chars.setName("chars");
        this.addChild(chars);
        var char = [];
        for (var i = 0; i < 3 ; i++){
            char[i] = new cc.Sprite(res.order_icon_gray);
            char[i].setName(""+i);
            char[i].setPosition(100 + i * 240, 400);
            chars.addChild(char[i]);
        }
    },


    /**
     * キャラステータス表示用ラベルを作成
     */
    _putDetail: function () {
        var detail = [
        {
            name: "detail_title_0",
            category: false,
            pos: {x: 80, y:320}
        },
        {
            name: "detail_title_1",
            category: false,
            pos: {x: 320, y:320}
        },
        {
            name: "detail_title_2",
            category: false,
            pos: {x: 560, y:320}
        },
        {
            name: "detail_status_0",
            category: true,
            pos: {x: 80, y:320}
        },
        {
            name: "detail_status_1",
            category: true,
            pos: {x: 320, y:320}
        },
        {
            name: "detail_status_2",
            category: true,
            pos: {x: 560, y:320}
        }
        ];
        var detail_object = [];
        _(detail).forEach(function (val, count) {
            detail_object[count] = new cc.LabelTTF("", "Arial", 13);
            detail_object[count].setName(val.name);
            detail_object[count].setPosition(val.pos);
            if (val.category === true){
                this._setDetailLabel(detail_object[count]);
            } else {
                this._setDetailTitle(detail_object[count]);
            }
            this.addChild(detail_object[count]);
        }.bind(this));
    },


    /**
     * 取得キャラ表示の項目名を設定
     */
    _setDetailTitle: function (detail) {
        var title = [
        {
            key: "name",
            value: "なまえ:",
            pos: {x: 100, y: 110}
        },
        {
            key: "level",
            value: "れべる:",
            pos: {x: 100, y: 90}
        },
        {
            key: "exp",
            value: "けいけん:",
            pos: {x: 100.5, y: 70}
        },
        {
            key: "attack",
            value: "こうげき:",
            pos: {x: 0.5, y: 20}
        },
        {
            key: "endurance",
            value: "たいりょく:",
            pos: {x: 100, y: 20}
        },
        {
            key: "agility",
            value: "すばやさ:",
            pos: {x: 0.5, y: 0}
        },
        {
            key: "debuf",
            value: "いあつ:",
            pos: {x: 100, y: 0}
        },
        ];

        var create = [];
        _(title).forEach( function (val, count) {
            create[count] = new cc.LabelTTF(val.value, "Arial", 13);
            create[count].setPosition(val.pos);
            create[count].setName(val.key);
            create[count].color = {r:30, g:30, b:30, a:255};
            detail.addChild(create[count]);
        });
    },


    /**
     * 取得キャラ表示の項目を設定
     */
    _setDetailLabel: function (detail) {
        var label = [
        {
            key: "name",
            value: "----",
            pos: {x: 160, y: 110}
        },
        {
            key: "level",
            value: "--",
            pos: {x: 160, y: 90}
        },
        {
            key: "exp",
            value: "--",
            pos: {x: 160, y: 70}
        },
        {
            key: "attack",
            value: "--",
            pos: {x: 45, y: 20}
        },
        {
            key: "endurance",
            value: "--",
            pos: {x: 160, y: 20}
        },
        {
            key: "agility",
            value: "--",
            pos: {x: 45, y: 0}
        },
        {
            key: "debuf",
            value: "--",
            pos: {x: 160, y: 0}
        },
        ];

        var create = [];
        _(label).forEach( function (val, count) {
            create[count] = new cc.LabelTTF(val.value, "Arial", 13);
            create[count].setPosition(val.pos);
            create[count].setName(val.key);
            create[count].color = {r:30, g:30, b:30, a:255};
            detail.addChild(create[count]);
        });
    },


    /**
     * APIで取得したパーティ情報でレイヤーを更新する
     */
    updateStatus: function (data){
        console.log(data);
        this._setCharStatusLabel(data.chars);
        this._addArenaList(data.stages);
        this.message.setVisible(true);
    },


    _setCharStatusLabel: function (data){
        var label_group;
        var char_sprite_group = this.getChildByName("chars");

        for (var index in data){
            label_group = this.getChildByName("detail_status_" + index);
            this._loadStatus(data[index], label_group);
            char_sprite = char_sprite_group.getChildByName(index);
            this._loadCharImage(data[index], char_sprite);
        }

    },


    /**
     * 取得したキャラのステータスをラベルに設定する
     * 設定先は引数で指定する (label_group)
     */
    _loadStatus: function (data, label_group) {
        var target;
        var format = this._formatDetailChar(data);

        for (var key in format){
            target = label_group.getChildByName(key);
            target.setString(format[key].text);
        }
    },


    /**
     * ステータスをラベルに設定しやすいよう整形する
     */
    _formatDetailChar: function (detail) {
        var format = {
        name: {
            text: "----",
        },
        level: {
            text: "--",
        },
        exp: {
            text: "--",
        },
        attack: {
            text: "--",
        },
        endurance: {
            text: "--",
        },
        agility: {
            text: "--",
        },
        debuf: {
            text: "--",
        }
        };
        if (detail){
            format.name.text = detail.name;
            format.level.text = detail.level;
            format.exp.text = detail.exp;
            for (var key in detail.status){
                format[key].text = detail.status[key];
            }
        }
        return format;
    },


    /**
     * パーティのキャラ画像を反映する
     */
    _loadCharImage: function (data, sprite) {
        var url = "res/char/icon/char" + ("0" + data.char_id).slice(-2) + ".png";
        sprite.setTexture(url);
    },


    /**
     * 受け取ったアリーナの数だけアリーナ画像を並べる
     */
    _addArenaList: function (arenas){
        var poslist = {
            0: {x:100, y:200},
            1: {x:200, y:150},
            2: {x:300, y:200},
            3: {x:400, y:150},
            4: {x:500, y:200},
            5: {x:600, y:150},
            6: {x:700, y:200},
        };
        var url;
        var buttons = [];
        for (var key in arenas){
            if (key > 6){
                break;
            }
            url = "res/arena/button-" + key + ".png";
            buttons[key] = new cc.MenuItemImage(url, url, this._joinArena, this);
            buttons[key].setName("arena" + key);
            buttons[key].setPosition(poslist[key]);
        }
        var menu = new cc.Menu(buttons);
        menu.setName("arena");
        menu.setPosition(0, 0);
        this.addChild(menu);
    },


    /**
     * アリーナボタンがクリックされた
     */
    _joinArena: function (sender) {
        sender.setEnabled(false);
        this.join = sender.getName().slice(-1);
    },


    /**
     * 戻るボタンの表示
     */
    _addBackButton: function (){
        var back = new cc.MenuItemImage(res.back, res.back, this._selectBack, this);
        var back_menu = new cc.Menu(back);
        back_menu.setPosition(50, 50);
        this.addChild(back_menu,200);
    },


    /**
     * 戻るボタンが押された
     */
    _selectBack: function () {
        this.back = true;
    },

});