class StartScene extends game.BaseScene
{
	menuListener:cc.EventListener;

	isInited:boolean;
	uiView:any;

	public ctor()
	{
		// add this code to deal with the draw Object created to pass to Class::extend function
		if (!this._super) return;
		// -------------------------------
		this._super();
	}

	// destructor
	public destructor()
	{
		this._super();
	}

  public onExit(): void
  {
		cc.log("StartScene::onExit ----------------------- ");

		// should call as the last code line to destroy app
		this._super();
  }

	// override here
	public onEnter():void
	{
		cc.log("StartScene::onEnter ----------------------- ");
		this._super();
		if (!this.isInited)
		{
			this.scheduleOnce(this.startLoading.bind(this), 0.1);
			return;
		}
		this.sizeHandler();
	}

	public initModel(model:GameModel)
	{
		super.initModel(model);
		this.addChild(this.gameModel.loading);
		this.gameModel.loading.show(true, "load ui scene assets");
	}

	public sizeHandler()
	{
		var screen = GameUtils.getScreenSize();
		this.uiView.setContentSize(screen);
		cc.log("StartScene sizeHandler screen " + screen.width + " " + screen.height);
		ccui['helper'].doLayout(this.uiView);
	}

	public orientationHandler()
	{
		this.loadUI();
	}

	public startLoading()
	{
		var resources:Array<string> = [
			"res/Login_portrait.json",
			"res/Login_landscape.json"
		];
		cc.loader.load(resources, this.loadAssetsProgress.bind(this), this.onLoadAssetComplete.bind(this));
	}

	protected loadAssetsProgress(result:any, count:number, loadedCount:number)
	{
		var percent = (loadedCount / count * 100) | 0;
		percent = Math.min(percent, 100);
		this.gameModel.loading.updatePercent(percent);
	}

	protected onLoadAssetComplete()
	{
		this.removeChild(this.gameModel.loading);
		this.isInited = true;
		this.loadUI();
		this.sizeHandler();
	}

	public loadUI()
	{
		//get the screen size of your game canvas
		var screen:cc.Size = GameUtils.getScreenSize();
		var jsonFile:string = GameUtils.getOrientation() == PORTRAIT ? "res/Login_portrait.json" : "res/Login_landscape.json";
		// init UI
    var json = ccs.load(jsonFile);
		var uiView:any = json.node.getChildByName("view");
		json.node.removeChild(uiView);
		uiView.initModel(this.gameModel);
		// destroy current uiView
		cc.log("this.uiView  ======== " + this.uiView);
		if (this.uiView)
		{
			cc.log("here ---");
			// copy status from this.uiView to uiView
			GameUtils.copyUIStatus(this.uiView, uiView);
			this.removeChild(this.uiView);
			this.uiView.destructor();
		}
		this.uiView = uiView;
		this.addChild(uiView);
	}
}

this['StartScene'] = game.BaseScene['extend'](new StartScene());
