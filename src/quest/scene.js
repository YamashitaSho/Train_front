var size;
var aaa;
var lavel;
var hello;
var scene;
var sequence;
var frame = 0;

var QuestScene = cc.Scene.extend({
    onEnter:function () {
        this._super();
        var layer = new QuestLayer();
        this.addChild(layer);
    },
    onExit:function () {
        console.log("QuestScene onExit()");
    },

    /**
     * バトル結果取得APIの送信
     */
    apiJoinQuestBattle: function (){
        $.ajax({
            url:"http://homestead.app:8000/v1/quest/",
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
