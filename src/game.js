var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
function startCCExtend() { this['org_extends'] = this['__extends']; this['__extends'] = function () { }; }
function endCCExtend() { this['__extends'] = this['org_extends']; }
var res = eval("res");
var TweenLite = eval("TweenLite");
var g_resources = eval("g_resources");
var CANVAS_WIDTH = eval("CANVAS_WIDTH");
var CANVAS_HEIGHT = eval("CANVAS_HEIGHT");
var PORTRAIT = 1;
var LANDSCAPE = 2;
var CppUtils = eval('CppUtils');
var isShowBackGroundColorOpacity = true;
var sys;
(function (sys) {
    sys.ON_ORIENTATION_CHANGE = "sys_on_orientation_change";
    function onOrientationChange(orientation) {
        cc.eventManager.dispatchCustomEvent(sys.ON_ORIENTATION_CHANGE, orientation);
    }
    sys.onOrientationChange = onOrientationChange;
})(sys || (sys = {}));
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
startCCExtend();
var com;
(function (com) {
    var BaseComponent = (function (_super) {
        __extends(BaseComponent, _super);
        function BaseComponent() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        BaseComponent.prototype.ctor = function () {
            if (!this._super)
                return;
            this._super();
        };
        BaseComponent.prototype.destructor = function () {
        };
        BaseComponent.prototype.setStyle = function (style) {
        };
        return BaseComponent;
    }(cc.Node));
    com.BaseComponent = BaseComponent;
})(com || (com = {}));
endCCExtend();
com.BaseComponent = cc.Node['extend'](new com.BaseComponent());
var com;
(function (com) {
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
    }());
    com.ComUtils = ComUtils;
})(com || (com = {}));
startCCExtend();
var com;
(function (com) {
    var Loading = (function (_super) {
        __extends(Loading, _super);
        function Loading(bgAlpha) {
            if (bgAlpha === void 0) { bgAlpha = 1; }
            var _this = _super.call(this) || this;
            _this.bgAlpha = bgAlpha;
            return _this;
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
            this.tf = com.ComUtils.createText('', { fontFamily: "dinbold", fontSize: 20, fontStyle: 'bold', fill: 0xffffff });
            this.addChild(this.tf);
            this.titleTf = com.ComUtils.createText('', { fontFamily: "dinbold", fontSize: 12, fontStyle: 'bold', fill: 0xffffff });
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
            this.tf.setString(com.ComUtils.getIntInFormat(percent));
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
    }(com.BaseComponent));
    com.Loading = Loading;
})(com || (com = {}));
endCCExtend();
com.Loading = com.BaseComponent['extend'](new com.Loading());
var game;
(function (game) {
    var BaseGame = (function () {
        function BaseGame() {
        }
        BaseGame.prototype.destroy = function () {
        };
        return BaseGame;
    }());
    game.BaseGame = BaseGame;
})(game || (game = {}));
startCCExtend();
var game;
(function (game) {
    var BaseScene = (function (_super) {
        __extends(BaseScene, _super);
        function BaseScene() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        BaseScene.prototype.deepDestructor = function (node) {
            for (var i = 0; i < node.children.length; i++) {
                if (node.children[i]['destructor'])
                    node.children[i]['destructor']();
                this.deepDestructor(node.children[i]);
            }
        };
        BaseScene.prototype.ctor = function () {
            if (!this._super)
                return;
            this._super();
        };
        BaseScene.prototype.destructor = function () {
            this.deepDestructor(this);
        };
        BaseScene.prototype.initModel = function (gameModel) {
            this.gameModel = gameModel;
        };
        BaseScene.prototype.loadUI = function () { };
        BaseScene.prototype.orientationHandler = function () { };
        BaseScene.prototype.sizeHandler = function () { };
        return BaseScene;
    }(cc.Scene));
    game.BaseScene = BaseScene;
})(game || (game = {}));
endCCExtend();
game.BaseScene = cc.Scene['extend'](new game.BaseScene());
startCCExtend();
var game;
(function (game) {
    var GameObject = (function (_super) {
        __extends(GameObject, _super);
        function GameObject() {
            return _super !== null && _super.apply(this, arguments) || this;
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
    }(cc.Node));
    game.GameObject = GameObject;
})(game || (game = {}));
endCCExtend();
game.GameObject = cc.Node['extend'](new game.GameObject());
startCCExtend();
var game;
(function (game) {
    var LayoutObject = (function (_super) {
        __extends(LayoutObject, _super);
        function LayoutObject() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        LayoutObject.prototype.ctor = function () {
            if (!this._super)
                return;
            this._super();
        };
        LayoutObject.prototype.destructor = function () {
        };
        LayoutObject.prototype.onExit = function () {
            _super.prototype.onExit.call(this);
        };
        LayoutObject.prototype.initModel = function (gameModel) {
            this.gameModel = gameModel;
        };
        return LayoutObject;
    }(ccui.Layout));
    game.LayoutObject = LayoutObject;
})(game || (game = {}));
endCCExtend();
game.LayoutObject = ccui.Layout['extend'](new game.LayoutObject());
var Game = (function (_super) {
    __extends(Game, _super);
    function Game() {
        var _this = _super.call(this) || this;
        _this.init();
        return _this;
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
        clearInterval(this.intervalId);
    };
    Game.prototype.init = function () {
        GameSettings.LAST_ORIENTATION = GameUtils.getOrientation();
        var winSize = cc.director.getWinSize();
        var preloadScene = new cc.Scene();
        this.preloadScene = preloadScene;
        cc.director.runScene(preloadScene);
        var loading = new com.Loading(0.5);
        loading.show(true, "Load common assets");
        preloadScene.addChild(loading);
        loading.setSize(winSize.width, winSize.height);
        preloadScene.scheduleOnce(this.startLoading.bind(this), 0.1);
        this.loading = loading;
        loading.retain();
        if (!cc.sys.isNative) {
            window.onresize = this.sizeHandler.bind(this);
        }
        else {
            cc.eventManager.addCustomListener(sys.ON_ORIENTATION_CHANGE, this.onOrientationChange.bind(this));
        }
        this.sizeHandler();
    };
    Game.prototype.onOrientationChange = function (e) {
        cc.log("onOrientationChange " + e.getUserData());
        if (cc.director.getRunningScene() && cc.director.getRunningScene()['orientationHandler'])
            cc.director.getRunningScene()['orientationHandler']();
        this.sizeHandler();
    };
    Game.prototype.sizeHandler = function () {
        var w, h;
        var debugStr = "";
        var screen = GameUtils.getScreenSize();
        if (!cc.sys.isNative) {
            w = screen.width;
            h = screen.height + 1;
            if (GameUtils.getOrientation() != GameSettings.LAST_ORIENTATION) {
                GameSettings.LAST_ORIENTATION = GameUtils.getOrientation();
                if (cc.director.getRunningScene() && cc.director.getRunningScene()['orientationHandler'])
                    cc.director.getRunningScene()['orientationHandler']();
            }
        }
        else {
            w = screen.width;
            h = screen.height;
        }
        cc.log("setDesignResolutionSize " + w + " " + h);
        if (cc.director.getRunningScene() && cc.director.getRunningScene()['sizeHandler'])
            cc.director.getRunningScene()['sizeHandler']();
        cc.view.setFrameSize(w, h);
        cc.view.setDesignResolutionSize(w, h, cc.ResolutionPolicy.SHOW_ALL);
    };
    Game.prototype.startLoading = function () {
        cc.loader.load(g_resources, this.loadCommonAssetsProgress.bind(this), this.onLoadCommonAssetComplete.bind(this));
    };
    Game.prototype.loadCommonAssetsProgress = function (result, count, loadedCount) {
        var percent = (loadedCount / count * 100) | 0;
        percent = Math.min(percent, 100);
        this.loading.updatePercent(percent);
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
    };
    return Game;
}(game.BaseGame));
var GameModel = (function () {
    function GameModel() {
    }
    return GameModel;
}());
var GameSettings = (function () {
    function GameSettings() {
    }
    return GameSettings;
}());
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
    GameUtils.copyUIStatus = function (src, des) {
        if (!(src instanceof ccui.Widget))
            return;
        for (var i = 0; i < src.children.length; i++) {
            var srcNode = src.children[i];
            var desNode = des.getChildByName(srcNode.name);
            if (!desNode)
                continue;
            if (srcNode instanceof ccui.CheckBox) {
                GameUtils.copyCCCheckBoxStatus(srcNode, desNode);
            }
            this.copyUIStatus(srcNode, desNode);
        }
    };
    GameUtils.copyCCCheckBoxStatus = function (src, des) {
        des.setSelected(src.isSelected());
    };
    GameUtils.getOrientation = function () {
        if (!cc.sys.isNative) {
            return GameUtils.getScreenSize().width > GameUtils.getScreenSize().height ? LANDSCAPE : PORTRAIT;
        }
        else
            return CppUtils.getOrientation();
    };
    GameUtils.getScreenSize = function () {
        if (!cc.sys.isNative)
            return cc.size(GameUtils.getSize("Width"), GameUtils.getSize("Height"));
        else {
            var orientation = CppUtils.getOrientation();
            var win = cc.director.getWinSize();
            if (orientation == PORTRAIT)
                return cc.size(Math.min(win.width, win.height), Math.max(win.width, win.height));
            else
                return cc.size(Math.max(win.width, win.height), Math.min(win.width, win.height));
        }
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
}());
startCCExtend();
var GameScene = (function (_super) {
    __extends(GameScene, _super);
    function GameScene() {
        return _super !== null && _super.apply(this, arguments) || this;
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
        this.sizeHandler();
    };
    GameScene.prototype.sizeHandler = function () {
        var screen = GameUtils.getScreenSize();
        this.bg.drawPoly([cc.p(0, 0), cc.p(screen.width, 0), cc.p(screen.width, screen.height), cc.p(0, screen.height)], cc.color(0x22, 0x22, 0x22, 255), 1, cc.color(0, 0, 0, 0));
        var menu = this.menu;
        menu.x = screen.width * 0.5;
        menu.y = screen.height * 0.9 - menu.getContentSize().height;
        this.sprite.x = screen.width * 0.5;
        this.sprite.y = 250;
    };
    GameScene.prototype.startTween = function () {
        this.sprite.y = 250;
        TweenLite.to(this.sprite, 2, { y: 200, onComplete: this.startTween.bind(this) });
    };
    GameScene.prototype.initModel = function (model) {
        _super.prototype.initModel.call(this, model);
        var director = cc.director;
        var screen = GameUtils.getScreenSize();
        var bg = new cc.DrawNode();
        this.bg = bg;
        this.addChild(bg);
        bg.drawPoly([cc.p(0, 0), cc.p(screen.width, 0), cc.p(screen.width, screen.height), cc.p(0, screen.height)], cc.color(0x22, 0x22, 0x22, 255), 1, cc.color(0, 0, 0, 0));
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
        menu.x = screen.width * 0.5;
        menu.y = screen.height * 0.9 - menu.getContentSize().height;
        var listener = {
            event: cc.EventListener.TOUCH_ONE_BY_ONE,
            swallowTouches: true,
            onTouchBegan: this.onMenuTouchBegan.bind(this),
            onTouchEnded: this.onMenuTouchEnded.bind(this)
        };
        this.menuListener = cc.EventListener.create(listener);
        this.menuListener.retain();
        var sprite = new cc.Sprite(res.HelloWorld_png);
        sprite.x = screen.width * 0.5;
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
}(game.BaseScene));
endCCExtend();
this['GameScene'] = game.BaseScene['extend'](new GameScene());
startCCExtend();
var StartScene = (function (_super) {
    __extends(StartScene, _super);
    function StartScene() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    StartScene.prototype.ctor = function () {
        if (!this._super)
            return;
        this._super();
    };
    StartScene.prototype.destructor = function () {
        this._super();
    };
    StartScene.prototype.onExit = function () {
        cc.log("StartScene::onExit ----------------------- ");
        this._super();
    };
    StartScene.prototype.onEnter = function () {
        cc.log("StartScene::onEnter ----------------------- ");
        this._super();
        if (!this.isInited) {
            this.scheduleOnce(this.startLoading.bind(this), 0.1);
            return;
        }
        this.sizeHandler();
    };
    StartScene.prototype.initModel = function (model) {
        _super.prototype.initModel.call(this, model);
        this.addChild(this.gameModel.loading);
        this.gameModel.loading.show(true, "load ui scene assets");
    };
    StartScene.prototype.sizeHandler = function () {
        var screen = GameUtils.getScreenSize();
        if (this.uiView) {
            this.uiView.setContentSize(screen);
            cc.log("StartScene sizeHandler screen " + screen.width + " " + screen.height);
            ccui['helper'].doLayout(this.uiView);
        }
    };
    StartScene.prototype.orientationHandler = function () {
        this.loadUI();
    };
    StartScene.prototype.startLoading = function () {
        var resources = [
            "res/Login_portrait.json",
            "res/Login_landscape.json"
        ];
        cc.loader.load(resources, this.loadAssetsProgress.bind(this), this.onLoadAssetComplete.bind(this));
    };
    StartScene.prototype.loadAssetsProgress = function (result, count, loadedCount) {
        var percent = (loadedCount / count * 100) | 0;
        percent = Math.min(percent, 100);
        this.gameModel.loading.updatePercent(percent);
    };
    StartScene.prototype.onLoadAssetComplete = function () {
        this.removeChild(this.gameModel.loading);
        this.isInited = true;
        this.loadUI();
        this.sizeHandler();
    };
    StartScene.prototype.initVod = function () {
        if (this.video)
            return;
        if (cc.sys.os == cc.sys.OS_WINDOWS)
            return;
        var vurl = "res/cocosvideo.mp4";
        if (cc.sys.platform == cc.sys.ANDROID) {
            var screen = GameUtils.getScreenSize();
            var layer = cc.LayerColor.create(cc.color(0, 0, 0, 0), 232, 240);
            layer.setBlendFunc(cc.BlendFunc.DISABLE);
            this.addChild(layer);
            var video = new ccui.VideoPlayer();
            video.setContentSize(432, 240);
            video.setKeepAspectRatioEnabled(true);
            this.addChild(video);
            video.setFileName(vurl);
            video.anchorX = 0;
            video.anchorY = 0;
            video.x = 0;
            video.y = 0;
            this.video = video;
            video.setEventListener(ccui.VideoPlayer.EventType.PLAYING, function () {
                cc.log("ccui.VideoPlayer.EventType.PLAYING ==== ");
            }.bind(this));
            video.play();
        }
    };
    StartScene.prototype.loadUI = function () {
        var screen = GameUtils.getScreenSize();
        var jsonFile = GameUtils.getOrientation() == PORTRAIT ? "res/Login_portrait.json" : "res/Login_landscape.json";
        var json = ccs.load(jsonFile);
        var uiView = json.node.getChildByName("view");
        json.node.removeChild(uiView);
        uiView.initModel(this.gameModel);
        cc.log("this.uiView  ======== " + this.uiView);
        if (this.uiView) {
            cc.log("here ---");
            GameUtils.copyUIStatus(this.uiView, uiView);
            this.removeChild(this.uiView);
            this.uiView.destructor();
        }
        this.uiView = uiView;
        this.addChild(uiView);
        this.initVod();
    };
    return StartScene;
}(game.BaseScene));
endCCExtend();
this['StartScene'] = game.BaseScene['extend'](new StartScene());
startCCExtend();
var MyCustomUIClass = (function (_super) {
    __extends(MyCustomUIClass, _super);
    function MyCustomUIClass() {
        return _super !== null && _super.apply(this, arguments) || this;
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
}(game.LayoutObject));
endCCExtend();
this['MyCustomUIClass'] = game.LayoutObject['extend'](new MyCustomUIClass());
//# sourceMappingURL=game.js.map