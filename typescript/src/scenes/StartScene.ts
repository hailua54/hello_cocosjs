startCCExtend();
class StartScene extends game.BaseScene
{
	menuListener:cc.EventListener;

	isInited:boolean;
	uiView:any;
	video:any;

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
		if (this.uiView)
		{
			this.uiView.setContentSize(screen);
			cc.log("StartScene sizeHandler screen " + screen.width + " " + screen.height);
			ccui['helper'].doLayout(this.uiView);
		}
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

	protected initVod():void
	{
		if (this.video) return;
		if (cc.sys.os == cc.sys.OS_WINDOWS) return;
		var vurl:string = "res/cocosvideo.mp4";
		if (cc.sys.platform == cc.sys.ANDROID)
		{
			var screen:cc.Size = GameUtils.getScreenSize();
			var layer:cc.LayerColor = cc.LayerColor.create(cc.color(0,0,0,0), 232, 240);
			layer.setBlendFunc(cc.BlendFunc.DISABLE);
			this.addChild(layer);
			var video:ccui.VideoPlayer = new ccui.VideoPlayer();
			//Fuk: MUST set content size here to trigger surfaceCreated(SurfaceHolder holder) on Cocos2dxVideoView
			video.setContentSize(432, 240);
			video.setKeepAspectRatioEnabled(true);
			this.addChild(video);
			video.setFileName(vurl);
			video.anchorX = 0;
			video.anchorY = 0;
			video.x = 0;
			video.y = 0;
			this.video = video;
			video.setEventListener(ccui.VideoPlayer.EventType.PLAYING, function(){
				// get real video width/height
				cc.log("ccui.VideoPlayer.EventType.PLAYING ==== ");
			}.bind(this))
			video.play();
		}
	}

	public loadUI()
	{
		var screen:cc.Size = GameUtils.getScreenSize();

		//get the screen size of your game canvas

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

		this.initVod();
	}
}
endCCExtend();
this['StartScene'] = game.BaseScene['extend'](new StartScene());
