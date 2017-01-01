class Game extends game.BaseGame
{
  public gameModel:GameModel;
  constructor()
  {
    super();
    this.init();
  }

  public destructor()
  {
    super.destructor();
  }

  public init()
  {
    this.gameModel = new GameModel();
    this.gameModel.startScene = new StartScene();
    //NOTE:
    // No need to use this.gameModel.startScene.retain()
    // startScene is already retain/release by 'Marking-Sweeping phases' of GC (check reachable from root)
    // -----------------
    cc.director.runScene(this.gameModel.startScene);
  }
}
