var BattleMiddleLayer = cc.Layer.extend({

    hp: {
        friend: null,
        enemy: null,
    },

    damage: {
        friend: 0,
        enemy: 0
    },

    current_hp: {
        friend: 0,
        enemy: 0
    },

    max_hp: {
        friend: 0,
        enemy: 0
    },

    turn: null,
    button_defer: null,

    ctor:function () {
        this._super();
        this._makeSpriteHP();
        this._makeSpriteDamage();
        this._makeLabelTurn();
        this._addButton();
        console.log(this);
    },


    /**
     * ボタンメニューの表示
     */
    _addButton: function () {
        var button_next = new cc.MenuItemImage(res.battle_next, res.battle_next, this._selectNext, this);
        button_next.setPosition(0, 0);
        button_next.setName("next");

        var button_result = new cc.MenuItemImage(res.battle_next, res.battle_next, this._selectResult, this);
        button_result.setPosition(0, 0);
        button_result.setName("result");
        button_result.setVisible(false);


        var menu = new cc.Menu(button_next, button_result);
        menu.setPosition(400, 96);
        menu.setName("menu");
        menu.setVisible(false);
        this.addChild(menu);
    },


    /**
     * キャラのスプライトを作成
     */
    makeSpriteChar : function (data) {
        var chars = new cc.Sprite();
        chars.setName("chars");
        var friends = [];
        var enemies = [];
        var url;
        var key;
        var plus;
        var friend = [
            {
                pos: {x: 500, y:240}
            },
            {
                pos: {x: 620, y:320}
            },
            {
                pos: {x: 610, y:120}
            },
        ];
        var enemy = [
            {
                pos: {x: 300, y:250}
            },
            {
                pos: {x: 180, y:300}
            },
            {
                pos: {x: 200, y:120}
            }
        ];
        for (key in data.friend_position){
            url = "res/char/org/char"+("0" + data.friend_position[key].char_id).slice(-2) + ".png";
            friends[key] = new cc.Sprite(url);
            friends[key].setPosition(friend[key].pos);
            plus = Number(key) + 1;
            friends[key].setName("friend"+plus);
            friends[key].scaleX =    0.7;
            friends[key].scaleY = 0.7;
            chars.addChild(friends[key]);
        }
        for (key in data.enemy_position){
            url = "res/enemy/org/char"+("0" + data.enemy_position[key].char_id).slice(-2) + ".png";
            enemies[key] = new cc.Sprite(url);
            enemies[key].setPosition(enemy[key].pos);
            plus = 0 + Number(key) + 1;
            enemies[key].setName("enemy"+ plus);
            enemies[key].scaleX = -0.7;
            enemies[key].scaleY = 0.7;
            chars.addChild(enemies[key]);
        }
        this.addChild(chars);
    },


    /**
     * 残HPのスプライトを作成
     * 基準点は中央下
     */
    _makeSpriteHP: function () {
        this.hp.friend = new cc.Sprite(res.battle_friend_hp);
        this.hp.enemy = new cc.Sprite(res.battle_enemy_hp);
        this.hp.friend.setPosition(720, 80);
        this.hp.enemy.setPosition(80, 80);
        for (var key in this.hp){
            this.hp[key].setName(""+key+"_hp");
            this.hp[key].anchorY = 0;
            this.hp[key].scaleY = 0;
            this.addChild(this.hp[key]);
        }
    },


    /**
     * ダメージ表示のラベルを作成
     */
    _makeSpriteDamage: function () {
        this.damage.friend = new cc.LabelTTF("50", "Arial", 48);
        this.damage.enemy = new cc.LabelTTF("50", "Arial", 48);
        this.damage.friend.setPosition(720, 320);
        this.damage.enemy.setPosition(80, 320);
        this.damage.friend.setColor({r:255, g:0, b:0, a:255});
        this.damage.enemy.setColor({r:0, g:0, b:255, a:255});
        for (var key in this.damage){
            this.damage[key].setName(""+(key)+"_damage");
            this.damage[key].setVisible(false);
            this.addChild(this.damage[key]);
        }
    },


    /**
     *
     */
    _makeLabelTurn: function () {
        this.turn = new cc.LabelTTF("Turn 1", "MS Gothic", 72);
        this.turn.setColor({r:30, g:30, b:30, a:255});
        this.turn.setName("turn");
        this.turn.setVisible(false);
        this.addChild(this.turn);
    },


    /**
     * バトルアニメーション
     */
    makeTimeline: function (data) {
        console.log(data);
        this._getTimelineOfBegin()
        .then(function(){
            return this._getTimelineOfTurn(data);
        }.bind(this))
        .then(function(){
            return this._switchResultButton();
        }.bind(this));
    },


    /**
     * 戦闘開始時のアニメーション
     */
    _getTimelineOfBegin: function () {
        var friend = $.Deferred();
        var enemy = $.Deferred();
        this.hp.friend.runAction(
            cc.sequence(
                cc.scaleTo(0.8, 1.0, 1.0),
                cc.callFunc(friend.resolve)
            )
        );
        this.hp.enemy.runAction(
            cc.sequence(
                cc.scaleTo(0.8, 1.0, 1.0),
                cc.callFunc(enemy.resolve)
            )
        );
        return $.when(friend, enemy);
    },


    /**
     * ターンごとのアニメーションユニット
     * Deferred対応
     */
    _getTimelineOfTurn: function (data){
        this.max_hp = {
            friend: data[0].friend_hp,
            enemy: data[0].enemy_hp
        };
        this.current_hp = {
            friend: this.max_hp.friend,
            enemy : this.max_hp.enemy
        };
        return $.when(
            this._loopTimelineOfTurn(data, 0)()
        );
    },


    /**
     * ターン処理(再帰ループ)
     */
    _loopTimelineOfTurn: function (data, count) {
        return function () {
            console.log("turn count:"+count);
            var defer = $.Deferred();
            if (!(count in data)){
                defer.resolve();
            } else {
                var turn = data[count];

                this._getTimelineOfAction(turn, count)()         //このターンの行動
                .then(this._loopTimelineOfTurn(data, count+1))  //次のターンに進む
                .then(defer.resolve);                   //ターンを片付ける
            }
            return $.when(defer);
        }.bind(this);
    },


    /**
     *
     */
    _getTimelineOfAction: function (turn, count){
        return function () {
            var defer;
            if (!!turn.action){
                defer = this._waitNextButton()              //ボタンを押させる
                .done(
                    this._loopTimelineOfAct(turn, 0),
                    this._turnEffect(count));    //行動ループを回す
            } else {
                defer = $.Deferred();
                defer.resolve();
            }
            return $.when(defer);
        }.bind(this);
    },


    /**
     * キャラ行動処理(再帰処理)
     * @return function()
     */
    _loopTimelineOfAct: function (turn, count) {
        return function () {
            var defer = $.Deferred();

            if (!(count in turn.action)){
                defer.resolve();
            } else {
                var action = turn.action[count];
                var member = this._getAction(action);
                this._playAction(action, member)
                .then(this._loopTimelineOfAct(turn, count+1))
                .then(defer.resolve);
            }

            return $.when(defer);
        }.bind(this);
    },


    /**
     * アクションに対して主体と対象を取得する(非同期演算ではない)
     */
    _getAction: function (action){
        var res = {
            subject: "",
            target: "",
            side: 1,
        };
        var pos = action.position.charAt(0);
        if (pos === "f"){
            res.subject = action.position;
            res.target = "enemy";
            res.side = -1;
        } else if (pos === "e"){
            res.subject = action.position;
            res.target = "friend";
            res.side = 1;
        }
        return res;
    },


    /**
     * 味方行動ごとのアニメーションとステータスに対する処理
     */
    _playAction: function (action, member){

        console.log(member.target + action.position.slice(-1));
        console.log(this.current_hp[member.target]);

        this.current_hp[member.target] -= action.damage;
        if (this.current_hp[member.target] < 0){
            this.current_hp[member.target] = 0;
        }
        return $.when(
            this._animeHP(member.target),
            this._animeChar(member.subject, member.side),
            this._damageEffect(member.target, action.damage),
            this._debufEffect(member.target, action.debuf)
        );
    },


    /**
     * HPバーを減少するアニメーションをさせる
     */
    _animeHP: function (target){
        var defer = $.Deferred();
        this.hp[target].runAction(
            cc.sequence(
                cc.delayTime(0.2),
                cc.scaleTo(0.4, 1.0, this.current_hp[target] / this.max_hp[target]),
                cc.callFunc(defer.resolve)
            )
        );
        return $.when(defer);
    },


    /**
     * 攻撃するキャラをアニメーションさせる
     */
    _animeChar: function (subject, side){
        var defer = $.Deferred();
        var chars = this.getChildByName("chars");
        var char = chars.getChildByName(subject);
        char.runAction(
            cc.sequence(
                cc.moveBy(0.2, 20 * side, 0),     //前に出す
                cc.jumpBy(0.3, 0, 0, 20, 2),      //ジャンプする
                cc.moveBy(0.2, -20 * side, 0),    //元の位置に戻る
                cc.callFunc(defer.resolve)
            )
        );
        return $.when(defer);
    },


    /**
     * 与えた/受けたダメージを表示する
     */
    _damageEffect: function (target, damage){
        var defer = $.Deferred();
        var label = this.getChildByName(target+"_damage");

        label.setString(damage);
        label.runAction(
            cc.sequence(
                cc.delayTime(0.2),
                cc.callFunc(function(target){
                    target.setVisible(true);
                }, this, label),
                cc.moveBy(0.2, 0, 20, 0),
                cc.moveBy(0.2, 0, -20, 0),
                cc.delayTime(0.3),
                cc.callFunc(function(target){
                    target.setVisible(false);
                }, this, label),
                cc.callFunc(defer.resolve)
            )
        );
        return $.when(defer);
    },


    /**
     * デバフ演出を行う
     */
    _debufEffect: function (target, debuf){
        var chars = this.getChildByName("chars");
        var char;
        var actions = [];
        for (var i = 1; i < 4; i++){
            char = chars.getChildByName(target+i);
            if (char && debuf[i-1]){
                char.runAction(
                    cc.sequence(
                        cc.delayTime(0.2),
                        cc.spawn(
                            cc.tintBy(0.4, -32, -32, 0),
                            cc.sequence(
                                cc.moveBy(0.1, 10, 0),
                                cc.moveBy(0.1, -10, 0),
                                cc.moveBy(0.1, 10, 0),
                                cc.moveBy(0.1, -10, 0)
                            )
                        )
                    )
                );
            }
        }
    },


    /**
     * ターン数表示
     */
    _turnEffect: function (count){
        return function () {
            console.log(this);
            var defer = $.Deferred();
            this.turn.setString("Turn "+count);
            this.turn.runAction(
                cc.sequence(
                    cc.moveTo(0, 900, 400),
                    cc.show(),
                    cc.moveBy(0.5, -300, 0),
                    cc.moveBy(1.5, -300, 0),
                    cc.moveBy(0.5, -400, 0),
                    cc.hide(),
                    cc.callFunc(defer.resolve)
                )
            );
            return $.when(defer);
        }.bind(this);
    },


    /**
     * 次へ ボタン入力待ち
     */
    _waitNextButton: function (){
        this.button_defer = null;
        this.button_defer = $.Deferred();
        var menu = this.getChildByName("menu");
        menu.setVisible(true);
        return $.when(this.button_defer);
    },


    /**
     * 次へ ボタンが押された
     */
    _selectNext: function (){
        var menu = this.getChildByName("menu");
        menu.setVisible(false);
        this.button_defer.resolve();
    },


    /**
     * 結果表示 ボタン表示
     */
    _switchResultButton: function (){
        var menu = this.getChildByName("menu");
        var next = menu.getChildByName("next");
        var result = menu.getChildByName("result");
        next.setVisible(false);
        result.setVisible(true);
        menu.setVisible(true);
    },

    /**
     * 結果表示 ボタンが押された
     */
    _selectResult: function (){
        console.log("go to result");
    },
});