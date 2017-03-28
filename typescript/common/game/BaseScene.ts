startCCExtend();
namespace game
{
  export class BaseScene extends cc.Scene
  {
    public vname = "i am BaseScene";
		public gameModel:GameModel;

    constructor()
    {}

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

var prop = new game.BaseScene();
cc.log("game.BaseScene here  ==================================================== " + prop.initModel);
game.BaseScene = cc.Scene['extend'](prop);
