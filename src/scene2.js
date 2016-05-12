var size;
var aaa;
var lavel;
var hello;
var scene;
var sequence;
var data;
var frame = 0;

var Layer2 = cc.Layer.extend({
    ctor:function () {
        this._super();

        label = new cc.LabelTTF.create("Hello Scene 2", "Arial", 40);
        label.setPosition(size.width / 2, size.height / 2);
        this.addChild(label, 1);

        $.ajax({
            url:"http://homestead.app:8000/v1/gacha/",
            //data:data,
            type:"POST",
        }).done(function(data){
            console.log("success!");
            console.log(data.money);
            _.forEach(data.party,function(party,count){
          //      if (party.char_xx != null){
                    console.log(party.char_xx || 'hoge'+count);
            //    }
            });
            console.log(data);
        }).fail(function(data){
            console.log("failed...");
            console.log(data);
        });

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

var Scene2 = cc.Scene.extend({
    onEnter:function () {
        this._super();
        var layer = new Layer2();
        this.addChild(layer);
    },
    onExit:function () {
        console.log("Scene2 onExit()");
    }
});
