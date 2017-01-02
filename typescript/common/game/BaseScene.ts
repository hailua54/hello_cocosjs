namespace game
{
  export class BaseScene extends cc.Scene
  {
		public gameModel:any;

    // constructor
    public ctor()
		{
			if (!this._super) return;
			this._super();
		}

    // destructor
    public onExit(): void
    {
      super.onExit();
    }

		public initModel(gameModel:any)
		{
      this.gameModel = gameModel;
		}

	}
}

game.BaseScene = cc.Scene['extend'](new game.BaseScene());
