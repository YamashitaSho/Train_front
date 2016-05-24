var GachaLayer = cc.Layer.extend({
    size : null,
    availability : false,
    run : false,
    button_enable : false,
    ctor:function () {
        this._super();

        this.size = cc.director.getWinSize();
        this._putTitle();
        this._putFrame();
        this._addBackButton();
        this._addDrawButton();
        this._makeDetail();
        console.log("aiueo gacha");
    },


    _putTitle: function () {
        var head = new cc.Sprite(res.gacha_ttl);
        head.setPosition(this.size.width / 2, this.size.height - 80);
        this.addChild(head);
    },


    _putFrame: function (){
        var frame = new cc.Sprite(res.frame);
        frame.setPosition(this.size.width / 2, this.size.height / 2);
        this.addChild(frame);
    },


    /**
     *
     */
    _makeDetail: function () {
        var detail = [
        {
            name: "detail_title",
            category: false
        },
        {
            name: "detail_status",
            category: true
        },
        ];
        var detail_object = [];
        _(detail).forEach(function (val, count) {
            detail_object[count] = new cc.LabelTTF("", "Arial", 32);
            detail_object[count].setName(val.name);
            detail_object[count].setPosition(0,0);
            if (val.category === true){
                this._setDetailLabel(detail_object[count]);
            } else {
                this._setDetailTitle(detail_object[count]);
            }
            this.addChild(detail_object[count]);
        }.bind(this));
    },


    /**
     * 取得キャラ表示の項目名を設定
     */
    _setDetailTitle: function (detail) {
        var title = [
        {
            name: "rest_char",
            title: "のこりキャラ:",
            pos: {x: 320, y: 160}
        },
        {
            name: "gacha_cost",
            title: "りょうきん:",
            pos: {x: 320, y: 120}
        },
        {
            name: "money",
            title: "しょじきん:",
            pos: {x: 320, y: 80}
        },
        ];

        var create = [];
        _(title).forEach( function (val, count) {
            create[count] = new cc.LabelTTF(val.title, "Arial", 24);
            create[count].setPosition(val.pos);
            create[count].setName(val.name);
            //create[count].setVisible(false);
            create[count].color = {r:30, g:30, b:30, a:255};
            detail.addChild(create[count]);
        });
    },


    /**
     * 取得キャラ表示の項目を設定
     */
    _setDetailLabel: function (detail) {
        var label = [
        {
            key: "rest_char",
            value: "0",
            pos: {x: 480, y: 160}
        },
        {
            key: "gacha_cost",
            value: "0",
            pos: {x: 480, y: 120}
        },
        {
            key: "money",
            value: "0",
            pos: {x: 480, y: 80}
        },
        ];

        var create = [];
        _(label).forEach( function (val, count) {
            create[count] = new cc.LabelTTF(val.value, "Arial", 32);
            create[count].setPosition(val.pos);
            create[count].setName(val.key);
            //create[count].setVisible(false);
            create[count].color = {r:30, g:30, b:30, a:255};
            detail.addChild(create[count]);
        });
    },


    /**
     * 取得したキャラのステータスをラベルに設定する
     * 設定先は引数で指定する ( "detail_char" or "detail_partychar" )
     */
    loadStatus: function (data) {
        this.availability = data.availability;
        this.setButtonEnable();
        var label_group = this.getChildByName("detail_status");
        var target;
        if (data.availability === true){
            for (var key in data){
                target = label_group.getChildByName(key);
                if (target !== null){       //keyがavailableのラベルはない
                    target.setString(data[key]);
                }
            }
        } else {
            target = label_group.getChildByName("rest_char");
            target.setString(data.rest_char);
            target = label_group.getChildByName("money");
            target.setString(data.money);
            target = label_group.getChildByName("gacha_cost");
            target.setString("-");
        }
    },


    /**
     * 戻るボタンの表示
     */
    _addBackButton: function (){
        var back = new cc.MenuItemImage(res.back, res.back, this._selectBack, this);
        var back_menu = new cc.Menu(back);
        back_menu.setPosition(50, 50);
        this.addChild(back_menu);
    },


    /**
     * ガチャ実行ボタンの表示
     */
    _addDrawButton: function (){
        var draw = new cc.MenuItemImage(res.gacha_button, res.gacha_button, this._selectDraw, this);
        var menu = new cc.Menu(draw);
        menu.setPosition(this.size.width / 2, this.size.height / 2);
        this.addChild(menu);
    },


    /**
     * 戻るボタンの選択
     */
    _selectBack: function (){
        if (this.isSelectAvailable()){
            var transitionScene = cc.TransitionFade.create(0.5, new MenuScene());
            cc.director.pushScene(transitionScene);
            cc.eventManager.removeAllListeners();
            this.removeAllChildren();
        }
    },


    /**
     * ガチャ実行ボタンの選択
     */
    _selectDraw: function (){
        if (this.isSelectAvailable()){
            if (this.availability === true){
                this.setButtonUnable();
                this.run = true;
            }
        }
    },


    /**
     * ガチャメニューのボタンが有効か否か
     */
    isSelectAvailable: function () {
        return this.enable;
    },


    /**
     * ボタンを有効化する
     */
    setButtonEnable: function () {
        this.enable = true;
    },


    /**
     *ボタンを無効化する
     */
     setButtonUnable: function () {
        this.enable = false;
     }
});
