var __extends = function () { };
var res = eval("res");
var TweenLite = eval("TweenLite");
var g_resources = eval("g_resources");
var CANVAS_WIDTH = eval("CANVAS_WIDTH");
var CANVAS_HEIGHT = eval("CANVAS_HEIGHT");
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
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var vcom;
(function (vcom) {
    var BaseComponent = (function (_super) {
        __extends(BaseComponent, _super);
        function BaseComponent() {
            _super.call(this);
        }
        BaseComponent.prototype.setStyle = function (style) {
        };
        return BaseComponent;
    })(cc.Node);
    vcom.BaseComponent = BaseComponent;
})(vcom || (vcom = {}));
vcom.BaseComponent = cc.Node['extend'](new vcom.BaseComponent());
var vcom;
(function (vcom) {
    var ComUtils = (function () {
        function ComUtils() {
        }
        ComUtils.createText = function (str, style) {
            if (style === void 0) { style = null; }
            if (!style)
                style = {};
            var tf = cc.LabelTTF['create'](str, style.fontFamily || null, style.fontSize || 16, style.dimensions || null, style.hAlignment || null, style.vAlignment || null);
            return tf;
        };
        ComUtils.getNumInFormat = function (num, d) {
            if (d === void 0) { d = 2; }
            num = Math.round(num * Math.pow(10, d)) / Math.pow(10, d);
            var sign = num < 0 ? "-" : "";
            num = Math.abs(num);
            var s = num.toString();
            var arr = s.split('.');
            var s0 = arr[0];
            var pre = "";
            var count = 0;
            for (var i = s0.length - 1; i > 0; i--) {
                count++;
                pre = s0.charAt(i) + pre;
                if (count == 3 && i > 0) {
                    pre = ',' + pre;
                    count = 0;
                }
            }
            pre = s0.charAt(0) + pre;
            if (d == 0)
                return sign + pre;
            var zero = "0000000000000000";
            if (arr.length == 1)
                return sign + pre;
            var s1 = String(arr[1]).substr(0, d);
            s1 += zero.substr(0, d - s1.length);
            if (parseInt(s1) > 0)
                return sign + pre + '.' + s1;
            else
                return sign + pre;
        };
        ComUtils.getIntInFormat = function (val, d) {
            if (d === void 0) { d = 2; }
            val = Math.round(val);
            var str = val.toString();
            var zero = "0000000000000000";
            return zero.substr(0, d - str.length) + str;
        };
        return ComUtils;
    })();
    vcom.ComUtils = ComUtils;
})(vcom || (vcom = {}));
var vcom;
(function (vcom) {
    var Loading = (function (_super) {
        __extends(Loading, _super);
        function Loading(bgAlpha) {
            if (bgAlpha === void 0) { bgAlpha = 1; }
            _super.call(this);
            this.bgAlpha = bgAlpha;
        }
        Loading.prototype.ctor = function () {
            if (!this._super)
                return;
            this._super();
            this.bg = new cc.DrawNode();
            this.addChild(this.bg);
            this.anim = new cc.Sprite();
            this.addChild(this.anim);
            var devided = 30;
            var ang = 0;
            var r = 30;
            var total = 360 / devided;
            var ra = 2;
            for (var i = 0; i < total; i++) {
                var circle = new cc.DrawNode();
                this.anim.addChild(circle);
                ra += 0.3;
                if (ra > 5)
                    ra = 5;
                var alpha = 0.1 * (i) * 255;
                circle.drawDot(cc.p(0, 0), ra, cc.color(0xff, 0xff, 0xff, alpha < 255 ? alpha : 255));
                circle.x = r * Math.cos(ang * Math.PI / 180);
                circle.y = r * Math.sin(ang * Math.PI / 180);
                ang -= devided;
            }
            this.tf = vcom.ComUtils.createText('', { fontFamily: "dinbold", fontSize: 20, fontStyle: 'bold', fill: 0xffffff });
            this.addChild(this.tf);
            this.titleTf = vcom.ComUtils.createText('', { fontFamily: "dinbold", fontSize: 12, fontStyle: 'bold', fill: 0xffffff });
            this.addChild(this.titleTf);
        };
        Loading.prototype.onExit = function () {
            this._super();
            this.unscheduleUpdate();
        };
        Loading.prototype.onEnter = function () {
            this._super();
            this.scheduleUpdate();
        };
        Loading.prototype.setSize = function (w, h) {
            var bg = this.bg;
            this.bg.clear();
            bg.drawPoly([cc.p(0, 0), cc.p(w, 0), cc.p(w, h), cc.p(0, h)], new cc.Color(0x22, 0x22, 0x22, this.bgAlpha * 255), 1, new cc.Color(0, 0, 0, 0));
            this.tf.x = w * 0.5;
            this.tf.y = h * 0.5;
            this.titleTf.x = w * 0.5;
            this.titleTf.y = h * 0.5 + 50;
            this.anim.x = w * 0.5;
            this.anim.y = h * 0.5;
        };
        Loading.prototype.update = function (delta) {
            this.anim.rotation += 7;
        };
        Loading.prototype.updatePercent = function (percent) {
            this.tf.setString(vcom.ComUtils.getIntInFormat(percent));
        };
        Loading.prototype.show = function (hasPercent, title, showBg) {
            if (hasPercent === void 0) { hasPercent = true; }
            if (title === void 0) { title = ""; }
            if (showBg === void 0) { showBg = true; }
            if (!showBg)
                this.bg.opacity = 0.1 * 255;
            else
                this.bg.opacity = 1 * 255;
            this.visible = true;
            this.tf.setString("");
            this.tf.visible = hasPercent;
            this.titleTf.setString(title);
        };
        Loading.prototype.hide = function () {
            this.visible = false;
        };
        return Loading;
    })(vcom.BaseComponent);
    vcom.Loading = Loading;
})(vcom || (vcom = {}));
vcom.Loading = vcom.BaseComponent['extend'](new vcom.Loading());
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
var game;
(function (game) {
    var BaseScene = (function (_super) {
        __extends(BaseScene, _super);
        function BaseScene() {
            _super.apply(this, arguments);
        }
        BaseScene.prototype.deepDestructor = function (node) {
            for (var i = 0; i < node.children.length; i++) {
                if (node.children[i]['destructor'])
                    node.children[i]['destructor']();
                this.deepDestructor(node.children[i]);
            }
        };
        BaseScene.prototype.destructor = function () {
            this.deepDestructor(this);
        };
        BaseScene.prototype.ctor = function () {
            if (!this._super)
                return;
            this._super();
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
        GameObject.prototype.destructor = function () {
        };
        GameObject.prototype.onExit = function () {
            _super.prototype.onExit.call(this);
        };
        GameObject.prototype.initModel = function (gameModel) {
            this.gameModel = gameModel;
        };
        return GameObject;
    })(cc.Node);
    game.GameObject = GameObject;
})(game || (game = {}));
game.GameObject = cc.Node['extend'](new game.GameObject());
var Game = (function (_super) {
    __extends(Game, _super);
    function Game() {
        _super.call(this);
        this.init();
    }
    Game.prototype.destructor = function () {
        _super.prototype.destroy.call(this);
        cc.log("====== APP DESTRUCTOR CALLED! ======");
        this.loading.release();
        this.gameModel.startScene.destructor();
        this.gameModel.gameScene.destructor();
        if (this.gameModel.uiScene)
            this.gameModel.uiScene.destructor();
        this.gameModel.startScene.release();
        this.gameModel.gameScene.release();
        if (this.gameModel.uiScene)
            this.gameModel.uiScene.release();
    };
    Game.prototype.init = function () {
        var winSize = cc.director.getWinSize();
        var preloadScene = new cc.Scene();
        this.preloadScene = preloadScene;
        cc.director.runScene(preloadScene);
        var loading = new vcom.Loading(0.5);
        loading.show(true, "Load common assets");
        preloadScene.addChild(loading);
        loading.setSize(winSize.width, winSize.height);
        preloadScene.scheduleOnce(this.startLoading.bind(this), 0.1);
        this.loading = loading;
        loading.retain();
        cc.log("cc.sys.isNative === " + cc.sys.isNative);
        if (!cc.sys.isNative) {
            var container = document.getElementById("Cocos2dGameContainer");
            container.style.display = "none";
            var gameCanvas = document.getElementById("gameCanvas");
            gameCanvas.style.position = 'absolute';
            document.getElementById("mainContainer").appendChild(gameCanvas);
            window.onresize = this.sizeHandler.bind(this);
        }
        else {
        }
        this.sizeHandler();
    };
    Game.prototype.sizeHandler = function () {
        var w, h;
        var debugStr = "";
        if (!cc.sys.isNative) {
            window.scrollTo(0, 1);
            h = GameUtils.getSize("Height") + 1;
            w = GameUtils.getSize("Width");
            var gameCanvas = document.getElementById("gameCanvas");
            gameCanvas.width = w;
            gameCanvas.height = h;
            gameCanvas.style.width = w + 'px';
            gameCanvas.style.height = h + 'px';
        }
        else {
            var winSize = cc.view.getFrameSize();
            w = winSize.width;
            h = winSize.height;
            if (cc.sys.isNative)
                cc.view.setDesignResolutionSize(w, h, cc.ResolutionPolicy.EXACT_FIT);
        }
        cc.log("w ========= " + w);
        cc.log("h ========= " + h);
    };
    Game.prototype.startLoading = function () {
        cc.loader.load(g_resources, this.loadCommonAssetsProgress.bind(this), this.onLoadCommonAssetComplete.bind(this));
    };
    Game.prototype.loadCommonAssetsProgress = function (result, count, loadedCount) {
        var percent = (loadedCount / count * 100) | 0;
        percent = Math.min(percent, 100);
        this.loading.updatePercent(percent);
    };
    Game.prototype.onWindowResize = function () {
        cc.log("onWindowResize === ");
    };
    Game.prototype.onLoadCommonAssetComplete = function () {
        this.preloadScene.removeChild(this.loading);
        this.preloadScene = null;
        this.gameModel = new GameModel();
        this.gameModel.game = this;
        this.gameModel.loading = this.loading;
        this.gameModel.startScene = new StartScene();
        this.gameModel.startScene.initModel(this.gameModel);
        this.gameModel.startScene.retain();
        this.gameModel.gameScene = new GameScene();
        this.gameModel.gameScene.initModel(this.gameModel);
        this.gameModel.gameScene.retain();
        cc.director.runScene(this.gameModel.startScene);
        cc.eventManager.addCustomListener("game_on_exit", this.destructor.bind(this));
        cc.eventManager.addCustomListener("glview_window_resized", this.onWindowResize.bind(this));
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
    GameUtils.getSize = function (Name) {
        var size;
        var name = Name.toLowerCase();
        var document = window.document;
        var documentElement = document.documentElement;
        if (window["inner" + Name] === undefined) {
            size = documentElement["client" + Name];
        }
        else if (window["inner" + Name] !== documentElement["client" + Name]) {
            var bodyElement = document.createElement("body");
            bodyElement.id = "vpw-test-b";
            bodyElement.style.cssText = "overflow:scroll";
            var divElement = document.createElement("div");
            divElement.id = "vpw-test-d";
            divElement.style.cssText = "position:absolute;top:-1000px";
            divElement.innerHTML = "<style>@media(" + name + ":" + documentElement["client" + Name] + "px){body#vpw-test-b div#vpw-test-d{" + name + ":7px!important}}</style>";
            bodyElement.appendChild(divElement);
            documentElement.insertBefore(bodyElement, document.head);
            if (divElement["offset" + Name] === 7) {
                size = documentElement["client" + Name];
            }
            else {
                size = window["inner" + Name];
            }
            documentElement.removeChild(bodyElement);
        }
        else {
            size = window["inner" + Name];
        }
        return size;
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
    GameScene.prototype.destructor = function () {
        this.menuListener.release();
        this._super();
    };
    GameScene.prototype.onExit = function () {
        cc.log("GameScene::onExit ----------------------- ");
        cc.eventManager.removeListener(this.menuListener);
        TweenLite.killTweensOf(this.sprite);
        this._super();
    };
    GameScene.prototype.onEnter = function () {
        cc.log("GameScene::onEnter ----------------------- ");
        this._super();
        cc.eventManager.addListener(this.menuListener, this.menu);
        this.startTween();
    };
    GameScene.prototype.sizeHandler = function () {
    };
    GameScene.prototype.startTween = function () {
        this.sprite.y = 250;
        TweenLite.to(this.sprite, 2, { y: 200, onComplete: this.startTween.bind(this) });
    };
    GameScene.prototype.initModel = function (model) {
        _super.prototype.initModel.call(this, model);
        var director = cc.director;
        var winSize = director.getWinSize();
        var bg = new cc.DrawNode();
        this.addChild(bg);
        bg.drawPoly([cc.p(0, 0), cc.p(winSize.width, 0), cc.p(winSize.width, winSize.height), cc.p(0, winSize.height)], cc.color(0x22, 0x22, 0x22, 255), 1, cc.color(0, 0, 0, 0));
        this.menuItems = [];
        var menu = cc.Sprite['create']();
        this.addChild(menu);
        this.menu = menu;
        var itemNames = ["Next", "Back"];
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
        this.menuListener = cc.EventListener.create(listener);
        this.menuListener.retain();
        var sprite = new cc.Sprite(res.HelloWorld_png);
        sprite.x = winSize.width * 0.5;
        sprite.y = 250;
        this.addChild(sprite);
        this.sprite = sprite;
    };
    GameScene.prototype.onMenuTouchEnded = function (touch, e) {
        for (var i = 0; i < this.menuItems.length; i++)
            this.menuItems[i].tf.setColor(cc.color(0xff, 0xff, 0xff, 255));
        var item = GameUtils.getItemHit(this.menuItems, touch.getLocation());
        if (!item)
            return false;
        var tf = item.tf;
        switch (item.name) {
            case "Next":
                if (!this.gameModel.uiScene) {
                    this.gameModel.uiScene = new UIScene();
                    this.gameModel.uiScene.initModel(this.gameModel);
                    this.gameModel.uiScene.retain();
                }
                cc.director.runScene(this.gameModel.uiScene);
                break;
            case "Back":
                cc.director.runScene(this.gameModel.startScene);
                break;
        }
        return true;
    };
    GameScene.prototype.onMenuTouchBegan = function (touch, e) {
        var item = GameUtils.getItemHit(this.menuItems, touch.getLocation());
        if (!item)
            return false;
        var tf = item.tf;
        tf.setColor(cc.color(0x88, 0x88, 0x88, 255));
        return true;
    };
    return GameScene;
})(game.BaseScene);
this['GameScene'] = game.BaseScene['extend'](new GameScene());
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
    StartScene.prototype.destructor = function () {
        this.menuListener.release();
        this._super();
    };
    StartScene.prototype.onExit = function () {
        cc.log("StartScene::onExit ----------------------- ");
        cc.eventManager.removeListener(this.menuListener);
        this._super();
    };
    StartScene.prototype.onEnter = function () {
        cc.log("StartScene::onEnter ----------------------- ");
        this._super();
        var winSize = cc.director.getWinSize();
        this.bg.drawPoly([cc.p(0, 0), cc.p(winSize.width, 0), cc.p(winSize.width, winSize.height), cc.p(0, winSize.height)], cc.color(0x22, 0x22, 0x22, 255), 1, cc.color(0, 0, 0, 0));
        cc.eventManager.addListener(this.menuListener, this.menu);
    };
    StartScene.prototype.initModel = function (model) {
        _super.prototype.initModel.call(this, model);
        var director = cc.director;
        var winSize = director.getWinSize();
        var bg = new cc.DrawNode();
        this.addChild(bg);
        bg.drawPoly([cc.p(0, 0), cc.p(winSize.width, 0), cc.p(winSize.width, winSize.height), cc.p(0, winSize.height)], cc.color(0x22, 0x22, 0x22, 255), 1, cc.color(0, 0, 0, 0));
        this.bg = bg;
        this.menuItems = [];
        var menu = cc.Sprite['create']();
        this.addChild(menu);
        this.menu = menu;
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
        this.menuListener = cc.EventListener.create(listener);
        this.menuListener.retain();
    };
    StartScene.prototype.onMenuTouchEnded = function (touch, e) {
        for (var i = 0; i < this.menuItems.length; i++)
            this.menuItems[i].tf.setColor(cc.color(0xff, 0xff, 0xff, 255));
        var item = GameUtils.getItemHit(this.menuItems, touch.getLocation());
        if (!item)
            return false;
        var tf = item.tf;
        switch (item.name) {
            case "Play":
                cc.director.runScene(this.gameModel.gameScene);
                break;
            case "Exit":
                cc.log("Exit");
                cc.director.end();
                break;
        }
        return true;
    };
    StartScene.prototype.onMenuTouchBegan = function (touch, e) {
        var item = GameUtils.getItemHit(this.menuItems, touch.getLocation());
        if (!item)
            return false;
        var tf = item.tf;
        tf.setColor(cc.color(0x88, 0x88, 0x88, 255));
        return true;
    };
    return StartScene;
})(game.BaseScene);
this['StartScene'] = game.BaseScene['extend'](new StartScene());
var UIScene = (function (_super) {
    __extends(UIScene, _super);
    function UIScene() {
        _super.apply(this, arguments);
    }
    UIScene.prototype.ctor = function () {
        if (!this._super)
            return;
        this._super();
    };
    UIScene.prototype.destructor = function () {
        if (this.menuListener)
            this.menuListener.release();
        this._super();
    };
    UIScene.prototype.onExit = function () {
        cc.log("StartScene::onExit ----------------------- ");
        if (this.menuListener)
            cc.eventManager.removeListener(this.menuListener);
        this._super();
    };
    UIScene.prototype.onEnter = function () {
        cc.log("StartScene::onEnter ----------------------- ");
        this._super();
        if (!this.isInited) {
            this.scheduleOnce(this.startLoading.bind(this), 0.1);
            return;
        }
        if (this.menuListener)
            cc.eventManager.addListener(this.menuListener, this.menu);
    };
    UIScene.prototype.initModel = function (model) {
        _super.prototype.initModel.call(this, model);
        this.addChild(this.gameModel.loading);
        this.gameModel.loading.show(true, "load ui scene assets");
    };
    UIScene.prototype.startLoading = function () {
        var resources = [
            "res/Login.json"
        ];
        cc.loader.load(resources, this.loadAssetsProgress.bind(this), this.onLoadAssetComplete.bind(this));
    };
    UIScene.prototype.loadAssetsProgress = function (result, count, loadedCount) {
        var percent = (loadedCount / count * 100) | 0;
        percent = Math.min(percent, 100);
        this.gameModel.loading.updatePercent(percent);
    };
    UIScene.prototype.onLoadAssetComplete = function () {
        this.removeChild(this.gameModel.loading);
        this.isInited = true;
        var director = cc.director;
        var winSize = director.getWinSize();
        var bg = new cc.DrawNode();
        this.addChild(bg);
        bg.drawPoly([cc.p(0, 0), cc.p(winSize.width, 0), cc.p(winSize.width, winSize.height), cc.p(0, winSize.height)], cc.color(0x22, 0x22, 0x22, 255), 1, cc.color(0, 0, 0, 0));
        var json = ccs.load("res/Login.json");
        this.addChild(json.node);
        var uiView = json.node.getChildByName("view");
        this.uiView = uiView;
        this.uiView.initModel(this.gameModel);
    };
    UIScene.prototype.onMenuTouchEnded = function (touch, e) {
        for (var i = 0; i < this.menuItems.length; i++)
            this.menuItems[i].tf.setColor(cc.color(0xff, 0xff, 0xff, 255));
        var item = GameUtils.getItemHit(this.menuItems, touch.getLocation());
        if (!item)
            return false;
        var tf = item.tf;
        switch (item.name) {
            case "Back":
                cc.director.runScene(this.gameModel.gameScene);
                break;
            case "Exit":
                cc.director.end();
                break;
        }
        return true;
    };
    UIScene.prototype.onMenuTouchBegan = function (touch, e) {
        var item = GameUtils.getItemHit(this.menuItems, touch.getLocation());
        if (!item)
            return false;
        var tf = item.tf;
        tf.setColor(cc.color(0x88, 0x88, 0x88, 255));
        return true;
    };
    return UIScene;
})(game.BaseScene);
this['UIScene'] = game.BaseScene['extend'](new UIScene());
var MyCustomUIClass = (function (_super) {
    __extends(MyCustomUIClass, _super);
    function MyCustomUIClass() {
        _super.apply(this, arguments);
    }
    MyCustomUIClass.prototype.ctor = function () {
        if (!this._super)
            return;
        this._super();
    };
    MyCustomUIClass.prototype.destructor = function () {
        cc.log("=========== MyCustomUIClass destructor ===========");
        this._super();
    };
    MyCustomUIClass.prototype.initModel = function (gameModel) {
        _super.prototype.initModel.call(this, gameModel);
        var logoutBtn = this.getChildByName("logoutBtn");
        logoutBtn.addClickEventListener(this.onLogoutHdl.bind(this));
        var loginBtn = this.getChildByName("loginBtn");
        loginBtn.addClickEventListener(this.onLoginHdl.bind(this));
    };
    MyCustomUIClass.prototype.onLogoutHdl = function () {
        cc.director.end();
    };
    MyCustomUIClass.prototype.onLoginHdl = function () {
        cc.director.runScene(this.gameModel.gameScene);
    };
    return MyCustomUIClass;
})(game.GameObject);
this['MyCustomUIClass'] = game.GameObject['extend'](new MyCustomUIClass());
//# sourceMappingURL=game.js.map