var BattleParts = {
    friend_hp: function () {
        var hp = new cc.Sprite(res.battle_friend_hp);
        hp.setPosition(720, 80);
        hp.setName("friend_hp");
        hp.anchorY = 0;
        hp.scaleY = 0;
        return hp;
    },


    friend_damage: function () {
        var damage = new cc.LabelTTF("50", "Arial", 48);
        damage.setPosition(720, 320);
        damage.setColor({r:255, g:0, b:0, a:255});
        damage.setName("friend_damage");
        damage.setVisible(false);
        return damage;
    },


    enemy_hp: function () {
        var hp = new cc.Sprite(res.battle_enemy_hp);
        hp.setPosition(80, 80);
        hp.setName("enemy_hp");
        hp.anchorY = 0;
        hp.scaleY = 0;
        return hp;
    },


    enemy_damage: function () {
        var damage = new cc.LabelTTF("50", "Arial", 48);
        damage.setPosition(80, 320);
        damage.setColor({r:0, g:0, b:255, a:255});
        damage.setName("enemy_damage");
        damage.setVisible(false);
        return damage;
    },


    turn: function () {
        var turn = new cc.LabelTTF("Turn 1", "MS Gothic", 72);
        turn.setColor({r:30, g:30, b:30, a:255});
        turn.setName("turn");
        turn.setVisible(false);
        return turn;
    },


    action_char: function (timer, side) {
        return cc.sequence(
            cc.moveBy(0.2 * timer, 20 * side, 0),
            cc.jumpBy(0.3 * timer, 0, 0, 20, 2),
            cc.moveBy(0.2 * timer, -20 * side, 0)
        );
    },


    //Debuf
    action_debuf: function (timer) {
        return cc.sequence(
            cc.delayTime(0.2* timer),
            cc.spawn(
                cc.tintBy(0.4 * timer, -32, -32, 0),
                cc.sequence(
                    cc.moveBy(0.1 * timer, 10, 0),
                    cc.moveBy(0.1 * timer, -10, 0),
                    cc.moveBy(0.1 * timer, 10, 0),
                    cc.moveBy(0.1 * timer, -10, 0)
                )
            )
        );
    },


    //Turn
    action_turn: function (timer) {
        return cc.sequence(
            cc.moveTo(0, 900, 400),
            cc.show(),
            cc.moveBy(0.5 * timer, -300, 0),
            cc.moveBy(1.5 * timer, -300, 0),
            cc.moveBy(0.5 * timer, -400, 0),
            cc.hide()
        );
    },
};