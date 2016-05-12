var size;
var aaa;
var lavel;
var hello;
var scene;
var sequence;
var frame = 0;

var ResultLayer = cc.Layer.extend({
    ctor:function () {
        this._super();

        label = new cc.LabelTTF.create("Hello Scene 3", "Arial", 40);
        label.setPosition(size.width / 2, size.height / 2);
        this.addChild(label, 1);

        cc.eventManager.addListener({
            event:cc.EventListener.MOUSE,
            onMouseUp: function(evt) {
                var transitionScene = cc.TransitionFade.create(2.0, new MenuScene());
                cc.director.pushScene(transitionScene);
                // 追加済みのイベントを削除
                cc.eventManager.removeAllListeners();
            },
        }, this);
    },


    /**
     * バトル結果取得APIの送信
     */
    apiGetResult: function (){
        $.ajax({
            url:"http://homestead.app:8000/v1/battle/result/0",
            type:"PUT",
        }).done(function(data){
            console.log("success!");
            /*if (data.money != null){
                label_money.setString("money:"+data.money);
            }
            console.log(data.money);
            _.forEach(data.party,function(party,count){
                console.log(party.char_id || 'hoge'+count);
            });*/
            console.log(data);
        }).fail(function(data){
            console.log("failed...");
            console.log(data);
        });
    },
});

var ResultScene = cc.Scene.extend({
    onEnter:function () {
        this._super();
        var layer = new ResultLayer();
        this.addChild(layer);
    },
    onExit:function () {
        console.log("ResultScene onExit()");
    }
});
