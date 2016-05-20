var GachaDrawLayer = cc.Layer.extend({
    size: null,
    can_skip: false,
    is_drawing: false,
    is_end: false,
    status: null,
    spotlight: null,

    ctor:function () {
        this._super();

        this.size = cc.director.getWinSize();
        this._addBGSprite();
        this._addDetail();
        this._addChar();
    },


    _addBGSprite: function () {
        var rect = new cc.Rect(0, 0, this.size.width, this.size.height);
        var background = new　cc.Sprite.create();
        background.setTextureRect(rect);
        background.setPosition(this.size.width / 2, this.size.height /2);
        background.setColor({r:0, g:0, b:0});
        background.setOpacity(192);
        this.addChild(background);

        this.spotlight = new cc.Sprite(res.gacha_spot);
        this.spotlight.setPosition(this.size.width / 2, 400);
        this.addChild(this.spotlight);
    },


    /**
     * アニメーションするキャラのスプライトを作成
     */
    _addChar: function () {
        var char = new cc.Sprite();
        char.setName("char_sprite");
        this.addChild(char);
    },


    /**
     * 詳細ラベルの生成
     */
    _addDetail: function () {
        var detail = [
        {
            name: "detail_chartitle",
            category: false
        },
        {
            name: "detail_char",
            category: true
        },
        ];
        var detail_object = [];
        _(detail).forEach(function (val, count) {
            detail_object[count] = new cc.LabelTTF("", "Arial", 32);
            detail_object[count].setName(val.name);
            detail_object[count].setPosition(0,0);
            if (val.category === true){
                this._addDetailLabel(detail_object[count]);
            } else {
                this._addDetailTitle(detail_object[count]);
            }
            this.addChild(detail_object[count]);
        }.bind(this));
    },


    /**
     * 取得キャラステータス表示の項目名を設定
     */
    _addDetailTitle: function (detail) {
        var title = [
        {
            name: "name",
            title: "なまえ:",
            pos: {x: 500, y: 400}
        },
        {
            name: "attack",
            title: "こうげき:",
            pos: {x: 500, y: 320}
        },
        {
            name: "endurance",
            title: "たいりょく:",
            pos: {x: 500, y: 280}
        },
        {
            name: "agility",
            title: "すばやさ:",
            pos: {x: 500, y: 240}
        },
        {
            name: "debuf",
            title: "いあつ:",
            pos: {x: 500, y: 200}
        },
        ];

        var create = [];
        _(title).forEach( function (val, count) {
            create[count] = new cc.LabelTTF(val.title, "Arial", 24);
            create[count].setPosition(val.pos);
            create[count].setName(val.name);
            create[count].setVisible(false);
            create[count].color = {r:230, g:230, b:230, a:255};
            detail.addChild(create[count]);
        });
    },


    /**
     * 取得キャラステータス表示の項目を設定
     */
    _addDetailLabel: function (detail) {
        var label = [
        {
            name: "name",
            title: "うし",
            pos: {x: 640, y: 400}
        },
        {
            name: "attack",
            title: "00",
            pos: {x: 640, y: 320}
        },
        {
            name: "endurance",
            title: "00",
            pos: {x: 640, y: 280}
        },
        {
            name: "agility",
            title: "00",
            pos: {x: 640, y: 240}
        },
        {
            name: "debuf",
            title: "00",
            pos: {x: 640, y: 200}
        },
        ];

        var create = [];
        _(label).forEach( function (val, count) {
            create[count] = new cc.LabelTTF(val.title, "Arial", 32);
            create[count].setPosition(val.pos);
            create[count].setName(val.name);
            create[count].setVisible(false);
            create[count].color = {r:230, g:230, b:230, a:255};
            detail.addChild(create[count]);
        });
    },


    /**
     * ガチャアニメの画面の初期化を行う
     */
    setGacha: function () {
        var list = ["name","attack", "endurance", "agility", "debuf"];
        var target = this.getChildByName("char_sprite");
        target.setVisible(false);
        target.setPosition(this.size.width / 2, this.size.height + 300);

        var label = this.getChildByName("detail_chartitle");
        var title = this.getChildByName("detail_char");
        _(list).forEach( function (val, count) {
            target = label.getChildByName(val);
            target.setVisible(false);
            target = title.getChildByName(val);
            target.setVisible(false);
        });

        this.spotlight.setVisible(false);
        this.setVisible(true);
    },


    animeBegin: function (data) {
        console.log(data);
        this.status = data;

        var char = this.getChildByName("char_sprite");
        this._setCharImage(char, data.char_id);
        this._runAnimation(char, data);
        this.can_skip = true;
    },


    /**
     * スプライトに取得キャラのアニメーション初期状態を設定する
     */
    _setCharImage: function (sprite, char_id) {
        var url = "res/char/org/char"+("0"+char_id).slice(-2)+".png";
        sprite.setTexture(url);
        sprite.setVisible(true);
    },


    /**
     * 入手時のアニメーションを設定
     */
    _runAnimation: function (sprite, data) {
        var close_up_time = 1.2;
        var enter = cc.sequence(
            cc.moveBy(0.8, 100, -600),
            cc.jumpBy(0.3, 30, 0, 60, 1),
            cc.jumpBy(0.3, 20, 0, 40, 1),
            cc.jumpBy(0.3, 10, 0, 20, 1),
            cc.jumpBy(1.2, 12, 0, 0, 1)
        );
        var close_up = cc.sequence(
            cc.moveTo(close_up_time * 0.5, this.size.width / 2, this.size.height / 2),
            cc.callFunc(this._onSpotLight, this),
            cc.spawn(
                cc.sequence(
                    cc.scaleTo(close_up_time * 0.3, 1.5, 1.5),
                    cc.scaleTo(close_up_time * 0.3, 1, 1)
                ),
                cc.sequence(
                    cc.skewTo(close_up_time * 0.15, 10, 0),
                    cc.skewTo(close_up_time * 0.3, -10, 0),
                    cc.skewTo(close_up_time * 0.15, 0, 0)
                )
            ),
            cc.delayTime(close_up_time * 0.5),
            cc.callFunc(this._offSpotLight, this)
        );
        var exit = cc.sequence(
            cc.moveTo(0.8, 270, 300),
            cc.callFunc(this._setStatus, this, data),
            cc.delayTime(0.5),
            cc.callFunc(this._endAnime, this)
        );
        var move = cc.sequence(enter, close_up, exit);
        sprite.runAction(move);
    },


    /**
     * 演出スキップ時の処理
     */
    _animeSkip: function () {
        this.can_skip = false;
        var char = this.getChildByName("char_sprite");
        if (char){
            char.stopAllActions();
            this.spotlight.setVisible(false);
            var exit = cc.sequence(
                cc.spawn(
                    cc.skewTo(0.2, 0, 0),
                    cc.scaleTo(0.2, 1, 1),
                    cc.moveTo(0.2, 270, 300)
                ),
                cc.callFunc(this._setStatus, this, this.status),
                cc.delayTime(0.5),
                cc.callFunc(this._endAnime, this)
            );
            char.runAction(exit);
        }
    },


    /**
     * アニメーション処理の終了(スキップ停止)
     */
    _endAnime: function () {
        this.can_skip = false;
        this.is_end = true;
    },


    /**
     * スポットライトのオンオフを切り替える
     */
    _onSpotLight: function () {
        this.spotlight.setVisible(true);
    },

    _offSpotLight: function () {
        this.spotlight.setVisible(false);
    },


    /**
     * 取得したキャラのステータスをラベルに設定する
     * 設定先は引数で指定する ( "detail_char" or "detail_partychar" )
     */
    _setStatus: function (sender, data) {
        var format = this._formatDetailChar(data);
        this._setVisibleDetailTitle(format);
        this._setDetailLabel(format);
    },


    _setVisibleDetailTitle: function (format) {
        var label_group = this.getChildByName("detail_chartitle");
        for ( var key in format){
            target = label_group.getChildByName(key);
            target.setVisible(true);
        }
    },


    _setDetailLabel: function (format) {
        var label_group = this.getChildByName("detail_char");
        var target;
        for (var key in format){
            target = label_group.getChildByName(key);
            target.setString(format[key]);
            target.setVisible(true);
        }
    },


    /**
     * ステータスをラベルに設定しやすいよう整形する
     */
    _formatDetailChar: function (detail) {
        var format = {
        name: "----",
        attack: "--",
        endurance: "--",
        agility: "--",
        debuf: "--"
        };
        if (detail){
            format.name = detail.name;
            for (var key in detail.status){
                format[key] = detail.status[key];
            }
        }
        return format;
    },


    onClick: function () {
        if (this.is_drawing === false){
            return ;
        }

        if (this.can_skip === true){
            this._animeSkip();
        }

        if (this.is_end === true){
            this.drawEnd();
        }

    },


    /**
     * ガチャ実行処理終わり
     */
    drawEnd: function () {
        this.is_drawing = false;
        this.setVisible(false);
    },
});
