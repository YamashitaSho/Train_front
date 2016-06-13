var order;

var OrderScene = cc.Scene.extend({
    // Layerクラスをnewするにはthis._super()が必要
    charLayer: null,
    itemLayer: null,
    commonLayer: null,
    char_mode: true,

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
        this.addChild(this.itemLayer, 100);
        this.addChild(this.commonLayer, 200);

        this.apiGetOrder();

        this.scheduleUpdate();
    },


    update: function () {
        //モードチェンジ処理
        this.modeChange();
        //編成変更処理
        this.changeOrder();

        this.charLayer.updateSelect();
        this.itemLayer.updateSelect();

        if (this.commonLayer.getBackFlag()){
            this.selectBack();
        }
    },


    /**
     * キャラモードとアイテムモードを切り替える
     * 切り替えボタンが押されていなければスキップ
     */
    modeChange: function (){
        if (this.commonLayer.getTabFlag()){
            this.char_mode = (!this.char_mode);
            this.charLayer.setVisible(this.char_mode);
            this.itemLayer.setVisible(!this.char_mode);
            this.charLayer.select.setUpdate();
            this.itemLayer.select.setUpdate();
        }
    },


    /**
     * 編成変更処理
     * 編成変更ボタンが押されていなければスキップ
     */
    changeOrder: function (){
        //編成変更ボタンがタップされたか
        if (this.commonLayer.getChangeFlag()) {
            if (this.char_mode) {
                this.apiChangeOrderChar();
            } else {
                this.apiChangeOrderItem();
            }
        }
    },


    /**
     * 編成情報取得APIの送信
     * 各レイヤーに取得した情報を反映する
     */
    apiGetOrder: function (){
        $.ajax({
            url: "http://train-yama.nurika.be:8000/v1/order/",
            type: "GET"
        }).done(this._apiGetOrderSuccess.bind(this))
        .fail(error.catch);
    },


    _apiGetOrderSuccess: function (data) {
        order = data;
        this.updateAppearance();
    },


    /**
     * 編成変更にともなう画面の更新
     */
    updateAppearance: function () {
        this.charLayer.updateChars();
        this.itemLayer.updateItems();
    },


    /**
     * キャラ編成変更情報APIの送信
     */
    apiChangeOrderChar: function (){
        if ( !this.charLayer.select.canChangeChar() ){
            return;
        }
        var request = {
            slot: 0 + this.charLayer.select.getPartyChar(),
            new_id: 0 + order.chars[this.charLayer.select.getChar()].char_id
        };

        $.ajax({
            url:"http://train-yama.nurika.be:8000/v1/order/char/",
            data:request,
            type:"PUT"
        }).done(this.apiGetOrder.bind(this))
        .fail(error.catch);
    },


    /**
     * アイテム編成変更APIの送信
     */
    apiChangeOrderItem: function (){
        if ( !this.itemLayer.select.canChangeItem() ){
            return;
        }
        var request = {
            slot: 0 + this.itemLayer.select.getPartyItem(),
            new_id: 0 + order.items[this.itemLayer.select.getItem()].item_id
        };

        $.ajax({
            url:"http://train-yama.nurika.be:8000/v1/order/char/",
            data:request,
            type:"PUT"
        }).done(this.apiGetOrder.bind(this))
        .fail(error.catch);
    },


    /**
     * 戻るボタンの選択
     */
    selectBack: function (){
        var transitionScene = cc.TransitionFade.create(1.0, new MenuScene());
        cc.director.pushScene(transitionScene);
        cc.eventManager.removeAllListeners();
        this.removeAllChildren();
    },


    onExit: function () {
        console.log("OrderScene onExit()");
    }
});
