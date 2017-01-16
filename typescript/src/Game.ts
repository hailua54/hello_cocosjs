class Game extends game.BaseGame
{
  public gameModel:GameModel;
	public preloadScene:cc.Scene;
	public loading:vcom.Loading;
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
		var winSize:cc.Size = cc.director.getWinSize();
		var preloadScene:cc.Scene = new cc.Scene();
		this.preloadScene = preloadScene;
		cc.director.runScene(preloadScene);
		var loading:vcom.Loading = new vcom.Loading(0.5);
		loading.show(true, "Load common assets");
		preloadScene.addChild(loading);
		loading.setSize(winSize.width, winSize.height);
		preloadScene.scheduleOnce(this.startLoading.bind(this), 0.1);
		this.loading = loading;
		loading.retain();
		cc.log("cc.sys.isNative === " + cc.sys.isNative);
		if (!cc.sys.isNative)
		{
			var container:any = document.getElementById("Cocos2dGameContainer");
			container.style.display = "none";
			var gameCanvas:any = document.getElementById("gameCanvas");
			gameCanvas.style.position = 'absolute';
			document.getElementById("mainContainer").appendChild(gameCanvas);

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
	}

	public sizeHandler():void
  {
		var w:number, h:number; // available width/height on devices
    var debugStr:string = "";

		if (!cc.sys.isNative) // web
		{
			window.scrollTo(0, 1); // autohide address bar for mobile
	    h = GameUtils.getSize("Height") + 1; // for ios fullscreen
	    w = GameUtils.getSize("Width");

			var gameCanvas:any = document.getElementById("gameCanvas");
			gameCanvas.width = w;
			gameCanvas.height = h;
			gameCanvas.style.width = w + 'px';
			gameCanvas.style.height = h + 'px';
		}
		else {
			var winSize = cc.view.getFrameSize();
			var orientation = CppSysInit.getOrientation();
			cc.log("Native: CppSysInit ============ " + CppSysInit);
			cc.log("Native: orientation ============ " + orientation);
			w = winSize.width;
			h = winSize.height;
			if (cc.sys.isNative) cc.view.setDesignResolutionSize(w, h, cc.ResolutionPolicy.EXACT_FIT);
		}

		cc.log("w ========= " + w);
		cc.log("h ========= " + h);
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

	public onWindowResize()
	{
		cc.log("onWindowResize === ");
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

		this.gameModel.uiScene = new UIScene();
		this.gameModel.uiScene.initModel(this.gameModel);
		this.gameModel.uiScene.retain();

    cc.director.runScene(this.gameModel.uiScene);
		cc.eventManager.addCustomListener("game_on_exit", this.destructor.bind(this));
		cc.eventManager.addCustomListener("glview_window_resized", this.onWindowResize.bind(this));

  }

}
