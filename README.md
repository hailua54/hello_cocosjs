# Simple typescript project structure for COCOSJS

## Setup

- TypeScript IDE: Atom and typescript module for atom (https://atom.io/packages/atom-typescript)
- Nodejs and typescript compile module (https://www.npmjs.com/package/typescript-compiler)
- Cososjs typescript definition (https://github.com/jamma/cocos2d-typescript-definitions.git)
- Cocos2d-x 3.11.1+

## Initialize

- Modify project.json (no more load app.js)
	
	```json
	"jsList" : [
	"src/resource.js",
	"src/game.js"
	```
	
- Modify main.js to create Game object

	```js
	cc.LoaderScene.preload(g_resources, function () {
		//cc.director.runScene(new HelloWorldScene()); 
		var game = new Game();
	}, this);
	```
		
- Modify frameworks/cocos2d-x/cocos/base/CCDirector.cpp
	
	```c
	void Director::reset()
	{    
		Director::getInstance()->getEventDispatcher()->dispatchCustomEvent("game_on_exit");
		// ...
	}
	```
- Modify timlineParser-2.x.js

	```js
    parser.initSingleNode = function(json, resourcePath){
        var node = json.UserData?eval('new ' + json.UserData + '()'):new cc.Node();
		//...
	}
	```
	
## Compile

- web: cocos compile -p web -m release --advanced

## Tip

- The code using tab size = 2. To view the draw code with github, put a tab size on the url ?ts=2
Ex: https://github.com/hailua54/hello_cocosjs/blob/master/typescript/src/scenes/StartScene.ts?ts=2

- Android studio

	cocos compile -p android --android-studio --app-abi=armeabi-v7a

## References

- GC

	http://wiki.luajit.org/New-Garbage-Collector#gc-algorithms_two-color-mark-sweep

	Ruby 2.2 GC

	https://engineering.heroku.com/blogs/2015-02-04-incremental-gc/

- Touch events

	http://www.cocos2d-x.org/wiki/EventDispatcher_Mechanism

- JS call C++ sample:

	AppDelegate.cpp:
	
	```c
	ScriptingCore* sc = ScriptingCore::getInstance();
    sc->addRegisterCallback(js_register_cocos2dx_Director);
	
	sc->start();
    sc->runScript("script/jsb_boot.js");
#if defined(COCOS2D_DEBUG) && (COCOS2D_DEBUG > 0)
    sc->enableDebugger();
#endif
    ScriptEngineProtocol *engine = ScriptingCore::getInstance();
    ScriptEngineManager::getInstance()->setScriptEngine(engine);
    ScriptingCore::getInstance()->runScript("main.js");
	```
	
	jsb_cocos2dx_auto.cpp:
	
	```c
	JSClass  *jsb_cocos2d_Director_class;
	JSObject *jsb_cocos2d_Director_prototype;
	
	static bool js_is_native_obj(JSContext *cx, uint32_t argc, jsval *vp)
	{
		JS::CallArgs args = JS::CallArgsFromVp(argc, vp);
		args.rval().setBoolean(true);
		return true;    
	}
	
	void js_register_cocos2dx_Director(JSContext *cx, JS::HandleObject global) {
		jsb_cocos2d_Director_class = (JSClass *)calloc(1, sizeof(JSClass));
		jsb_cocos2d_Director_class->name = "Director";
		jsb_cocos2d_Director_class->addProperty = JS_PropertyStub;
		jsb_cocos2d_Director_class->delProperty = JS_DeletePropertyStub;
		jsb_cocos2d_Director_class->getProperty = JS_PropertyStub;
		jsb_cocos2d_Director_class->setProperty = JS_StrictPropertyStub;
		jsb_cocos2d_Director_class->enumerate = JS_EnumerateStub;
		jsb_cocos2d_Director_class->resolve = JS_ResolveStub;
		jsb_cocos2d_Director_class->convert = JS_ConvertStub;
		jsb_cocos2d_Director_class->finalize = jsb_ref_finalize;
		jsb_cocos2d_Director_class->flags = JSCLASS_HAS_RESERVED_SLOTS(2);

		static JSPropertySpec properties[] = {
			JS_PSG("__nativeObj", js_is_native_obj, JSPROP_PERMANENT | JSPROP_ENUMERATE),
			JS_PS_END
		};

		static JSFunctionSpec funcs[] = {
			// custom ------
			JS_FN("hasNextScene", js_cocos2dx_Director_hasNextScene, 0, JSPROP_PERMANENT | JSPROP_ENUMERATE),
			// -------------
			// ...
			JS_FS_END
		};

		static JSFunctionSpec st_funcs[] = {
			JS_FN("getInstance", js_cocos2dx_Director_getInstance, 0, JSPROP_PERMANENT | JSPROP_ENUMERATE),
			JS_FS_END
		};

		jsb_cocos2d_Director_prototype = JS_InitClass(
			cx, global,
			JS::NullPtr(),
			jsb_cocos2d_Director_class,
			empty_constructor, 0,
			properties,
			funcs,
			NULL, // no static properties
			st_funcs);

		// add the proto and JSClass to the type->js info hash table
		JS::RootedObject proto(cx, jsb_cocos2d_Director_prototype);
		jsb_register_class<cocos2d::Director>(cx, jsb_cocos2d_Director_class, proto, JS::NullPtr());
	}
	```
		