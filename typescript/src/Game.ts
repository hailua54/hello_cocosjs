class Game extends game.BaseGame
{
  public gameModel:GameModel;
	public activeScene:cc.Scene;

  constructor()
  {
    super();
    this.init();
  }

  public destructor()
	{
		super.destroy();
		cc.log("====== APP DESTRUCTOR CALLED! ======");
		// release all referenced/listener to root ---
		this.gameModel.startScene.destructor();
		this.gameModel.gameScene.destructor();
		this.gameModel.startScene.release();
		this.gameModel.gameScene.release();
		// -------------------------------------------
	}

  public init()
  {
    this.gameModel = new GameModel();
		this.gameModel.game = this;

    this.gameModel.startScene = new StartScene();
		this.gameModel.startScene.initModel(this.gameModel);
		this.gameModel.startScene.retain();

		this.gameModel.gameScene = new GameScene();
		this.gameModel.gameScene.initModel(this.gameModel);
		this.gameModel.gameScene.retain();

    cc.director.runScene(this.gameModel.startScene);

		cc.eventManager.addCustomListener("game_on_exit", this.destructor.bind(this));
  }

}
