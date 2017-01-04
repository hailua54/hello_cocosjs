namespace game
{
  export class BaseScene extends cc.Scene
  {
		public gameModel:GameModel;

    // constructor
    public ctor()
		{
			if (!this._super) return;
			this._super();
		}

		public destructor()
		{
		}

		public initModel(gameModel:any)
		{
      this.gameModel = gameModel;
		}
	}
}

game.BaseScene = cc.Scene['extend'](new game.BaseScene());
