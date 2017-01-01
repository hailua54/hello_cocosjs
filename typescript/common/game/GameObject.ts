namespace game
{
  export class GameObject extends cc.Sprite
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
      core.VUtils.cleanObj(this);
    }

		public initModel(gameModel:GameModel)
		{
      this.gameModel = gameModel;
		}

	}
}
