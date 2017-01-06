class GameScene extends game.BaseScene
{
	menuListener:cc.EventListener;
	menuItems:Array<any>;
	menu:any;
	sprite:cc.Sprite;
	
	public ctor()
	{
		// add this code to deal with the draw Object created to pass to Class::extend function
		if (!this._super) return;
		// -------------------------------
		this._super();
	}

	public destructor()
	{
		this.menuListener.release();
		this._super();
	}

  public onExit(): void
  {
		cc.log("GameScene::onExit ----------------------- ");
		cc.eventManager.removeListener(this.menuListener);
		TweenLite.killTweensOf(this.sprite);
		// should call as the last code line to destroy app
		this._super();
  }

	// override here
	public onEnter():void
	{
		cc.log("GameScene::onEnter ----------------------- ");
		this._super();
		cc.eventManager.addListener(this.menuListener, this.menu);
		this.startTween();
	}

	private startTween()
	{
		this.sprite.y = 250;
		TweenLite.to(this.sprite, 2, {y:200, onComplete:this.startTween.bind(this)});
	}

	public initModel(model:GameModel)
	{
		super.initModel(model);
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

		var itemNames = ["Next", "Back"];
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

		this.menuListener = cc.EventListener.create(listener);
		this.menuListener.retain();

		// add "HelloWorld" splash screen"
		var sprite = new cc.Sprite(res.HelloWorld_png);
		sprite.x = winSize.width*0.5;
		sprite.y = 250;
		this.addChild(sprite);

		this.sprite = sprite;
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
			case "Next":
				if (!this.gameModel.uiScene)
				{
					this.gameModel.uiScene = new UIScene();
					this.gameModel.uiScene.initModel(this.gameModel);
					this.gameModel.uiScene.retain();
				}
		    cc.director.runScene(this.gameModel.uiScene);
				break;
			case "Back":
				cc.director.runScene(this.gameModel.startScene);
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

this['GameScene'] = game.BaseScene['extend'](new GameScene());
