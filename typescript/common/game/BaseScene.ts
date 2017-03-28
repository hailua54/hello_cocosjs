startCCExtend();
namespace game
{
  export class BaseScene extends cc.Scene
  {
		public gameModel:GameModel;

		protected deepDestructor(node:cc.Node)
		{
			for (var i = 0; i < node.children.length; i++)
			{
				if (node.children[i]['destructor']) node.children[i]['destructor']();
				this.deepDestructor(node.children[i]);
			}
		}

    // constructor
    public ctor()
		{
			if (!this._super) return;
			this._super();
		}

		public destructor()
		{
			this.deepDestructor(this);
		}

		public initModel(gameModel:any)
		{
      this.gameModel = gameModel;
		}

		public loadUI() {}

		public orientationHandler() {}

		public sizeHandler() {}
	}
}
endCCExtend();
game.BaseScene = cc.Scene['extend'](new game.BaseScene());
