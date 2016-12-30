class Main extends cc.Scene
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
		var layer:game.BaseGame = new game.BaseGame();
		this.addChild(layer);
	}
}

this['Main'] = cc.Scene['extend'](new Main());
