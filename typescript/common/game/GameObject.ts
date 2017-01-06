namespace game
{
  export class GameObject extends cc.Node
  {
		public gameModel:GameModel;

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

game.GameObject = cc.Node['extend'](new game.GameObject());
