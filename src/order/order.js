var order;
var update_flag = false;
var char_mode = true;
var delete_flag = false;

var select = new SelectState();


var OrderScene = cc.Scene.extend({
    // Layerクラスをnewするにはthis._super()が必要
    charLayer: null,
    itemLayer: null,
    commonLayer: null,
    onEnter: function () {
        this._super();
        this.setName("OrderLayer");

        var backgroundLayer = new cc.LayerColor(cc.color(170, 255, 255, 255));
        this.commonLayer = new OrderLayer();
        this.charLayer = new CharLayer();
        this.itemLayer = new ItemLayer();

        this.charLayer.setName("char");
        this.itemLayer.setName("item");
        this.commonLayer.setName("common");
        this.itemLayer.setVisible(false);   //itemLayerは初期で非表示

        this.addChild(backgroundLayer, 0);
        this.addChild(this.charLayer, 100);
        this.addChild(this.itemLayer, 101);
        this.addChild(this.commonLayer, 200);

        this.apiGetOrder();

        this.scheduleUpdate();


        cc.eventManager.addListener({
            event:cc.EventListener.MOUSE,
            onMouseUp: function(evt) {
                console.log(this);
            }.bind(this),
        }, this);
    },


    /**
     * 編成情報取得APIの送信
     * 各レイヤーに取得した情報を反映する
     */
    apiGetOrder: function (){
        $.ajax({
            url: "http://homestead.app:8000/v1/order/",
            type: "GET"
        }).done(function (data) {
            console.log("success!");
            console.log(data);
            order = data;
            this.updateAppearance();
        }.bind(this)).fail(function (data) {
            console.log("failed...");
            console.log(data);
        });
    },


    update: function () {
        if (update_flag === true){
            update_flag = false;
            this.apiGetOrder();
        }
        var stat = select.isToUpdate();
        if (stat === true){
            var target = this.commonLayer.getChildByName("select");
            while ( target !== null ) {
                target.removeFromParent();
                target = this.commonLayer.getChildByName("select");
            }
            this.commonLayer.updateSelect();
        }
        if (delete_flag === true){
            delete_flag = false;
            this.selectBack();
        }

    },


    updateAppearance: function () {
        //update対象のものを削除する
        var target = this.commonLayer.getChildByName("update");
        while ( target !== null ) {
            target.removeFromParent();
            target = this.commonLayer.getChildByName("update");
        }
        target = this.charLayer.getChildByName("update");
        while ( target !== null ) {
            target.removeFromParent();
            target = this.commonLayer.getChildByName("update");
        }
        target = this.itemLayer.getChildByName("update");
        while ( target !== null ) {
            target.removeFromParent();
            target = this.commonLayer.getChildByName("update");
        }
        this.charLayer.updateCharList();
        this.itemLayer.updateItemList();
        this.commonLayer.updatePartyList();
    },


    /**
     * 戻るボタンの選択
     */
     selectBack: function (){
        var transitionScene = cc.TransitionFade.create(1.0, new MenuScene());
        cc.director.pushScene(transitionScene);
        // 追加済みのイベントを削除
        cc.eventManager.removeAllListeners();
        this.removeAllChildren();
     },


    onExit: function () {
        console.log("OrderScene onExit()");
    }
});
