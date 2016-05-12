
/**
 * モード切り替えで変化しない情報を記述するレイヤー
 */
var OrderLayer = cc.Layer.extend({
    ctor: function () {
        this._super();

        size = cc.director.getWinSize();

        var head = new cc.Sprite(res.order_ttl);
        head.setPosition(size.width / 2, size.height - 80);
        this.addChild(head,1);

        var frame = new cc.Sprite(res.frame);
        frame.setPosition(400,300);
        this.addChild(frame,2);

        this.addBackButton();
        this.makeList();
        this.makeParty();
        this.makeDetail();
        this.updateSelect();
    },


    makeList: function () {
        var frames = [];
        var x;
        var y;
        var xRow = 3;
        var yColomn = 4;
        for (y = 0; y < yColomn; y+=1){
            for (x = 0; x < xRow; x+=1){
                frames[i] = new cc.Sprite(res.order_frame);
                frames[i].setPosition(480 + x * 100, 384 - y * 100);   //100 = 96 + 2(padding) + 2(padding)
                this.addChild(frames[i],100);
                ++i;
            }
        }
    },


    makeParty: function () {
        var frames = [];
        var x;
        var y;
        var xRow = 3;
        var yColomn = 2;
        for (y = 0; y < yColomn; y+=1){
            for (x = 0; x < xRow; x+=1){
                frames[i] = new cc.Sprite(res.order_frame);
                frames[i].setPosition(110 + x * 100, 384 - y * 100);   //100 = 96 + 2(padding) + 2(padding)
                this.addChild(frames[i],100);
                ++i;
            }
        }
    },


    makeDetail: function () {
        var frame = new cc.Sprite(res.order_detail);
        frame.setPosition(215, 148);
        this.addChild(frame,100);
    },


    /*
     * 受信したパーティ情報を画面に反映する
     */
    updatePartyList: function (){
        var chars = [];
        var items = [];
        var xRow = 3;
        var char_url;
        var item_url;
        var x;
        for (x = 0; x < xRow; x+=1){
            if ( order.party[x] ){
                char_url = "res/char/icon/char"+("0"+order.party[x].char_id).slice(-2)+".png";
                item_url = "res/item/item"+("0"+order.party[x].item_id).slice(-2)+".png";
            } else {
                char_url = "res/char/icon/char00.png";
                item_url = "res/item/item00.png";
            }
            chars[x] = new cc.MenuItemImage(char_url, char_url, this.selectChar ,this);
            chars[x].setPosition(110 + x * 100, 384);
            chars[x].tag = x;
            items[x] = new cc.MenuItemImage(item_url, item_url, this.selectItem ,this);
            items[x].setPosition(110 + x * 100, 284);
            items[x].tag = x;
        }
        var chars_party = new cc.Menu(chars);
        var items_party = new cc.Menu(items);
        chars_party.setPosition(0, 0);
        items_party.setPosition(0, 0);
        chars_party.setName("update"); //変化があった場合に更新する
        items_party.setName("update");
        this.addChild(chars_party);
        this.addChild(items_party);
    },


    /**
     * 戻るボタンの表示
     */
    addBackButton: function (){
        var back = new cc.MenuItemImage(res.back, res.back, this.selectBack, this);
        var back_menu = new cc.Menu(back);
        back_menu.setPosition(50, 50);
        this.addChild(back_menu,200);
    },


    /**
     * キャラ編成スロットの選択
     */
    selectChar: function (sender){
        var tag = sender.getTag();
        select.setPartyChar(tag);
    },


    /**
     * アイテム編成スロットの選択
     */
    selectItem: function (sender){
        var tag = sender.getTag();
        select.setPartyItem(tag);
    },


    /**
     * 戻るボタンの選択
     */
     selectBack: function (){
    /*    var scene = this.getParent();
        var transitionScene = cc.TransitionFade.create(1.0, new MenuScene());
        cc.director.pushScene(transitionScene);
        // 追加済みのイベントを削除
        console.log(scene);
        cc.eventManager.removeAllListeners();
        this.removeAllChildren();*/
        delete_flag = true;
     },


    /**
     * 選択されているキャラ・アイテムをハイライト表示する
     */
    updateSelect: function (){
        var sel = select.getPartyChar();
        if (sel !== null){
            var party_char = new cc.Sprite(res.order_frame_selected);
            party_char.setPosition(110 + sel * 100, 384);
            party_char.setName("select");
            this.addChild(party_char, 300);
        }
        if (select.party_item !== null){
            var party_item = new cc.Sprite(res.order_frame_selected);
            party_item.setPosition(110 + select.party_item * 100, 284);
            party_item.setName("select");
            this.addChild(party_item, 300);
        }
        if (select.char !== null && char_mode === true){
            var char = new cc.Sprite(res.order_frame_selected);
            char.setPosition(480 + 100 * (select.char % 3), 384 - 100 * (select.char / 3 | 0) );
            char.setName("select");
            this.addChild(char, 300);
        }
        if (select.item !== null && char_mode === false){
            var item = new cc.Sprite(res.order_frame_selected);
            item.setPosition(480 + 100 * (select.item % 3), 384 - 100 * (select.item / 3 | 0) );
            item.setName("select");
            this.addChild(item, 300);
        }
    },

    removeSelect: function(){
        var target = this.getChildByName("select");
        while (target !== null){
            target.removeFromParent();
            target = this.getChildByName("select");
        }

    }
});