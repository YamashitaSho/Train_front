var size;
var aaa;
var lavel;
var hello;
var scene;
var sequence;
var frame = 0;

var Game = cc.Layer.extend({
    init:function () {
        this._super();

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


        label = new cc.LabelTTF.create("Hello World", "Arial", 40);
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
        label.setString("frame:" + frame + "");
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

var MyScene = cc.Scene.extend({
    onEnter:function () {
        this._super();
        var layer = new Game();
        layer.init();
        this.addChild(layer);
    }
});