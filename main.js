window.onload = function(){
    cc.game.onStart = function(){
        cc.view.setDesignResolutionSize(1024, 768, cc.ResolutionPolicy.SHOW_ALL);
        //load resources
        cc.LoaderScene.preload(g_resources, function () {
            cc.director.runScene(new MyScene());
        }, this);
    };
    cc.game.run("gameCanvas");
};