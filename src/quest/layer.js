var QuestConfirmLayer = cc.Layer.extend({
    can_to_next: false,
    size: null,
    ctor:function () {
        this._super();

        this.size = cc.director.getWinSize();
        this._putTitle();
        this._putFrame();

        this._addButton();
        this._putCharSprite();
        this._putDetail();
    },



    _putTitle: function () {
        var head = new cc.Sprite(res.quest_ttl);
        head.setPosition(this.size.width / 2, this.size.height - 80);
        this.addChild(head);
    },


    _putFrame: function (){
        var frame = new cc.Sprite(res.frame);
        frame.setPosition(this.size.width / 2, this.size.height / 2);
        this.addChild(frame);
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
     * ボタンメニューの表示
     */
    _addButton: function () {
        var button_yes = new cc.MenuItemImage(res.yes, res.yes, this._selectYes, this);
        var button_no = new cc.MenuItemImage(res.no, res.no, this._selectNo, this);
        var button_back = new cc.MenuItemImage(res.back, res.back, this._selectBack, this);
        button_yes.setPosition(240, 96);
        button_no.setPosition(560, 96);
        button_back.setPosition(50, 50);
        button_yes.setName("yes");
        button_no.setName("no");
        button_back.setName("back");
        button_yes.setVisible(false);
        button_no.setVisible(false);

        var menu = new cc.Menu(button_yes, button_no, button_back);
        menu.setPosition(0, 0);
        menu.setName("menu");
        this.addChild(menu);

    },


    /**
     * APIで取得したパーティ情報でレイヤーを更新する
     */
    updateStatus: function (data){
        var label_group;
        var char_sprite_group = this.getChildByName("chars");

        for (var index in data){
            label_group = this.getChildByName("detail_status_" + index);
            this._loadStatus(data[index], label_group);
            char_sprite = char_sprite_group.getChildByName(index);
            this._loadCharImage(data[index], char_sprite);
        }
        this._updateText(Object.keys(data).length);
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
     * 編成されているキャラ数に応じた処理を行う
     */
    _updateText: function (count){
        var text = new cc.LabelTTF("", "Arial", 16);
        text.setAnchorPoint(0, 0);
        text.setPosition(140, 200);
        text.setColor(30,30,30,255);
        if (count === 0){
            text.setString("パーティメンバーがいないためクエストを進行できません。");
        } else if (count === 3) {
            this._enableMenu();
            text.setString("この編成でクエストを進行しますか？");
        } else {
            this._enableMenu();
            text.setString("パーティメンバーが3人に満たないですがこの編成を進行しますか？");
        }
        this.addChild(text);
    },


    /**
     * ボタンを有効化する
     */
    _enableMenu: function () {
        var menu = this.getChildByName("menu");
        var yes = menu.getChildByName("yes");
        var no = menu.getChildByName("no");
        yes.setVisible(true);
        no.setVisible(true);
    },

    /**
     * はいボタンの選択
     */
    _selectYes: function (){
        this.apiJoinQuestBattle();
    },


    /**
     * いいえボタンの選択
     */
    _selectNo: function (){
        var transitionScene = cc.TransitionFade.create(0.5, new MenuScene());
        cc.director.pushScene(transitionScene);
        cc.eventManager.removeAllListeners();
        this.removeAllChildren();
    },


    /**
     * 戻るボタンの選択
     */
    _selectBack: function (){
        var transitionScene = cc.TransitionFade.create(0.5, new MenuScene());
        cc.director.pushScene(transitionScene);
        cc.eventManager.removeAllListeners();
        this.removeAllChildren();
    },


    /**
     * バトル発行APIの送信
     */
    apiJoinQuestBattle: function (){
        $.ajax({
            url:"http://train-yama.nurika.be:8000/v1/quest/",
            type:"POST",
        }).done(this._apiJoinQuestBattleSuccess.bind(this))
        .fail(error.catch);
    },

    _apiJoinQuestBattleSuccess: function (data, textStatus, jqXHR){
        console.log(data);
        var transitionScene = cc.TransitionFade.create(0.5, new BattleScene());
        cc.director.pushScene(transitionScene);
        cc.eventManager.removeAllListeners();
        this.removeAllChildren();
    },
});
