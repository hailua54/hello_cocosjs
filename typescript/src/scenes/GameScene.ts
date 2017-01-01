class GameScene extends cc.Scene
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
	}
}

this['GameScene'] = cc.Scene['extend'](new GameScene());
