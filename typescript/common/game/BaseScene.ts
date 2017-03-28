startCCExtend();
namespace game
{
  export class BaseScene extends cc.Scene
  {
    public vname = "i am BaseScene";
		public gameModel:GameModel;

    constructor()
    {}

    // constructor
    public ctor()
		{
			this._super();
		}

		public destructor()
		{
			this.deepDestructor(this);
		}

    protected deepDestructor(node:cc.Node)
		{
			for (var i = 0; i < node.children.length; i++)
			{
				if (node.children[i]['destructor']) node.children[i]['destructor']();
				this.deepDestructor(node.children[i]);
			}
		}

    public initModel(model:GameModel)
		{
      this.gameModel = model;
		}

		public loadUI() {}

		public orientationHandler() {}

		public sizeHandler() {}
	}
}

endCCExtend();
game.BaseScene = cc.Scene['extend'](new game.BaseScene());
