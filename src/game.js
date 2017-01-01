var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
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
    }());
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
    }());
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
    }());
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
    }());
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
    }());
    core.VUtils = VUtils;
})(core || (core = {}));
var game;
(function (game) {
    var BaseGame = (function () {
        function BaseGame() {
        }
        BaseGame.prototype.destructor = function () {
        };
        return BaseGame;
    }());
    game.BaseGame = BaseGame;
})(game || (game = {}));
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
    }(cc.Sprite));
    game.GameObject = GameObject;
})(game || (game = {}));
var Game = (function (_super) {
    __extends(Game, _super);
    function Game() {
        _super.call(this);
        this.init();
    }
    Game.prototype.destructor = function () {
        _super.prototype.destructor.call(this);
    };
    Game.prototype.init = function () {
        this.gameModel = new GameModel();
        this.gameModel.startScene = new StartScene();
        cc.director.runScene(this.gameModel.startScene);
    };
    return Game;
}(game.BaseGame));
var GameModel = (function () {
    function GameModel() {
    }
    return GameModel;
}());
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
    GameScene.prototype.onEnter = function () {
        this._super();
    };
    return GameScene;
}(cc.Scene));
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
    StartScene.prototype.onEnter = function () {
        this._super();
        this.initView();
    };
    StartScene.prototype.initView = function () {
        var director = cc.director;
        var winsize = director.getWinSize();
        var tf = cc.LabelTTF['create']("Play", "Helvetica", 30);
        var playBtn = cc.Sprite['create']();
        playBtn.addChild(tf);
        var menu = cc.Sprite['create']();
        this.addChild(menu);
        menu.x = winsize.width * 0.5;
        menu.y = winsize.height * 0.9;
        menu.addChild(playBtn);
    };
    return StartScene;
}(cc.Scene));
this['StartScene'] = cc.Scene['extend'](new StartScene());
//# sourceMappingURL=game.js.map