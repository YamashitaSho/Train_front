var QuestScene = cc.Scene.extend({
    layer: null,
    onEnter:function () {
        this._super();
        var backgroundLayer = new cc.LayerColor(cc.color(170, 255, 255, 255));
        this.layer = new QuestConfirmLayer();
        this.addChild(backgroundLayer, 0);
        this.addChild(this.layer);
        this.apiGetMyParty();
    },
    onExit:function () {
        console.log("QuestScene onExit()");
    },


    apiGetMyParty: function () {
        $.ajax({
            url:"http://homestead.app:8000/v1/quest/",
            type:"GET",
        }).done(function(data){
            console.log(data);
            this.layer.updateStatus(data);
        }.bind(this)).fail(function(data){
            console.log(data);
        });
    },

});
