namespace game
{
  export class BaseScene extends cc.Scene
  {
		public gameModel:GameModel;

		protected deepDestructor(node:cc.Node, deepth:number)
		{
			for (var i = 0; i < node.children.length; i++)
			{
				if (node.children[i]['destructor']) node.children[i]['destructor']();
				this.deepDestructor(node.children[i], deepth+1);
			}
		}

		public destructor()
		{
			this.deepDestructor(this, 0);
		}

    // constructor
    public ctor()
		{
			if (!this._super) return;
			this._super();
			// call destructor for all children
		}

		public initModel(gameModel:any)
		{
      this.gameModel = gameModel;
		}
	}
}

game.BaseScene = cc.Scene['extend'](new game.BaseScene());
