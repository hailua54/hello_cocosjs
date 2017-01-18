namespace game
{
  export class LayoutObject extends ccui.Layout
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

game.LayoutObject = ccui.Layout['extend'](new game.LayoutObject());
