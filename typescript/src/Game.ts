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
    if (this.gameModel.startScene) this.gameModel.startScene.release();
    super.destructor();
  }

  public init()
  {
    this.gameModel = new GameModel();
    this.gameModel.startScene = new StartScene();
    this.gameModel.startScene.retain();
    cc.director.runScene(this.gameModel.startScene);
  }
}
