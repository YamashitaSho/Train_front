var size;
var aaa;
var lavel;
var hello;
var scene;
var sequence;
var frame = 0;

var Layer3 = cc.Layer.extend({
    ctor:function () {
        this._super();

        label = new cc.LabelTTF.create("Hello Scene 3", "Arial", 40);
        label.setPosition(size.width / 2, size.height / 2);
        this.addChild(label, 1);

        cc.eventManager.addListener({
            event:cc.EventListener.MOUSE,
            onMouseUp: function(evt) {
                var transitionScene = cc.TransitionFade.create(2.0, new appScene());
                cc.director.pushScene(transitionScene);
                // 追加済みのイベントを削除
                cc.eventManager.removeAllListeners();
            },
        }, this);
    },
});

var Scene3 = cc.Scene.extend({
    onEnter:function () {
        this._super();
        var layer = new Layer3();
        this.addChild(layer);
    },
    onExit:function () {
        console.log("Scene3 onExit()");
    }
});
