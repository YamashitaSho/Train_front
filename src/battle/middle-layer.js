var BattleMiddleLayer = cc.Layer.extend({
    ctor:function () {
        this._super();


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
                pos: {x: 650, y:400}
            },
            {
                pos: {x: 640, y:200}
            },
        ];
        var enemy = [
            {
                pos: {x: 300, y:300}
            },
            {
                pos: {x: 160, y:400}
            },
            {
                pos: {x: 150, y:200}
            }
        ];
        for (key in data.friend_position){
            url = "res/char/org/char"+("0" + data.friend_position[key].char_id).slice(-2) + ".png";
            friends[key] = new cc.Sprite(url);
            friends[key].setPosition(friend[key].pos);
            friends[key].setName(key);
            friends[key].scaleX = 0.7;
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


    /**
     * ダメージ表示のスプライト
     */


    /**
     + デバフ表示のスプライト
     */


    /**
     *
     */


    /**
     * アニメーションのタイムラインオブジェクトを作成
     * アニメーションユニットをメソッドとして作成しておき、それをcc.callFuncで呼ぶ
     */
    makeTimeline: function (data) {
        console.log(data);
        var timeline = cc.sequence(
            cc.callFunc(this._getTimelineOfBegin, this),
            cc.callFunc(this._getTimelineOfTurn, this, data)
        );
        this.runAction(timeline);
    },

    /**
     * 戦闘開始時のアニメーション
     */
    _getTimelineOfBegin: function () {},


    /**
     * ターンごとのアニメーションユニット
     */
    _getTimelineOfTurn: function (sender, data){
        var friend_hp_max = data[0].friend_hp;
        var enemy_hp_max = data[0].enemy_hp;

        var friend_hp;
        var enemy_hp;

        _(data).forEach( function (turn, count) {
            friend_hp = turn.friend_hp;
            enemy_hp = turn.enemy_hp;
            console.log(turn);
            if (!!turn.action){
                _(turn.action).forEach(function (action, count) {
                    this._getTimelineOfAction(action);
                }.bind(this));
            }
        }.bind(this));
    },


    /**
     * アクションごとのアニメーションユニット
     */
    _getTimelineOfAction: function (action){
        console.log(action);
    }
});