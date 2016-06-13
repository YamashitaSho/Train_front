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
            url:"http://train-yama.nurika.be:8000/v1/quest/",
            type:"GET",
        }).done(this._apiGetMyPartySuccess.bind(this))
        .fail(error.catch);
    },


    _apiGetMyPartySuccess: function (data) {
            console.log(data);
            this.layer.updateStatus(data);
    },
});
