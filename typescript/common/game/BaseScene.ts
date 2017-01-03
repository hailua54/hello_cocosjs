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

		public destroy()
		{
		}

		public initModel(gameModel:any)
		{
      this.gameModel = gameModel;
		}

		public onExit(): void
	  {
			cc.log("hasNextScene " + cc.director['hasNextScene']());
			if (!cc.director['hasNextScene']())
			{
				this.gameModel.game.destroy();
			}

			this._super();
	  }
	}
}

game.BaseScene = cc.Scene['extend'](new game.BaseScene());
