var size;
var aaa;
var lavel;
var hello;
var scene;
var sequence;
var frame = 0;

var Game = cc.Layer.extend({
    ctor:function () {
        this._super();

        // メニューの生成
        this.createMenu();

        size = cc.director.getWinSize();

        aaa = new cc.Sprite(res.aaa_png);
        aaa.setPosition(size.width / 1.2, size.height / 2);
        aaa.setScale(0.8);
        // アニメーションしながら登場させる
        // 0.01秒で４倍の大きさにする（１）
        var scaleTo = cc.scaleTo(0.01, 4.0, 4.0);

        // 0.3秒で360度回転させる（２）
        var rotateBy = cc.rotateBy(0.3, 360);

        // 0.3秒で元の大きさにする（３）
        var scaleTo2 = cc.scaleTo(0.3, 1.0, 1.0);

        // (2)と(3)を同時に実行する(4)
        var spawn = cc.spawn(rotateBy,scaleTo2);

        // (1)→(4)の順番で実行する
        sequence = cc.sequence(scaleTo,spawn);


        label = new cc.LabelTTF.create("Hello appScene", "Arial", 40);
        label.setPosition(size.width / 2, size.height / 2);
        this.addChild(label, 1);

        hello = new cc.Sprite(res.hello_png);
        hello.setPosition(100,300);
        hello.setScale(0.3);
        this.addChild(hello, 2);

        this.scheduleUpdate();

        cc.eventManager.addListener({
            event:cc.EventListener.TOUCH_ONE_BY_ONE,
            swallowTouches:true,
            onTouchBegan:this.onTouchBegan,
            onTouchMoved:this.onTouchMoved,
            onTouchEnded:this.onTouchEnded
        }, this);

        scene = this;

    },
    update:function(){
        frame++;
        //label.setString("frame:" + frame + "");
    },

    /**
     *  メニュー生成メソッド
     */
    createMenu: function () {
        var menuButton = [];
        _(["onMenu1", "onMenu2", "onMenu2"]).forEach(function(val, count) {
            console.log(count);
            var tmpButton = cc.MenuItemImage.create(
                res.menu_button, // ON 時の画像を指定
                res.menu_button, // 押下時の画像を指定
                this[val], this); // メニュー選択時のイベントを指定
            tmpButton.setTag(val); // タグを指定 - 選択時の識別子となる
            var menuSize = tmpButton.getContentSize();
            tmpButton.setPosition(menuSize.width/2, ((menuSize.height/2)*-1)+((menuSize.height*count)*-1));
            menuButton.push(tmpButton);
        }.bind(this));

        var gameWin = cc.director.getWinSize();
        var menu = cc.Menu.create(menuButton);
        menu.setPosition(0, gameWin.height);
        this.addChild(menu, 1);
    },

    /**
     *  メニュー選択時イベント
     *  @param {object} sender イベントを発火したメニューオブジェクト
     */
    onMenu1: function (sender) {
        console.log(sender.getTag());
        // Scene2 へ遷移
        var className = sender.getTag();
        var transitionScene = cc.TransitionFade.create(2.0, new Scene2());
        cc.director.pushScene(transitionScene);
        // イベント全削除
        cc.eventManager.removeAllListeners();            
        // オブジェクト全解除
        this.removeAllChildren();
    },

    /**
     *  メニュー選択時イベント
     *  @param {object} sender イベントを発火したメニューオブジェクト
     */
    onMenu2: function (sender) {
        console.log(sender.getTag());
        // Scene2 へ遷移
        var className = sender.getTag();
        var transitionScene = cc.TransitionFade.create(2.0, new Scene3());
        cc.director.pushScene(transitionScene);
        // イベント全削除
        cc.eventManager.removeAllListeners();            
        // オブジェクト全解除
        this.removeAllChildren();
    },

    onTouchBegan:function (touch, event) {
        console.log("auau");
        /*aaa = new cc.Sprite(res.aaa_png);*/
        aaa.setPosition(size.width / 3, size.height / 2);
        aaa.setScale(0.8);
        if (aaaa = scene.getChildByTag(2)){
            aaaa.runAction(sequence);
        } else {
            scene.addChild(aaa, 0, 2);
        }
        //scene.addChild(aaa, 0);
        console.log(scene.getChildren());
        return true;
    }
});

var appScene = cc.Scene.extend({
    onEnter:function () {
        this._super();
        var layer = new Game();
        this.addChild(layer);
    },
    onExit:function () {
        console.log("appSene onExit()");
    }
});
