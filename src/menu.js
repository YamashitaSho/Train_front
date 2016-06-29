var MenuLayer = cc.Layer.extend({
    label_money: null,
    leader: null,
    ctor:function () {
        this._super();
        // メニューの生成
        this.createMenu();

    var size = cc.director.getWinSize();

        var head = new cc.Sprite(res.menu_ttl);
        head.setPosition(size.width/2, size.height-80);
        this.addChild(head);

        var frame = new cc.Sprite(res.frame);
        frame.setPosition(400,300);
        this.addChild(frame);

        this.label_money = new cc.LabelTTF.create("", "Arial", 26);
        this.label_money.setPosition(580, 200);
        this.addChild(this.label_money);

        this.apiGetStatus();
    },


    /**
     * ユーザー情報APIの送信
     */
    apiGetStatus: function (){
        $.ajax({
            url:"http://train-yama.nurika.be:8000/v1/menu/",
            type:"GET",
        })
        .done(this.apiGetStatusSuccess.bind(this))
        .fail(error.catch);
    },


    /**
     * apiGetStatusにて200の返却
     */
    apiGetStatusSuccess: function (data, textStatus, jqXHR) {
        console.log(data);
        if (data.money !== void 0){
            this.label_money.setString("money : "+data.money);
        }
        if (data.leader_char_id !== void 0){
            url = "res/char/org/char"+("0"+data.leader_char_id).slice(-2)+".png";
            this.leader = new cc.Sprite(url);
            this.leader.setPosition(580,340);
            this.addChild(this.leader, 3);
        }
    },


    /**
     *  メニュー生成メソッド
     */
    createMenu: function () {
        var menuButton = [];
        _(["order", "gacha", "quest", "arena"]).forEach(function(val, count) {
            var button = "menu_btn"+("0"+count).slice(-2);
            var tmpButton = cc.MenuItemImage.create(
                res[button], // ON 時の画像を指定
                res[button], // 押下時の画像を指定
                this.onMenu, this); // メニュー選択時のイベントを指定
            tmpButton.setName(val); // タグを指定 - 選択時の識別子となる
            var menuSize = tmpButton.getContentSize();
            tmpButton.setPosition(menuSize.width/2+60, -1*((menuSize.height+20)*count+200));
            menuButton.push(tmpButton);
        }.bind(this));

        var gameWin = cc.director.getWinSize();
        var menu = cc.Menu.create(menuButton);
        menu.setPosition(0, gameWin.height);
        this.addChild(menu, 1);
    },


    onMenu: function (sender){
        var nextclass = null;
        var classname = sender.getName();
        if (classname === "order"){
            nextclass = new OrderScene();
        } else if (classname === "gacha"){
            nextclass = new GachaScene();
        } else if (classname === "quest"){
            nextclass = new QuestScene();
        } else if (classname === "arena"){
            nextclass = new ArenaScene();
        }
        var transitionScene = cc.TransitionFade.create(0.5, nextclass);
        cc.director.pushScene(transitionScene);
        cc.eventManager.removeAllListeners();
        this.removeAllChildren();
    },
});


var MenuScene = cc.Scene.extend({
    onEnter:function () {
        this._super();
        var backgroundLayer = new cc.LayerColor(cc.color(70,22,22,50));
        this.addChild(backgroundLayer);
        var layer = new MenuLayer();
        this.addChild(layer);
    },
    onExit:function () {
        console.log("MenuScene onExit()");
    }
});
