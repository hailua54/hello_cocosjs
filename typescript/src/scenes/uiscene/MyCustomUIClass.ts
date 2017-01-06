class MyCustomUIClass extends game.GameObject
{
	_self:any;

	public ctor()
	{
		// add this code to deal with the draw Object created to pass to Class::extend function
		if (!this._super) return;
		// -------------------------------
		this._super();
	}

	public destructor()
	{
		cc.log("=========== MyCustomUIClass destructor ===========");
		this._super();
	}

	public initModel(gameModel:any)
	{
		super.initModel(gameModel);
		var logoutBtn:any = this.getChildByName("logoutBtn");
		logoutBtn.addClickEventListener(this.onLogoutHdl.bind(this));
		var loginBtn:any = this.getChildByName("loginBtn");
		loginBtn.addClickEventListener(this.onLoginHdl.bind(this));
	}

	protected onLogoutHdl()
	{
		cc.director.end();
	}

	protected onLoginHdl()
	{
		cc.director.runScene(this.gameModel.gameScene);
	}
}

this['MyCustomUIClass'] = game.GameObject['extend'](new MyCustomUIClass());
