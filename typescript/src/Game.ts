class Game extends game.BaseGame
{
  public gameModel:GameModel;
	public preloadScene:cc.Scene;
	public loading:com.Loading;
	intervalId:number;
	orgWW:number;
	orgWH:number;

  constructor()
  {
    super();
    this.init();
  }

  public destructor()
	{
		super.destroy();
		cc.log("====== APP DESTRUCTOR CALLED! ======");
		// release all referenced/listener to root ---
		this.loading.release();

		this.gameModel.startScene.destructor();
		this.gameModel.gameScene.destructor();
		if (this.gameModel.uiScene) this.gameModel.uiScene.destructor();

		this.gameModel.startScene.release();
		this.gameModel.gameScene.release();
		if (this.gameModel.uiScene) this.gameModel.uiScene.release();

		clearInterval(this.intervalId);
		// -------------------------------------------
	}

	public init()
	{
		GameSettings.LAST_ORIENTATION = GameUtils.getOrientation();

		var winSize:cc.Size = cc.director.getWinSize();
		var preloadScene:cc.Scene = new cc.Scene();
		this.preloadScene = preloadScene;
		cc.director.runScene(preloadScene);
		var loading:com.Loading = new com.Loading(0.5);
		loading.show(true, "Load common assets");
		preloadScene.addChild(loading);
		loading.setSize(winSize.width, winSize.height);

		preloadScene.scheduleOnce(this.startLoading.bind(this), 0.1);
		this.loading = loading;
		loading.retain();

		if (!cc.sys.isNative)
		{
			window.onresize = this.sizeHandler.bind(this);
		}
		else {
			cc.eventManager.addCustomListener(sys.ON_ORIENTATION_CHANGE, this.onOrientationChange.bind(this));
		}

    this.sizeHandler();
	}

	public onOrientationChange(e:cc.EventCustom)
	{
		cc.log("onOrientationChange " + e.getUserData());
		if (cc.director.getRunningScene() && cc.director.getRunningScene()['orientationHandler']) cc.director.getRunningScene()['orientationHandler']();
		this.sizeHandler();
	}

	public sizeHandler():void
  {
		var w:number, h:number; // available width/height on devices
    var debugStr:string = "";
		var screen = GameUtils.getScreenSize();

		if (!cc.sys.isNative) // web
		{
			//window.scrollTo(0, 1); // autohide address bar for mobile
	    w = screen.width;
	    h = screen.height + 1; // for ios fullscreen
			// check orientation change
			if (GameUtils.getOrientation() != GameSettings.LAST_ORIENTATION)
			{
				GameSettings.LAST_ORIENTATION = GameUtils.getOrientation()
				if (cc.director.getRunningScene() && cc.director.getRunningScene()['orientationHandler']) cc.director.getRunningScene()['orientationHandler']();
			}
		}
		else {
			w = screen.width;
			h = screen.height;
		}
		cc.log("setDesignResolutionSize " + w + " " + h);
		if (cc.director.getRunningScene() && cc.director.getRunningScene()['sizeHandler']) cc.director.getRunningScene()['sizeHandler']();
		cc.view.setFrameSize(w, h);
		cc.view.setDesignResolutionSize(w, h, cc.ResolutionPolicy.SHOW_ALL);
	}

	public startLoading()
	{
		cc.loader.load(g_resources, this.loadCommonAssetsProgress.bind(this), this.onLoadCommonAssetComplete.bind(this));
	}

	protected loadCommonAssetsProgress(result:any, count:number, loadedCount:number)
	{
		var percent = (loadedCount / count * 100) | 0;
		percent = Math.min(percent, 100);
		this.loading.updatePercent(percent);
	}

  public onLoadCommonAssetComplete()
  {
		this.preloadScene.removeChild(this.loading);
		this.preloadScene = null;
    this.gameModel = new GameModel();
		this.gameModel.game = this;
		this.gameModel.loading = this.loading;

    this.gameModel.startScene = new StartScene();
		this.gameModel.startScene.initModel(this.gameModel);
		this.gameModel.startScene.retain();

		this.gameModel.gameScene = new GameScene();
		this.gameModel.gameScene.initModel(this.gameModel);
		this.gameModel.gameScene.retain();

    cc.director.runScene(this.gameModel.startScene);
		cc.eventManager.addCustomListener("game_on_exit", this.destructor.bind(this));

  }

}
