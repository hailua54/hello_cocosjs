class UIScene extends game.BaseScene
{
	menuListener:cc.EventListener;
	menu:any;
	menuItems:Array<any>;

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
		this.menuListener.release();
		this._super();
	}

  public onExit(): void
  {
		cc.log("StartScene::onExit ----------------------- ");
		cc.eventManager.removeListener(this.menuListener);

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

		cc.eventManager.addListener(this.menuListener, this.menu);
	}

	public initModel(model:GameModel)
	{
		super.initModel(model);
		this.addChild(this.gameModel.loading);
		this.gameModel.loading.show(true, "load ui scene assets");
	}

	public startLoading()
	{
		var resources:Array<string> = [
			"res/Login.json"
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
		//2. get the singleton director
		var director:cc.Director = cc.director;
		//get the screen size of your game canvas
		var winSize:cc.Size = director.getWinSize();

		// draw bg
		var bg:cc.DrawNode = new cc.DrawNode();
		this.addChild(bg);
		bg.drawPoly([cc.p(0,0), cc.p(winSize.width, 0), cc.p(winSize.width, winSize.height), cc.p(0,winSize.height)],
			cc.color(0x22, 0x22, 0x22, 255), 1, cc.color(0, 0, 0, 0));

		this.menuItems = [];

		var menu:cc.Sprite = cc.Sprite['create']();
		this.addChild(menu);
		this.menu = menu;

		var itemNames = ["Back", "Exit"];
		itemNames = itemNames.reverse();

		var menuH:number = 0;
		for (var i = 0; i < itemNames.length; i++)
		{
			var tf:cc.LabelTTF = cc.LabelTTF['create'](itemNames[i], "Helvetica", 30);
			var item:cc.Sprite = cc.Sprite['create']();
			// later user for touch hit check
			item['name'] = itemNames[i];
			item['tf'] = tf;
			var s = tf.getContentSize();
			// define local bound of item, used for touch hit detection
			item['localBound'] = cc.rect(-s.width*0.5, -s.height*0.5, s.width, s.height);
			item.addChild(tf);
			item.x = 0;
			item.y = 50*i;
			menu.addChild(item);
			this.menuItems.push(item);
			menuH = item.y + tf.getContentSize().height;
		}

		menu.setContentSize(0, menuH);
		menu.x = winSize.width*0.5;
		menu.y = winSize.height - menu.getContentSize().height - 20;

		var listener:any = {
			event: cc.EventListener.TOUCH_ONE_BY_ONE,
			swallowTouches: true,
			onTouchBegan: this.onMenuTouchBegan.bind(this),
			onTouchEnded : this.onMenuTouchEnded.bind(this)
		};

		this.menuListener = cc.EventListener.create(listener);
		this.menuListener.retain();
		cc.eventManager.addListener(this.menuListener, this.menu);

		// init UI
    var json = ccs.load("res/Login.json");
		this.addChild(json.node);
		var uiView = json.node.getChildByName("view");
		this.uiView = uiView;
		this.uiView.initModel(this.gameModel);
	}

	protected onMenuTouchEnded(touch:cc.Touch, e:cc.Event)
	{
		for (var i = 0; i < this.menuItems.length; i++) this.menuItems[i].tf.setColor(cc.color(0xff,0xff,0xff,255));
		// check item hit
		var item = GameUtils.getItemHit(this.menuItems, touch.getLocation());
		if (!item) return false;
    var tf:cc.LabelTTF = item.tf;

		switch(item.name)
		{
			case "Back":
		    cc.director.runScene(this.gameModel.gameScene);
				break;
			case "Exit":
				cc.director.end();
				break;
		}
		return true;
	}

	protected onMenuTouchBegan(touch:cc.Touch, e:cc.Event)
	{
    // TIP: e.getCurrentTarget() returns the *listener's* sceneGraphPriority node.
		// check item hit
		var item = GameUtils.getItemHit(this.menuItems, touch.getLocation());
		if (!item) return false;
    var tf:cc.LabelTTF = item.tf;
		tf.setColor(cc.color(0x88,0x88,0x88,255));
		return true;
  }
}

this['UIScene'] = game.BaseScene['extend'](new UIScene());
