startCCExtend();
class MyCustomUIClass extends game.LayoutObject
{

	constructor(){}
	
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
endCCExtend();
this['MyCustomUIClass'] = game.LayoutObject['extend'](new MyCustomUIClass());
