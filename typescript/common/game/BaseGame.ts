namespace game
{
	export class BaseGame extends cc.Layer
	{
		public helloSprite:cc.Sprite;
		// constructor
		public ctor()
		{
			if (!this._super) return;
			this._super();
			this.initView();
		}

		protected initView()
		{
			/////////////////////////////
			// 2. add a menu item with "X" image, which is clicked to quit the program
			//    you may modify it.
			// ask the window size
			var size = cc.winSize;

			/////////////////////////////
			// 3. add your codes below...
			// add a label shows "Hello World"
			// create and initialize a label
			var helloLabel = new cc.LabelTTF("Hello TypeScript", "Arial", 38);
			// position the label on the center of the screen
			helloLabel.x = size.width / 2;
			helloLabel.y = size.height / 2 + 200;
			// add the label as a child to this layer
			this.addChild(helloLabel, 5);

			// add "HelloWorld" splash screen"
			this.helloSprite = new cc.Sprite(res.HelloWorld_png);
			this.helloSprite['attr']({
					x: size.width / 2,
					y: size.height / 2
			});
			this.addChild(this.helloSprite, 0);
		}

	} // class
} // namespace
game.BaseGame = cc.Layer['extend'](new game.BaseGame());
