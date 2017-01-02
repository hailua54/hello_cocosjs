class Game extends game.BaseGame
{
  public gameModel:GameModel;
  constructor()
  {
    super();
    this.init();
  }

  public destroy()
	{
		super.destroy();
		// release all referenced/listener to root ---
		//...
		// -------------------------------------------
		cc.director.end();
	}

  public init()
  {
    this.gameModel = new GameModel();
		this.gameModel.game = this;

    this.gameModel.startScene = new StartScene();
		this.gameModel.startScene.initModel(this.gameModel);

		this.gameModel.gameScene = new GameScene();
		this.gameModel.gameScene.initModel(this.gameModel);
    //NOTE:
    // No need to use this.gameModel.startScene.retain()
    // startScene is already retain/release by 'Marking-Sweeping phases' of GC (check reachable from root)
    // -----------------
    cc.director.runScene(this.gameModel.startScene);
  }
}
