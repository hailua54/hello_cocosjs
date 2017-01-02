class StartScene extends cc.Scene
{
	gameModel:GameModel;
	menuListener:any;
	menuItems:Array<any>;
	public ctor()
	{
		// add this code to deal with the draw Object created to pass to Class::extend function
		if (!this._super) return;
		// -------------------------------
		this._super();
	}

  // destructor
  public onExit(): void
  {
		cc.log("StartScene::onExit ----------------------- ");
    super.onExit();
		cc.eventManager.removeListener(this.menuListener);
    core.VUtils.cleanObj(this);
  }

	// override here
	public onEnter():void
	{
		cc.log("StartScene::onEnter ----------------------- ");
		this._super();
	}

	public initModel(model:GameModel)
	{
		this.gameModel = model;
		//2. get the singleton director
		var director:cc.Director = cc.director;
		//get the screen size of your game canvas
		var winSize:cc.Size = director.getWinSize();

		// draw bg
		var bg:cc.DrawNode = new cc.DrawNode();
		this.addChild(bg);
		bg.drawPoly([cc.p(0,0), cc.p(winSize.width, 0), cc.p(winSize.width, winSize.height), cc.p(0,winSize.height)],
			new cc.Color(0x22, 0x22, 0x22, 255), 1, new cc.Color(0, 0, 0, 0));

		this.menuItems = [];

		var menu:cc.Sprite = cc.Sprite['create']();
		this.addChild(menu);

		var itemNames = ["Play", "Exit"];
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
		menu.y = winSize.height*0.9 - menu.getContentSize().height;

		var listener:any = {
			event: cc.EventListener.TOUCH_ONE_BY_ONE,
			swallowTouches: true,
			onTouchBegan: this.onMenuTouchBegan.bind(this),
			onTouchEnded : this.onMenuTouchEnded.bind(this)
		};

		this.menuListener = listener;
		cc.eventManager.addListener(listener, menu);

	}

	protected onMenuTouchEnded(touch:cc.Touch, e:cc.Event)
	{
		for (var i = 0; i < this.menuItems.length; i++) this.menuItems[i].tf.setColor(new cc.Color(0xff,0xff,0xff,255));
		// check item hit
		var item = GameUtils.getItemHit(this.menuItems, touch.getLocation());
		if (!item) return false;
    var tf:cc.LabelTTF = item.tf;

		switch(item.name)
		{
			case "Play":
				cc.log("Play");
				cc.director.runScene(this.gameModel.gameScene);
				break;
			case "Exit":
				cc.log("Exit");
				this.gameModel.game.destroy();
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
		tf.setColor(new cc.Color(0x88,0x88,0x88,255));
		return true;
  }
}

this['StartScene'] = cc.Scene['extend'](new StartScene());
