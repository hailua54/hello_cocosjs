var __extends = function () { };
var res = eval("res");
var g_resources = eval("g_resources");
var core;
(function (core) {
    var VBaseEvent = (function () {
        function VBaseEvent() {
            this.data = null;
            this.type = "";
            this.target = null;
            this.currentTarget = null;
            this.stopsPropagation = false;
            this.stopsImmediatePropagation = false;
        }
        VBaseEvent.prototype.init = function (type, data) {
            this.type = type;
            this.data = data;
            return this;
        };
        VBaseEvent.prototype.clean = function () {
            this.data = null;
            this.type = "";
            this.target = null;
            this.currentTarget = null;
            this.stopsPropagation = false;
            this.stopsImmediatePropagation = false;
        };
        return VBaseEvent;
    })();
    core.VBaseEvent = VBaseEvent;
})(core || (core = {}));
var core;
(function (core) {
    var VEventDispatcher = (function () {
        function VEventDispatcher() {
            this.addEventListener = function (type, listener, context) {
                if (this.mEventListeners == null)
                    this.mEventListeners = {};
                var listeners = this.mEventListeners[type];
                if (listeners == null) {
                    this.mEventListeners[type] = [];
                    listeners = this.mEventListeners[type];
                }
                if (!this.hasEventListener(type, listener, context))
                    listeners[listeners.length] = core.VObjectPool.get(core.VListenerBinding).init(listener, context);
            };
            this.mEventListeners = null;
        }
        ;
        VEventDispatcher.prototype.removeEventListener = function (type, listener, context) {
            if (this.mEventListeners) {
                var listenerBindings = this.mEventListeners[type];
                var numListeners = listenerBindings ? listenerBindings.length : 0;
                if (numListeners > 0) {
                    var index = 0;
                    var tempListenerBindings = new Array(numListeners - 1);
                    for (var i = 0; i < numListeners; ++i) {
                        var otherListener = listenerBindings[i];
                        if (!otherListener.has(listener, context))
                            tempListenerBindings[index++] = otherListener;
                        else
                            core.VObjectPool.release(otherListener, core.VListenerBinding);
                    }
                    this.mEventListeners[type] = tempListenerBindings;
                }
            }
        };
        VEventDispatcher.prototype.removeAllEventListeners = function (type) {
            if (type === void 0) { type = null; }
            if (type && this.mEventListeners) {
                for (var i = 0; i < this.mEventListeners[type].length; ++i)
                    core.VObjectPool.release(this.mEventListeners[type][i], core.VListenerBinding);
                delete this.mEventListeners[type];
            }
            else {
                for (var ty in this.mEventListeners) {
                    if (this.mEventListeners[ty]) {
                        for (var i = 0; i < this.mEventListeners[ty].length; ++i)
                            core.VObjectPool.release(this.mEventListeners[ty][i], core.VListenerBinding);
                        delete this.mEventListeners[ty];
                    }
                }
                this.mEventListeners = null;
            }
        };
        ;
        VEventDispatcher.prototype.dispatchEvent = function (event) {
            if ((this.mEventListeners == null || !(event.type in this.mEventListeners)))
                return;
            var previousTarget = event.target;
            event.target = this;
            this.invokeEvent(event);
            if (previousTarget)
                event.target = previousTarget;
        };
        ;
        VEventDispatcher.prototype.invokeEvent = function (event) {
            var listenerBindings = this.mEventListeners ? this.mEventListeners[event.type] : null;
            var numListeners = listenerBindings == null ? 0 : listenerBindings.length;
            if (numListeners) {
                event.currentTarget = this;
                for (var i = 0; i < numListeners; ++i) {
                    var binding = listenerBindings[i];
                    var numArgs = binding.listener.length;
                    if (numArgs == 0)
                        binding.listener.call(binding.context);
                    else if (numArgs == 1)
                        binding.listener.call(binding.context, event);
                    if (event.stopsImmediatePropagation)
                        return true;
                }
                return event.stopsPropagation;
            }
            else {
                return false;
            }
        };
        ;
        VEventDispatcher.prototype.dispatchEventWith = function (type, data) {
            if (data === void 0) { data = null; }
            var event = core.VObjectPool.get(core.VBaseEvent);
            event.type = type;
            event.data = data;
            this.dispatchEvent(event);
            core.VObjectPool.release(event, core.VBaseEvent);
        };
        ;
        VEventDispatcher.prototype.hasEventListener = function (type, listener, context) {
            if (!this.mEventListeners)
                return false;
            if (!this.mEventListeners[type])
                return false;
            var listeners = this.mEventListeners[type];
            for (var i = 0; i < listeners.length; i++) {
                if (listeners[i].listener === listener && listeners[i].context === context)
                    return true;
            }
            return false;
        };
        ;
        return VEventDispatcher;
    })();
    core.VEventDispatcher = VEventDispatcher;
})(core || (core = {}));
var core;
(function (core) {
    var VListenerBinding = (function () {
        function VListenerBinding() {
        }
        VListenerBinding.prototype.init = function (listener, context) {
            this.listener = listener;
            this.context = context;
            return this;
        };
        VListenerBinding.prototype.has = function (listener, context) {
            return this.listener === listener && this.context === context;
        };
        VListenerBinding.prototype.clean = function () {
            this.listener = null;
            this.context = null;
        };
        return VListenerBinding;
    })();
    core.VListenerBinding = VListenerBinding;
})(core || (core = {}));
var core;
(function (core) {
    var VObjectPool = (function () {
        function VObjectPool() {
            this.MAX_OBJECT = 1000;
            this.pool = {};
        }
        VObjectPool.get = function (typeClass) {
            return VObjectPool.instance.get(typeClass);
        };
        VObjectPool.release = function (obj, typeClass) {
            return VObjectPool.instance.release(obj, typeClass);
        };
        VObjectPool.prototype.get = function (typeClass) {
            if (!this.pool[core.VUtils.getObjKey(typeClass)])
                this.pool[core.VUtils.getObjKey(typeClass)] = [];
            if (this.pool[core.VUtils.getObjKey(typeClass)].length == 0) {
                return new typeClass();
            }
            return this.pool[core.VUtils.getObjKey(typeClass)].pop();
        };
        VObjectPool.prototype.release = function (obj, typeClass) {
            if (!this.pool[core.VUtils.getObjKey(typeClass)])
                this.pool[core.VUtils.getObjKey(typeClass)] = [];
            if (obj[core.VUtils.getObjKeyName()])
                delete obj[core.VUtils.getObjKeyName()];
            if (!core.VUtils.isNull(obj.clean))
                obj.clean();
            if (this.pool[core.VUtils.getObjKey(typeClass)].length == this.MAX_OBJECT) {
                if (obj.destroy) {
                    obj.destroy.length ? obj.destroy(true) : obj.destroy();
                }
                return false;
            }
            this.pool[core.VUtils.getObjKey(typeClass)].push(obj);
            return true;
        };
        VObjectPool.prototype.clearAll = function () {
            var obj;
            for (var type in this.pool) {
                for (var i = 0; i < this.pool[type].length; i++) {
                    obj = this.pool[type][i];
                    if (obj.clean)
                        obj.clean();
                    if (obj.destroy)
                        obj.destroy.length ? obj.destroy(true) : obj.destroy();
                }
                delete this.pool[type];
            }
            this.pool = null;
        };
        VObjectPool.instance = new VObjectPool();
        return VObjectPool;
    })();
    core.VObjectPool = VObjectPool;
})(core || (core = {}));
var core;
(function (core) {
    var VUtils = (function () {
        function VUtils() {
        }
        VUtils.isNull = function (object) {
            return (object === null || object === undefined);
        };
        VUtils.removeElementFromArray = function (arr, e) {
            for (var i = 0; i < arr.length; i++) {
                if (arr[i] === e) {
                    arr.splice(i, 1);
                    return;
                }
            }
        };
        VUtils.getObjKey = function (obj) {
            if (obj["__vSysObjKey__"])
                return obj["__vSysObjKey__"];
            else {
                return obj["__vSysObjKey__"] = "vSysObjKey_" + Math.random() * 2147483647 + "_" + new Date().getTime();
            }
        };
        VUtils.getObjKeyName = function () {
            return "__vSysObjKey__";
        };
        VUtils.copy = function (source, des) {
            if (!des) {
                var i = 1;
            }
            for (var attr in source) {
                if (source.hasOwnProperty(attr))
                    des[attr] = source[attr];
            }
        };
        VUtils.copyClass = function (source, des) {
            for (var attr in source) {
                if (source.hasOwnProperty(attr))
                    des[attr] = source[attr];
            }
        };
        VUtils.cleanObj = function (obj) {
            for (var i in obj)
                delete obj[i];
        };
        return VUtils;
    })();
    core.VUtils = VUtils;
})(core || (core = {}));
var game;
(function (game) {
    var BaseGame = (function () {
        function BaseGame() {
        }
        BaseGame.prototype.destroy = function () {
        };
        return BaseGame;
    })();
    game.BaseGame = BaseGame;
})(game || (game = {}));
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var game;
(function (game) {
    var BaseScene = (function (_super) {
        __extends(BaseScene, _super);
        function BaseScene() {
            _super.apply(this, arguments);
        }
        BaseScene.prototype.ctor = function () {
            if (!this._super)
                return;
            this._super();
        };
        BaseScene.prototype.onExit = function () {
            _super.prototype.onExit.call(this);
        };
        BaseScene.prototype.initModel = function (gameModel) {
            this.gameModel = gameModel;
        };
        return BaseScene;
    })(cc.Scene);
    game.BaseScene = BaseScene;
})(game || (game = {}));
game.BaseScene = cc.Scene['extend'](new game.BaseScene());
var game;
(function (game) {
    var GameObject = (function (_super) {
        __extends(GameObject, _super);
        function GameObject() {
            _super.apply(this, arguments);
        }
        GameObject.prototype.ctor = function () {
            if (!this._super)
                return;
            this._super();
        };
        GameObject.prototype.onExit = function () {
            _super.prototype.onExit.call(this);
            core.VUtils.cleanObj(this);
        };
        GameObject.prototype.initModel = function (gameModel) {
            this.gameModel = gameModel;
        };
        return GameObject;
    })(cc.Sprite);
    game.GameObject = GameObject;
})(game || (game = {}));
var Game = (function (_super) {
    __extends(Game, _super);
    function Game() {
        _super.call(this);
        this.init();
    }
    Game.prototype.destroy = function () {
        _super.prototype.destroy.call(this);
        cc.director.end();
    };
    Game.prototype.init = function () {
        this.gameModel = new GameModel();
        this.gameModel.game = this;
        this.gameModel.startScene = new StartScene();
        this.gameModel.startScene.initModel(this.gameModel);
        this.gameModel.gameScene = new GameScene();
        this.gameModel.gameScene.initModel(this.gameModel);
        cc.director.runScene(this.gameModel.startScene);
    };
    return Game;
})(game.BaseGame);
var GameModel = (function () {
    function GameModel() {
    }
    return GameModel;
})();
var GameUtils = (function () {
    function GameUtils() {
    }
    GameUtils.getItemHit = function (items, touchPos) {
        for (var i = 0; i < items.length; i++) {
            var item = items[i];
            var mp = item.convertToNodeSpace(touchPos);
            var r = item.localBound;
            var rect = cc.rect(r.x, r.y, r.width, r.height);
            if (cc.rectContainsPoint(rect, mp))
                return item;
        }
        return null;
    };
    return GameUtils;
})();
var GameScene = (function (_super) {
    __extends(GameScene, _super);
    function GameScene() {
        _super.apply(this, arguments);
    }
    GameScene.prototype.ctor = function () {
        if (!this._super)
            return;
        this._super();
    };
    GameScene.prototype.onExit = function () {
        cc.log("GameScene::onExit ----------------------- ");
        _super.prototype.onExit.call(this);
        cc.eventManager.removeListener(this.menuListener);
        core.VUtils.cleanObj(this);
    };
    GameScene.prototype.onEnter = function () {
        cc.log("GameScene::onEnter ----------------------- ");
        this._super();
    };
    GameScene.prototype.initModel = function (model) {
        this.gameModel = model;
        var director = cc.director;
        var winSize = director.getWinSize();
        var bg = new cc.DrawNode();
        this.addChild(bg);
        bg.drawPoly([cc.p(0, 0), cc.p(winSize.width, 0), cc.p(winSize.width, winSize.height), cc.p(0, winSize.height)], new cc.Color(0x22, 0x22, 0x22, 255), 1, new cc.Color(0, 0, 0, 0));
        this.menuItems = [];
        var menu = cc.Sprite['create']();
        this.addChild(menu);
        var itemNames = ["Back", "Exit"];
        itemNames = itemNames.reverse();
        var menuH = 0;
        for (var i = 0; i < itemNames.length; i++) {
            var tf = cc.LabelTTF['create'](itemNames[i], "Helvetica", 30);
            var item = cc.Sprite['create']();
            item['name'] = itemNames[i];
            item['tf'] = tf;
            var s = tf.getContentSize();
            item['localBound'] = cc.rect(-s.width * 0.5, -s.height * 0.5, s.width, s.height);
            item.addChild(tf);
            item.x = 0;
            item.y = 50 * i;
            menu.addChild(item);
            this.menuItems.push(item);
            menuH = item.y + tf.getContentSize().height;
        }
        menu.setContentSize(0, menuH);
        menu.x = winSize.width * 0.5;
        menu.y = winSize.height * 0.9 - menu.getContentSize().height;
        var listener = {
            event: cc.EventListener.TOUCH_ONE_BY_ONE,
            swallowTouches: true,
            onTouchBegan: this.onMenuTouchBegan.bind(this),
            onTouchEnded: this.onMenuTouchEnded.bind(this)
        };
        this.menuListener = listener;
        cc.eventManager.addListener(listener, menu);
    };
    GameScene.prototype.onMenuTouchEnded = function (touch, e) {
        for (var i = 0; i < this.menuItems.length; i++)
            this.menuItems[i].tf.setColor(new cc.Color(0xff, 0xff, 0xff, 255));
        var item = GameUtils.getItemHit(this.menuItems, touch.getLocation());
        if (!item)
            return false;
        var tf = item.tf;
        switch (item.name) {
            case "Back":
                cc.director.runScene(this.gameModel.startScene);
                break;
            case "Exit":
                cc.log("Exit");
                this.gameModel.game.destroy();
                break;
        }
        return true;
    };
    GameScene.prototype.onMenuTouchBegan = function (touch, e) {
        var item = GameUtils.getItemHit(this.menuItems, touch.getLocation());
        if (!item)
            return false;
        var tf = item.tf;
        tf.setColor(new cc.Color(0x88, 0x88, 0x88, 255));
        return true;
    };
    return GameScene;
})(cc.Scene);
this['GameScene'] = cc.Scene['extend'](new GameScene());
var StartScene = (function (_super) {
    __extends(StartScene, _super);
    function StartScene() {
        _super.apply(this, arguments);
    }
    StartScene.prototype.ctor = function () {
        if (!this._super)
            return;
        this._super();
    };
    StartScene.prototype.onExit = function () {
        cc.log("StartScene::onExit ----------------------- ");
        _super.prototype.onExit.call(this);
        cc.eventManager.removeListener(this.menuListener);
        core.VUtils.cleanObj(this);
    };
    StartScene.prototype.onEnter = function () {
        cc.log("StartScene::onEnter ----------------------- ");
        this._super();
    };
    StartScene.prototype.initModel = function (model) {
        this.gameModel = model;
        var director = cc.director;
        var winSize = director.getWinSize();
        var bg = new cc.DrawNode();
        this.addChild(bg);
        bg.drawPoly([cc.p(0, 0), cc.p(winSize.width, 0), cc.p(winSize.width, winSize.height), cc.p(0, winSize.height)], new cc.Color(0x22, 0x22, 0x22, 255), 1, new cc.Color(0, 0, 0, 0));
        this.menuItems = [];
        var menu = cc.Sprite['create']();
        this.addChild(menu);
        var itemNames = ["Play", "Exit"];
        itemNames = itemNames.reverse();
        var menuH = 0;
        for (var i = 0; i < itemNames.length; i++) {
            var tf = cc.LabelTTF['create'](itemNames[i], "Helvetica", 30);
            var item = cc.Sprite['create']();
            item['name'] = itemNames[i];
            item['tf'] = tf;
            var s = tf.getContentSize();
            item['localBound'] = cc.rect(-s.width * 0.5, -s.height * 0.5, s.width, s.height);
            item.addChild(tf);
            item.x = 0;
            item.y = 50 * i;
            menu.addChild(item);
            this.menuItems.push(item);
            menuH = item.y + tf.getContentSize().height;
        }
        menu.setContentSize(0, menuH);
        menu.x = winSize.width * 0.5;
        menu.y = winSize.height * 0.9 - menu.getContentSize().height;
        var listener = {
            event: cc.EventListener.TOUCH_ONE_BY_ONE,
            swallowTouches: true,
            onTouchBegan: this.onMenuTouchBegan.bind(this),
            onTouchEnded: this.onMenuTouchEnded.bind(this)
        };
        this.menuListener = listener;
        cc.eventManager.addListener(listener, menu);
    };
    StartScene.prototype.onMenuTouchEnded = function (touch, e) {
        for (var i = 0; i < this.menuItems.length; i++)
            this.menuItems[i].tf.setColor(new cc.Color(0xff, 0xff, 0xff, 255));
        var item = GameUtils.getItemHit(this.menuItems, touch.getLocation());
        if (!item)
            return false;
        var tf = item.tf;
        switch (item.name) {
            case "Play":
                cc.log("Play");
                cc.director.runScene(this.gameModel.gameScene);
                break;
            case "Exit":
                cc.log("Exit");
                this.gameModel.game.destroy();
                break;
        }
        return true;
    };
    StartScene.prototype.onMenuTouchBegan = function (touch, e) {
        var item = GameUtils.getItemHit(this.menuItems, touch.getLocation());
        if (!item)
            return false;
        var tf = item.tf;
        tf.setColor(new cc.Color(0x88, 0x88, 0x88, 255));
        return true;
    };
    return StartScene;
})(cc.Scene);
this['StartScene'] = cc.Scene['extend'](new StartScene());
//# sourceMappingURL=game.js.map