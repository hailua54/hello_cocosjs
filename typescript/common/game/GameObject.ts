startCCExtend();
namespace game
{
  export class GameObject extends cc.Node
  {
		public gameModel:GameModel;

    // constructor
    constructor()
    {
    }
    
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
endCCExtend();
game.GameObject = cc.Node['extend'](new game.GameObject());
