var __extends = function () { };
var res = eval("res");
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var game;
(function (game) {
    var BaseGame = (function (_super) {
        __extends(BaseGame, _super);
        function BaseGame() {
            _super.apply(this, arguments);
        }
        BaseGame.prototype.ctor = function () {
            if (!this._super)
                return;
            this._super();
            this.initView();
        };
        BaseGame.prototype.initView = function () {
            var size = cc.winSize;
            var helloLabel = new cc.LabelTTF("Hello TypeScript", "Arial", 38);
            helloLabel.x = size.width / 2;
            helloLabel.y = size.height / 2 + 200;
            this.addChild(helloLabel, 5);
            this.helloSprite = new cc.Sprite(res.HelloWorld_png);
            this.helloSprite['attr']({
                x: size.width / 2,
                y: size.height / 2
            });
            this.addChild(this.helloSprite, 0);
        };
        return BaseGame;
    })(cc.Layer);
    game.BaseGame = BaseGame;
})(game || (game = {}));
game.BaseGame = cc.Layer['extend'](new game.BaseGame());
var Main = (function (_super) {
    __extends(Main, _super);
    function Main() {
        _super.apply(this, arguments);
    }
    Main.prototype.ctor = function () {
        if (!this._super)
            return;
        this._super();
    };
    Main.prototype.onEnter = function () {
        this._super();
        var layer = new game.BaseGame();
        this.addChild(layer);
    };
    return Main;
})(cc.Scene);
this['Main'] = cc.Scene['extend'](new Main());
//# sourceMappingURL=game.js.map