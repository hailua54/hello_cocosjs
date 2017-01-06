class MyCustomUIClass extends game.GameUIObject
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
	}

	protected onLogoutHdl()
	{
		cc.director.runScene(this.gameModel.gameScene);
	}
}

this['MyCustomUIClass'] = game.GameUIObject['extend'](new MyCustomUIClass());
