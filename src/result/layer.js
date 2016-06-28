var ResultLayer = cc.Layer.extend({
    size: null,
    back: false,
    arena: false,
    quest: false,
    ctor:function () {
        this._super();

        this.size = cc.director.getWinSize();
        this._putTitle();
        this._putFrame();
        this._putCharSprite();
        this._putMenu();
        this._putDetailLabel();
        this._putResult();
    },


    _putTitle: function () {
        var head = new cc.Sprite(res.result_ttl);
        head.setPosition(this.size.width / 2, this.size.height - 80);
        this.addChild(head);
    },


    _putFrame: function (){
        var frame = new cc.Sprite(res.frame);
        frame.setPosition(this.size.width / 2, this.size.height / 2);
        this.addChild(frame);
    },


    /**
     * キャラ画像用スプライトを配置
     */
    _putCharSprite: function () {
        var char = new cc.Sprite();
        char.setPosition(200,380);
        char.setName("char");
        char.setVisible(false);
        this.addChild(char);
    },


    _putResult: function () {
        var result = new cc.Sprite();
        result.setPosition(this.size.width / 2, this.size.height -200);
        result.setName("result");
        result.setVisible(false);
        this.addChild(result);
    },


    _putDetailLabel: function () {
        this._putCharLabel();
        this._putPrize();
        this._putMoney();
    },


    _putMoney: function () {
        var title = new cc.LabelTTF("しょじきん", "Arial", 32);
        title.setPosition(590,360);
        title.setColor(30,30,30,255);
        var money = new cc.LabelTTF("00000", "Arial", 32);
        money.setPosition(730, 360);
        money.setName("money");
        money.setColor(30,30,30,255);

        var moneysp = new cc.Sprite();
        moneysp.addChild(money);
        moneysp.addChild(title);
        moneysp.setName("money");
        moneysp.setVisible(false);
        this.addChild(moneysp);

    },


    _putPrize: function () {
        var title = new cc.LabelTTF("かくとく", "Arial", 32);
        title.setPosition(590,400);
        title.setColor(30,30,30,255);
        var prize = new cc.LabelTTF("00000", "Arial", 32);
        prize.setPosition(730,400);
        prize.setName("prize");
        prize.setColor(30,30,30,255);

        var prizesp = new cc.Sprite();
        prizesp.addChild(title);
        prizesp.addChild(prize);
        prizesp.setName("prize");
        prizesp.setVisible(false);
        this.addChild(prizesp);
    },


    /**
     * キャラステータス表示用ラベルを作成
     */
    _putCharLabel: function () {
        var detail = [
        {
            name: "detail_title_0",
            category: "title",
            pos: {x: 80, y:160}
        },
        {
            name: "detail_title_1",
            category: "title",
            pos: {x: 320, y:160}
        },
        {
            name: "detail_title_2",
            category: "title",
            pos: {x: 560, y:160}
        },
        {
            name: "detail_status_0",
            category: "label",
            pos: {x: 80.5, y:160}
        },
        {
            name: "detail_status_1",
            category: "label",
            pos: {x: 320, y:160}
        },
        {
            name: "detail_status_2",
            category: "label",
            pos: {x: 560.5, y:160}
        },
        {
            name: "detail_obtain_0",
            category: "label",
            pos: {x: 180, y:160}
        },
        {
            name: "detail_obtain_1",
            category: "label",
            pos: {x: 420, y:160}
        },
        {
            name: "detail_obtain_2",
            category: "label",
            pos: {x: 660, y:160}
        },
        {
            name: "detail_arrow_0",
            category: "arrow",
            pos: {x: 190, y:160}
        },
        {
            name: "detail_arrow_1",
            category: "arrow",
            pos: {x: 430, y:160}
        },
        {
            name: "detail_arrow_2",
            category: "arrow",
            pos: {x: 670, y:160}
        }
        ];
        var detail_object = [];
        _(detail).forEach(function (val, count) {
            detail_object[count] = new cc.LabelTTF("", "Arial", 13);
            detail_object[count].setName(val.name);
            detail_object[count].setPosition(val.pos);
            if (val.category === "label"){
                this._setDetailLabel(detail_object[count]);
            } else if (val.category === "title"){
                this._setDetailTitle(detail_object[count]);
            } else if (val.category === "arrow"){
                this._setArrow(detail_object[count]);
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
            pos: {x: 40, y: 110}
        },
        {
            key: "level",
            value: "れべる:",
            pos: {x: 0, y: 90}
        },
        {
            key: "exp",
            value: "けいけん:",
            pos: {x: 0.5, y: 70}
        },
        {
            key: "attack",
            value: "こうげき:",
            pos: {x: 0.5, y: 50}
        },
        {
            key: "endurance",
            value: "たいりょく:",
            pos: {x: 0, y: 30}
        },
        {
            key: "agility",
            value: "すばやさ:",
            pos: {x: 0.5, y: 10}
        },
        {
            key: "debuf",
            value: "いあつ:",
            pos: {x: 0, y: -10}
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
     * 取得キャラ表示の項目名を設定
     */
    _setArrow: function (detail) {
        var pos = [
            {x: 0, y: 90},
            {x: 0, y: 70},
            {x: 0, y: 50},
            {x: 0, y: 30},
            {x: 0, y: 10},
            {x: 0, y: -10},
        ];

        var create = [];
        _(pos).forEach( function (val, count) {
            create[count] = new cc.LabelTTF("→", "Arial", 13);
            create[count].setPosition(val);
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
            value: "",
            pos: {x: 100, y: 110}
        },
        {
            key: "level",
            value: "--",
            pos: {x: 60, y: 90}
        },
        {
            key: "exp",
            value: "--",
            pos: {x: 60, y: 70}
        },
        {
            key: "attack",
            value: "--",
            pos: {x: 60, y: 50}
        },
        {
            key: "endurance",
            value: "--",
            pos: {x: 60, y: 30}
        },
        {
            key: "agility",
            value: "--",
            pos: {x: 60, y: 10}
        },
        {
            key: "debuf",
            value: "--",
            pos: {x: 60, y: -10}
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


    _putMenu: function () {
        this._putQuestMenu();
        this._putArenaMenu();
    },


    /**
     * クエスト系統のボタンを配置(非表示)
     */
    _putQuestMenu: function () {
        var back = new cc.MenuItemImage(res.back, res.back, this._selectBack, this);
        var next = new cc.MenuItemImage(res.one_more, res.one_more, this._selectNextQuest, this);
        back.setPosition(50, 50);
        next.setPosition(400,60);
        back.setName("back");
        next.setName("next");

        var menu = new cc.Menu(back, next);
        menu.setPosition(0, 0);
        menu.setName("quest_menu");
        menu.setVisible(false);
        this.addChild(menu);
    },


    /**
     * アリーナ系統のボタンを配置(非表示)
     */
    _putArenaMenu: function () {
        var back = new cc.MenuItemImage(res.back, res.back, this._selectBack, this);
        var next = new cc.MenuItemImage(res.one_more, res.one_more, this._selectNextArena, this);
        back.setPosition(50, 50);
        next.setPosition(400,60);
        back.setName("back");
        next.setName("next");
        back.setVisible(false);

        var menu = new cc.Menu(back, next);
        menu.setPosition(0, 0);
        menu.setName("arena_menu");
        menu.setVisible(false);
        this.addChild(menu);
    },


    setAppearance: function (data) {
        this._setMenuEnabled(data.type, data.is_win);
        this._setCharSprite(data.obtained[0].char_id);
        this._setLabels(data);
        this._setResult(data.is_win);
    },


    _setMenuEnabled: function (type, is_win) {
        var type_initial = type.charAt(0);
        var type_bottom = type.slice(-1);
        var menu;
        if (type_initial == "a"){      //arena
            menu = this.getChildByName("arena_menu");
            menu.setVisible(true);
            if ((type_bottom == "2") || !is_win){
                var back = menu.getChildByName("back");
                back.setVisible(true);
                var next = menu.getChildByName("next");
                next.setVisible(false);
            }
        } else if (type_initial == "q") { //quest
            menu = this.getChildByName("quest_menu");
            menu.setVisible(true);
        }
    },


    _setResult: function (is_win){
        var result = (is_win) ? 'result_win' : 'result_false';
        var result_sprite = this.getChildByName("result");
        result_sprite.setTexture(res[result]);
        result_sprite.setVisible(true);
    },

    /**
     * スプライトにキャラ画像を設定
     */
    _setCharSprite: function (char_id) {
        var char = this.getChildByName("char");
        var url = "res/char/org/char"+("0"+char_id).slice(-2)+".png";
        if (char !== null){
            char.setTexture(url);
            char.setVisible(true);
        } else {
            char = new cc.Sprite(url);
            char.setPosition(200,380);
            char.setName("char");
            this.addChild(char);
        }
    },


    _setLabels: function (data){
        var format;
        for (var key in data.chars){
            format = this._formatDetailChar(data.chars[key]);
            this._setDetailChar("detail_status_"+key, format);
        }
        for (key in data.obtained){
            format = this._formatObtainChar(data.obtained[key]);
            this._setDetailChar("detail_obtain_"+key, format);
        }
        var moneysp = this.getChildByName("money");
        var money = moneysp.getChildByName("money");
        money.setString(data.money);
        moneysp.setVisible(true);
        var prizesp = this.getChildByName("prize");
        var prize = prizesp.getChildByName("prize");
        prize.setString(data.prize);
        prizesp.setVisible(true);
    },


    _setDetailChar: function (label, format) {
        var label_group = this.getChildByName(label);
        var target;
        for (var key in format){
            target = label_group.getChildByName(key);
            target.setString(format[key].text);
            target.color = format[key].color;
        }
    },


    _formatDetailChar: function (detail) {
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
            }
        }
        return format;
    },

    _formatObtainChar: function (detail) {
        var format = {
        level: {
            text: "--",
            color: {r:0, g:0, b:200, a:255},
        },
        exp: {
            text: "--",
            color: {r:0, g:0, b:200, a:255},
        },
        attack: {
            text: "--",
            color: {r:0, g:0, b:200, a:255},
        },
        endurance: {
            text: "--",
            color: {r:0, g:0, b:200, a:255},
        },
        agility: {
            text: "--",
            color: {r:0, g:0, b:200, a:255},
        },
        debuf: {
            text: "--",
            color: {r:0, g:0, b:200, a:255},
        }
        };
        if (detail){
            format.level.text = detail.level;
            format.exp.text = detail.exp;
            for (var key in detail.status){
                format[key].text = detail.status[key];
            }
        }
        return format;
    },


    _selectBack: function (){
        this.back = true;
    },


    _selectNextQuest: function (){
        this.quest = true;
    },

    _selectNextArena: function (){
        this.arena = true;
    }

});