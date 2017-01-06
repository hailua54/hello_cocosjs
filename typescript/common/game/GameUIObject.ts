namespace game
{
  export class GameUIObject extends ccui.Layout
  {
		public gameModel:GameModel;

    // destructor
    public destructor(): void
    {
    }
		
    // constructor
    public ctor()
		{
			if (!this._super) return;
			this._super();
		}

		public initModel(gameModel:any)
		{
      this.gameModel = gameModel;
		}

	}
}

game.GameUIObject = ccui.Layout['extend'](new game.GameUIObject());
