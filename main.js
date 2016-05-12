window.onload = function(){
    cc.game.onStart = function(){
        cc.view.setDesignResolutionSize(800, 600, cc.ResolutionPolicy.UNKNOWN);
        //load resources
        cc.LoaderScene.preload(g_resources, function () {
            cc.director.runScene(new MenuScene());
        }, this);
    };
    cc.game.run("gameCanvas");
};