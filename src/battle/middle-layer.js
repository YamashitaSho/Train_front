var BattleMiddleLayer = cc.Layer.extend({
    hp: {
        friend: null,
        enemy: null,
    },
    damage: {
        friend: null,
        enemy: null,
    },
    current_hp: {
        friend: 0,
        enemy: 0
    },
    max_hp: {
        friend: 0,
        enemy: 0
    },
    ctor:function () {
        this._super();
        this._makeSpriteHP();
        this._makeSpriteDamage();
        console.log(this);
    },

    /**
     * キャラのスプライト
     */
    makeSpriteChar : function (data) {
        var chars = new cc.Sprite();
        chars.setName("chars");
        var friends = [];
        var enemies = [];
        var url;
        var key;
        var friend = [
            {
                pos: {x: 500, y:300}
            },
            {
                pos: {x: 620, y:400}
            },
            {
                pos: {x: 610, y:200}
            },
        ];
        var enemy = [
            {
                pos: {x: 300, y:300}
            },
            {
                pos: {x: 180, y:400}
            },
            {
                pos: {x: 200, y:200}
            }
        ];
        for (key in data.friend_position){
            url = "res/char/org/char"+("0" + data.friend_position[key].char_id).slice(-2) + ".png";
            friends[key] = new cc.Sprite(url);
            friends[key].setPosition(friend[key].pos);
            friends[key].setName(key);
            friends[key].scaleX =    0.7;
            friends[key].scaleY = 0.7;
            chars.addChild(friends[key]);
        }
        for (key in data.enemy_position){
            url = "res/enemy/org/char"+("0" + data.enemy_position[key].char_id).slice(-2) + ".png";
            enemies[key] = new cc.Sprite(url);
            enemies[key].setPosition(enemy[key].pos);
            enemies[key].setName(key);
            enemies[key].scaleX = -0.7;
            enemies[key].scaleY = 0.7;
            chars.addChild(enemies[key]);
        }
        this.addChild(chars);
    },


    /**
     * 残HPのスプライト
     */
    _makeSpriteHP: function () {
        this.hp.friend = new cc.Sprite(res.battle_friend_hp);
        this.hp.enemy = new cc.Sprite(res.battle_enemy_hp);
        this.hp.friend.setPosition(720, 120);
        this.hp.enemy.setPosition(80, 120);
        for (var key in this.hp){
            this.hp[key].setName(""+key+"_hp");
            this.hp[key].anchorY = 0;
            this.hp[key].scaleY = 0;
            this.addChild(this.hp[key]);
        }
    },


    /**
     * ダメージ表示のラベル
     */
    _makeSpriteDamage: function () {
        this.damage.friend = new cc.LabelTTF("50", "Arial", 48);
        this.damage.enemy = new cc.LabelTTF("50", "Arial", 48);
        this.damage.friend.setPosition(720, 320);
        this.damage.enemy.setPosition(80, 320);
        this.damage.friend.setColor({r:255, g:0, b:0, a:255});
        this.damage.enemy.setColor({r:0, g:0, b:255, a:255});
        for (var key in this.damage){
            this.damage[key].setName(""+key+"_damage");
           // this.damage[key].setVisible(false);
            this.addChild(this.damage[key]);
        }
    },


    /**
     + デバフ表示のスプライト
     */


    /**
     *
     */


    /**
     * バトルアニメーション
     */
    makeTimeline: function (data) {
        console.log(data);
        this._getTimelineOfBegin()
        .then(function(){
            this._getTimelineOfTurn(data);
        }.bind(this));
    },

    /**
     * 戦闘開始時のアニメーション
     * Deferred対応
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
        var defer = this._loopTimelineOfTurn(data, 0)();
        return $.when(defer);
    },


    /**
     * ターンループ(非同期)
     */
    _loopTimelineOfTurn: function (data, count) {
        return function () {
            console.log("turn count:"+count);
            var defer = $.Deferred();
            if (!(count in data)){
                defer.resolve();
            } else {
                var turn = data[count];
                console.log("open:" +count);
                this._getTimelineOfAction(turn)
                .then(
                    this._loopTimelineOfTurn(data, count+1)
                ).then(function () {
                    console.log("close:" +count);
                    defer.resolve();
                });
            }
            return $.when(defer);
        }.bind(this);
    },

    /**
     * 行動一回ごとの処理
     */
    _getTimelineOfAction: function (turn){
        var defer = $.Deferred();
        if (!!turn.action){
            console.log("action");
            this._loopTimelineOfAct(turn, 0)()
            .then(function () {
                defer.resolve();
            });
        } else {
            defer.resolve();
        }
        return $.when(defer);
    },


    _loopTimelineOfAct: function (turn, count) {
        return function () {
            var defer = $.Deferred();

            if (!(count in turn.action)){
                defer.resolve();
            } else {
                var action = turn.action[count];

                key = this._operateAction(action);
                this._playAction(action, key)
                .then(
                    this._loopTimelineOfAct(turn, count+1)
                ).then(function () {
                    defer.resolve();
                });
            }
            return $.when(defer);
        }.bind(this);
    },


    /**
     * アクションに対して対象を取得する(非同期演算ではない)
     */
    _operateAction: function (action){
        var pos = action.position.charAt(0);
        if (pos === "f"){
            key = "enemy";
        } else if (pos === "e"){
            key = "friend";
        }
        return key;
    },


    /**
     * 味方行動ごとのアニメーションとステータスに対する処理
     */
    _playAction: function (action, key){
        var defer = $.Deferred();

        console.log(key + action.position.slice(-1));
        console.log(this.current_hp[key]);

        this.current_hp[key] -= action.damage;
        if (this.current_hp[key] < 0){
            this.current_hp[key] = 0;
        }
        this.hp[key].runAction(
            cc.sequence(
                cc.scaleTo(1.0, 1.0, this.current_hp[key] / this.max_hp[key]),
                cc.callFunc(defer.resolve)
            )
        );
        return $.when(defer);
    },

});