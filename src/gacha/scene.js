
var GachaScene = cc.Scene.extend({
    gacha: null,
    draw: null,
    menu_enable: false,
    update_check: false,
    onEnter:function () {
        this._super();

        var backgroundLayer = new cc.LayerColor(cc.color(170, 255, 255, 255));
        this.gacha = new GachaLayer();
        this.draw = new GachaDrawLayer();
        this.draw.setVisible(false);
        this.addChild(backgroundLayer, 0);
        this.addChild(this.gacha, 100);
        this.addChild(this.draw, 200);
        this.apiCheckGacha();

        cc.eventManager.addListener({
            event: cc.EventListener.MOUSE,
            onMouseUp: function (evt) {
                this.draw.onClick();
            }.bind(this)
        }, this);

        this.scheduleUpdate();
    },


    update: function () {
        if (this.gacha.run === true){
            this.gacha.run = false;
            this.runGacha();
        }
        if (!this.gacha.isSelectAvailable()){
            if (!this.draw.is_drawing){
                this.gacha.setButtonUnable();
            }
        }
        if ( (this.draw.is_end === true) && (this.draw.is_drawing === false) ){
            this.draw.is_end = false;
            this.apiCheckGacha();
        }
    },


    /**
     *
     */
    runGacha: function () {
        this.draw.setGacha();
        this.draw.is_drawing = true;
        this.gacha.setButtonUnable();
        this.apiDrawGacha();

    },


    /**
     * ガチャ情報取得APIの送信
     */
    apiCheckGacha: function (){
        $.ajax({
            url:"http://homestead.app:8000/v1/gacha/",
            type:"GET",
        }).done(function(data){
            console.log(data);
            this.gacha.loadStatus(data);
        }.bind(this)).fail(function(data){
            console.log(data);
        });

    },


    /**
     * ガチャ実行APIの送信
     */
    apiDrawGacha: function (){
        $.ajax({
            url:"http://homestead.app:8000/v1/gacha/",
            type:"POST",
            statusCode: {
                201: this.handle201.bind(this),
                400: this.handle400.bind(this)
            },
        });
    },


    handle201: function (data, textStatus, jqXHR){
        this.draw.animeBegin(data);
    },


    handle400: function (data, textStatus, jqXHR){
        this.gacha.setButtonEnable();
        console.log(data);
        console.log(textStatus);
        console.log(jqXHR);
    },


    onExit:function () {
        console.log("GachaScene onExit()");
    }
});
