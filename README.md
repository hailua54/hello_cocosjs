# Simple typescript project structure for COCOSJS

## Setup

- TypeScript IDE: Atom and typescript module for atom (https://atom.io/packages/atom-typescript)
- Nodejs and typescript compile module (https://www.npmjs.com/package/typescript-compiler)
- Cososjs typescript definition (https://github.com/jamma/cocos2d-typescript-definitions.git)
- Cocos2d-x 3.11.1+

## Initialize

- Modify cocos2d/core/platform.d.ts

	add the one more method Class
	
	export class Class {
	
		public _super():void;
		
		...
		
	}
	
- Modify project.json (no more load app.js)

	"jsList" : [
	
	"src/resource.js",
	
	"src/game.js"
	
- Modify main.js to create Game object

	cc.LoaderScene.preload(g_resources, function () {
	
		//cc.director.runScene(new HelloWorldScene()); 
		
		var game = new Game();
		
	}, this);
	
- Modify frameworks/cocos2d-html5/cocos2d/core/CCDirector.js:

	...
	
    hasNextScene: function () {
	
        return this._nextScene != null;
		
    },
	
	...
	
- Modify frameworks/cocos2d-x/cocos/base/CCDirector.h

	// custom methods ----
	
	inline bool hasNextScene() { return _nextScene != NULL; }
	
	// ------------------
	
- Modify frameworks/cocos2d-x/cocos/scripting/js-bindings/auto/jsb_cocos2dx_auto.hpp:

	// custome methods ----------

	bool js_cocos2dx_Director_hasNextScene(JSContext *cx, uint32_t argc, jsval *vp);

	// --------------------------

- Modify frameworks/cocos2d-x/cocos/scripting/js-bindings/auto/jsb_cocos2dx_auto.cpp:

    static JSFunctionSpec funcs[] = {
	
		// custom ------
		
		JS_FN("hasNextScene", js_cocos2dx_Director_hasNextScene, 0, JSPROP_PERMANENT | JSPROP_ENUMERATE),
		
		// -------------
		
		...
		
		};
		
	bool js_cocos2dx_Director_hasNextScene(JSContext *cx, uint32_t argc, jsval *vp)
	
	{
	
		JS::CallArgs args = JS::CallArgsFromVp(argc, vp);
		
		JS::RootedObject obj(cx, args.thisv().toObjectOrNull());
		
		js_proxy_t *proxy = jsb_get_js_proxy(obj);
		
		cocos2d::Director* cobj = (cocos2d::Director *)(proxy ? proxy->ptr : NULL);
		
		JSB_PRECONDITION2(cobj, cx, false, "js_cocos2dx_Director_hasNextScene : Invalid Native Object");
		
		if (argc == 0) {
		
			bool ret = cobj->hasNextScene();
			
			jsval jsret = JSVAL_NULL;
			
			jsret = BOOLEAN_TO_JSVAL(ret);
			
			args.rval().set(jsret);
			
			return true;
			
		}

		JS_ReportError(cx, "js_cocos2dx_Director_hasNextScene : wrong number of arguments: %d, was expecting %d", argc, 0);
		
		return false;
		
	}

## Tip

- The code using tab size = 2. To view the draw code with github, put a tab size on the url ?ts=2
Ex: https://github.com/hailua54/hello_cocosjs/blob/master/typescript/src/scenes/StartScene.ts?ts=2

## References

- GC

http://wiki.luajit.org/New-Garbage-Collector#gc-algorithms_two-color-mark-sweep

Ruby 2.2 GC

https://engineering.heroku.com/blogs/2015-02-04-incremental-gc/

- Touch event
http://www.cocos2d-x.org/wiki/EventDispatcher_Mechanism
		