class StartScene extends cc.Scene
{
	public ctor()
	{
		// add this code to deal with the draw Object created to pass to Class::extend function
		if (!this._super) return;
		// -------------------------------
		this._super();
	}

	// override here
	public onEnter():void
	{
		this._super();
		this.initView();
	}

	public initView()
	{
    //2. get the singleton director
    var director:cc.Director = cc.director;
    //get the screen size of your game canvas
    var winsize:cc.Size = director.getWinSize();

		var tf:cc.LabelTTF = cc.LabelTTF['create']("Play", "Helvetica", 30);
		var playBtn:cc.Sprite = cc.Sprite['create']();
		playBtn.setAnchorPoint(new cc.Point(0.5, 0));
		playBtn.addChild(tf);

		var menu:cc.Sprite = cc.Sprite['create']();
    this.addChild(menu);
		menu.x = winsize.width*0.5;
		menu.y = winsize.height - 100;
		menu.addChild(playBtn);
	}
}


this['StartScene'] = cc.Scene['extend'](new StartScene());
