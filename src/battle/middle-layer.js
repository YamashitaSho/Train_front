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
            friends[key].scaleX = 0.7;
            friends[key].scaleY = 0.7;
            chars.addChild(friends[key]);
        }
        for (key in data.enemy_position){
            url = "res/enemy/org/char"+("0" + data.enemy_position[key].char_id).slice(-2) + ".png";
            enemies[key] = new cc.Sprite(url);
            enemies[key].setPosition(enemy[key].pos);
            plus = 0 + Number(key) + 1;
            enemies[key].setName("enemy"+ plus);
            enemies[key].scaleX = - 0.7;    //敵キャラは左右反転
            enemies[key].scaleY =   0.7;
            chars.addChild(enemies[key]);
        }
        this.addChild(chars);
    },


    /**
     * 残HPのスプライトを作成
     * 基準点は中央下
     */
    _makeSpriteHP: function () {
        this.hp.friend = BattleParts.friend_hp();
        this.hp.enemy = BattleParts.enemy_hp();
        this.addChild(this.hp.friend);
        this.addChild(this.hp.enemy);
    },


    /**
     * ダメージ表示のラベルを作成
     */
    _makeSpriteDamage: function () {
        this.damage.friend = BattleParts.friend_damage();
        this.damage.enemy = BattleParts.enemy_damage();
        this.addChild(this.damage.friend);
        this.addChild(this.damage.enemy);
    },


    /**
     * ターン数表示のラベルを作成
     */
    _makeLabelTurn: function () {
        this.turn = BattleParts.turn();
        this.addChild(this.turn);
    },


    /**
     * バトルアニメーション全体の処理
     * @param object バトルログ
     */
    makeTimeline: function (data) {
        //戦闘開始時のアニメーション
        this._getTimelineOfBegin()
        //戦闘中
        .then(function(){
            return this._getTimelineOfTurn(data);
        }.bind(this))
        //戦闘終了
        .then(function(){
            return this._switchResultButton();
        }.bind(this));
    },


    /**
     * 戦闘開始時のアニメーション
     */
    _getTimelineOfBegin: function () {
        //味方のHPバーアクションのdefer
        var friend = $.Deferred();
        //敵のHPバーアクションのdefer
        var enemy = $.Deferred();
        //アクション実行
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
        //両方とも終わったらpromiseを返す
        return $.when(friend, enemy);
    },


    /**
     * ターンごとのアニメーションユニット
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
                .then(defer.resolve);                           //ターンを片付ける
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
     * [Deferred]攻撃するキャラをアニメーションさせる
     */
    _animeChar: function (subject, side){
        var defer = $.Deferred();
        var chars = this.getChildByName("chars");
        var char = chars.getChildByName(subject);
        char.runAction(
            cc.sequence(
                BattleParts.action_char(side),
                cc.callFunc(defer.resolve)
            )
        );
        return $.when(defer);
    },


    /**
     * [Deferred]与えた/受けたダメージを表示する
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
     * [No Deferred]デバフ演出を行う
     */
    _debufEffect: function (target, debuf){
        var chars = this.getChildByName("chars");
        var char;
        for (var i = 1; i < 4; i++){
            char = chars.getChildByName(target+i);
            if (char && debuf[i-1]){
                char.runAction(BattleParts.action_debuf());
            }
        }
    },


    /**
     * [Deferred]ターン数表示
     */
    _turnEffect: function (count){
        return function () {
            var defer = $.Deferred();
            this.turn.setString("Turn "+count);
            this.turn.runAction(
                cc.sequence(
                    BattleParts.action_turn(),
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
        console.log("a");
        console.log(this.button_defer);
        var menu = this.getChildByName("menu");
        var next = menu.getChildByName("next");
        menu.setVisible(true);
        next.setVisible(true);
        return $.when(this.button_defer);
    },


    /**
     * 次へ ボタンが押された
     */
    _selectNext: function (sender){
        sender.setVisible(false);
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
        var transitionScene = cc.TransitionFade.create(0.5, new ResultScene());
        cc.director.pushScene(transitionScene);
        cc.eventManager.removeAllListeners();
        this.removeAllChildren();
    },
});