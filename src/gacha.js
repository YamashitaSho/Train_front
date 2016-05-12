var size;
var aaa;
var lavel;
var hello;
var scene;
var sequence;
var frame = 0;

var GachaLayer = cc.Layer.extend({
    ctor:function () {
        this._super();

        label = new cc.LabelTTF.create("Hello Gacha", "Arial", 40);
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
     * ガチャ情報取得APIの送信
     */
    apiCheckGacha: function (){
        $.ajax({
            url:"http://homestead.app:8000/v1/gacha",
            type:"GET",
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


    /**
     * ガチャ実行APIの送信
     */
    apiDrawGacha: function (){
        $.ajax({
            url:"http://homestead.app:8000/v1/gacha",
            type:"POST",
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

var GachaScene = cc.Scene.extend({
    onEnter:function () {
        this._super();
        var layer = new GachaLayer();
        this.addChild(layer);
    },
    onExit:function () {
        console.log("GachaScene onExit()");
    }
});
