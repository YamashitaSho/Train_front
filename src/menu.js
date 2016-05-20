var size;
var lavel_money;
var head;
var leader;

var MenuLayer = cc.Layer.extend({
    ctor:function () {
        this._super();
        // メニューの生成
        this.createMenu();

        size = cc.director.getWinSize();

        head = new cc.Sprite(res.menu_ttl);
        head.setPosition(size.width/2, size.height-80);
        this.addChild(head,1);

        var frame = new cc.Sprite(res.frame);
        frame.setPosition(400,300);
        this.addChild(frame);

        label_money = new cc.LabelTTF.create("", "Arial", 26);
        label_money.setPosition(580, 200);
        this.addChild(label_money, 2);

        //GetStatusの処理(非同期)
        this.apiGetStatus();

        this.scheduleUpdate();
    },


    /**
     * ユーザー情報APIの送信
     */
    apiGetStatus: function (){
        $.ajax({
            url:"http://homestead.app:8000/v1/menu/",
            type:"GET",
        }).done(function(data){
            console.log("success!");
            console.log(data);
            if (data.money !== void 0){
                label_money.setString("money : "+data.money);
            }
            if (data.leader_char_id !== void 0){
                url = "res/char/org/char"+("0"+data.leader_char_id).slice(-2)+".png";
                leader = new cc.Sprite(url);
                leader.setPosition(580,340);
                this.addChild(leader, 3);
            }
        }.bind(this)).fail(function(data){
            console.log("failed to GetStatus");
            console.log(data);
        });
    },


    update: function(){
        //frame++;
        //label.setString("frame:" + frame + "");
    },


    /**
     *  メニュー生成メソッド
     */
    createMenu: function () {
        var menuButton = [];
        _(["onOrder", "onGacha", "onQuest", "onArena"]).forEach(function(val, count) {
            var button = "menu_btn"+("0"+count).slice(-2);
            var tmpButton = cc.MenuItemImage.create(
                res[button], // ON 時の画像を指定
                res[button], // 押下時の画像を指定
                this[val], this); // メニュー選択時のイベントを指定
            tmpButton.setTag(val); // タグを指定 - 選択時の識別子となる
            var menuSize = tmpButton.getContentSize();
            tmpButton.setPosition(menuSize.width/2+60, -1*((menuSize.height+20)*count+200));
            menuButton.push(tmpButton);
        }.bind(this));

        var gameWin = cc.director.getWinSize();
        var menu = cc.Menu.create(menuButton);
        menu.setPosition(0, gameWin.height);
        this.addChild(menu, 1);
    },


    /**
     *  メニュー選択時イベント
     *  @param {object} sender イベントを発火したメニューオブジェクト
     */
    onOrder: function (sender) {
        console.log(sender.getTag());
        var className = sender.getTag();
        var transitionScene = cc.TransitionFade.create(0.5, new OrderScene());
        cc.director.pushScene(transitionScene);
        // イベント全削除
        cc.eventManager.removeAllListeners();
        // オブジェクト全解除
        this.removeAllChildren();
    },


    /**
     *  メニュー選択時イベント
     *  @param {object} sender イベントを発火したメニューオブジェクト
     */
    onGacha: function (sender) {
        console.log(sender.getTag());
        var className = sender.getTag();
        var transitionScene = cc.TransitionFade.create(0.5, new GachaScene());
        cc.director.pushScene(transitionScene);
        // イベント全削除
        cc.eventManager.removeAllListeners();
        // オブジェクト全解除
        this.removeAllChildren();
    },


    /**
     *  メニュー選択時イベント
     *  @param {object} sender イベントを発火したメニューオブジェクト
     */
    onQuest: function (sender) {
        console.log(sender.getTag());
        var className = sender.getTag();
        var transitionScene = cc.TransitionFade.create(1.0, new QuestScene());
        cc.director.pushScene(transitionScene);
        // イベント全削除
        cc.eventManager.removeAllListeners();
        // オブジェクト全解除
        this.removeAllChildren();
    },


    /**
     *  メニュー選択時イベント
     *  @param {object} sender イベントを発火したメニューオブジェクト
     */
    onArena: function (sender) {
        console.log(sender.getTag());
        var className = sender.getTag();
        var transitionScene = cc.TransitionFade.create(1.0, new ArenaScene());
        cc.director.pushScene(transitionScene);
        // イベント全削除
        cc.eventManager.removeAllListeners();
        // オブジェクト全解除
        this.removeAllChildren();
    }
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
