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
	{   // ...
		Director::getInstance()->getEventDispatcher()->dispatchCustomEvent("game_on_exit");
		// ...
	}
	```
- Modify timlineParser-2.x.js

	```js
	
	register.forEach(function(item){
        parser.registerParser(item.name, function(options, resourcePath){
            var node = item.handle.call(this, options, resourcePath);
            this.parseChild(node, options["Children"], resourcePath);
			if (node['onUIParseComplete']) node['onUIParseComplete']();
			if (!isShowBackGroundColorOpacity && node.setBackGroundColorOpacity) node.setBackGroundColorOpacity(0);
            DEBUG && node && (node.__parserName = item.name);
            return node;
        });
    });
	
    parser.initSingleNode = function(json, resourcePath){
        var node = json.UserData?eval('new ' + json.UserData + '()'):new cc.Node();
		//...
	}
	
	```
- Add "..Sdk\platform-tools" to system variable 'Path' to be able to use 'adb' command

## Compile

- web: cocos compile -p web -m release --advanced

- Android studio:
	+ setup for debug on hardware device https://developer.android.com/studio/run/device.html#setting-up
		
		Enable USB debug mode on device
		
		Install driver: Ex: GT-I9100LKAXEU, install Kies to update driver http://www.samsung.com/uk/support/model/GT-I9100LKAXEU
		
	+ command: cocos compile cocos compile -p android --android-studio

## Tip

- The code using tab size = 2. To view the draw code with github, put a tab size on the url ?ts=2
Ex: https://github.com/hailua54/hello_cocosjs/blob/master/typescript/src/scenes/StartScene.ts?ts=2

## References

- GC

	http://wiki.luajit.org/New-Garbage-Collector#gc-algorithms_two-color-mark-sweep

	Ruby 2.2 GC

	https://engineering.heroku.com/blogs/2015-02-04-incremental-gc/

- Touch events

	http://www.cocos2d-x.org/wiki/EventDispatcher_Mechanism
	
- Resolution policy: check CCEGLView.js
	
	```js
	_setupContainer: function (view, w, h) {
        var locCanvas = cc.game.canvas, locContainer = cc.game.container;
        if (cc.sys.isMobile) {
            document.body.style.width = (view._isRotated ? h : w) + 'px';
            document.body.style.height = (view._isRotated ? w : h) + 'px';
        }

        // Setup style
        locContainer.style.width = locCanvas.style.width = w + 'px';
        locContainer.style.height = locCanvas.style.height = h + 'px';
        // Setup pixel ratio for retina display
        var devicePixelRatio = view._devicePixelRatio = 1;
        if (view.isRetinaEnabled())
            devicePixelRatio = view._devicePixelRatio = Math.min(2, window.devicePixelRatio || 1);
        // Setup canvas
        locCanvas.width = w * devicePixelRatio;
        locCanvas.height = h * devicePixelRatio;
        cc._renderContext.resetCache && cc._renderContext.resetCache();
    }
	```

- Load image from server:

	```js
	cc.loader.loadImg(url, {isCrossOrigin: false}, function(error:any, img:any){
	if (error) return;
	if (isWeb())
	{
		var avatarTex = new cc.Texture2D();
		avatarTex.initWithElement(img);
		avatarTex.handleLoadedTexture();
		var avatar = new cc.Sprite(avatarTex);
		this.resizeAvatar(avatar);
	}
	else {
		var avatar = new cc.Sprite();
		avatar.initWithTexture(img);
		this.resizeAvatar(avatar);
	}
}.bind(this));
	```
	
- JS call C++ sample:

	### custom_binding.h:
	
	```c
	#include "jsapi.h"

	extern JSClass  *jsb_CppUtils_class;
	extern JSObject *jsb_CppUtils_prototype;

	bool js_sys_CppUtils_getOrientation(JSContext *cx, uint32_t argc, jsval *vp);
	void js_register_sys_CppUtils(JSContext *cx, JS::HandleObject global);
	```

	### custom_binding.cpp:
	
	```c
	#include "custom_binding.h"
	#include "sys_init.h"
	#include "scripting/js-bindings/manual/ScriptingCore.h"
	#include "scripting/js-bindings/manual/js_manual_conversions.h"

	JSClass  *jsb_sys_CppUtils_class;
	JSObject *jsb_cocos2d_sys_CppUtils_prototype;

	static bool empty_constructor(JSContext *cx, uint32_t argc, jsval *vp) {
		return false;
	}

	static bool js_is_native_obj(JSContext *cx, uint32_t argc, jsval *vp)
	{
		JS::CallArgs args = JS::CallArgsFromVp(argc, vp);
		args.rval().setBoolean(true);
		return true;
	}

	bool js_sys_CppUtils_getOrientation(JSContext *cx, uint32_t argc, jsval *vp)
	{
		JS::CallArgs args = JS::CallArgsFromVp(argc, vp);

		if (argc == 0) {
			int orientation = sys::cpp_2_native_getOrientation();
			args.rval().setInt32(orientation);
			return true;
		}

		JS_ReportError(cx, "js_sys_CppUtils_getOrientation : wrong number of arguments: %d, was expecting %d", argc, 0);
		return false;
	}

	void js_register_sys_CppUtils(JSContext *cx, JS::HandleObject global)
	{
		jsb_sys_CppUtils_class = (JSClass *)calloc(1, sizeof(JSClass));
		jsb_sys_CppUtils_class->name = "CppUtils";
		jsb_sys_CppUtils_class->addProperty = JS_PropertyStub;
		jsb_sys_CppUtils_class->delProperty = JS_DeletePropertyStub;
		jsb_sys_CppUtils_class->getProperty = JS_PropertyStub;
		jsb_sys_CppUtils_class->setProperty = JS_StrictPropertyStub;
		jsb_sys_CppUtils_class->enumerate = JS_EnumerateStub;
		jsb_sys_CppUtils_class->resolve = JS_ResolveStub;
		jsb_sys_CppUtils_class->convert = JS_ConvertStub;
		jsb_sys_CppUtils_class->flags = JSCLASS_HAS_RESERVED_SLOTS(2);

		static JSPropertySpec properties[] = {
			JS_PS_END
		};

		static JSFunctionSpec funcs[] = {
			JS_FS_END
		};

		static JSFunctionSpec st_funcs[] = {
			JS_FN("getOrientation", js_sys_CppUtils_getOrientation, 0, JSPROP_PERMANENT | JSPROP_ENUMERATE),
			JS_FS_END
		};

		jsb_cocos2d_sys_CppUtils_prototype = JS_InitClass(
			cx, global,
			JS::NullPtr(),
			jsb_sys_CppUtils_class,
			empty_constructor, 0,
			properties,
			funcs,
			NULL, // no static properties
			st_funcs);

		JS::RootedObject proto(cx, jsb_cocos2d_sys_CppUtils_prototype);
		JS::RootedValue className(cx, std_string_to_jsval(cx, "CppUtils"));
		JS_SetProperty(cx, proto, "_className", className);
		JS_SetProperty(cx, proto, "__nativeObj", JS::TrueHandleValue);
		JS_SetProperty(cx, proto, "__is_ref", JS::TrueHandleValue);
		// add the proto and JSClass to the type->js info hash table
		jsb_register_class<sys::CppUtils>(cx, jsb_sys_CppUtils_class, proto, JS::NullPtr());
	}
	```
	
- C++ call JS, C++ call Native, Native call C++:

	### sys_init.h: 
	
	```c
	#ifndef  _SYS_INIT_H_
	#define  _SYS_INIT_H_
	namespace sys
	{
		void cpp_2_js_orientationChange(int oritentation);
		int cpp_2_native_getOrientation();

		// dummy class for jsbinding
		class CppUtils
		{
			// JS:
			// public static int getOrientation();
		};
	}
	#endif
	```
	
	### sys_init.cpp:
	
	```c
	#include "sys_init.h"
	#include "cocos2d.h"
	#include "scripting/js-bindings/manual/ScriptingCore.h"
	USING_NS_CC;

	#if CC_TARGET_PLATFORM == CC_PLATFORM_ANDROID
	#include <jni.h>
	#include "platform/android/jni/JniHelper.h"
	#endif

	#if (CC_TARGET_PLATFORM == CC_PLATFORM_ANDROID)
	// custom cpp functions for Java to call
	extern "C"
	void Java_org_cocos2dx_javascript_NativeCppFunctions_cppOrientationChange(JNIEnv* env, jobject /* this */, jint orientation)
	{
		CCLOG("Java_org_cocos2dx_javascript_NativeCppFunctions_cppOrientationChange %d ", orientation);
		int orient = orientation;
		// should call the function in cocos thread http://discuss.cocos2d-x.org/t/solved-calling-javascript-from-c-crashes-on-android/22805/3
		Director::getInstance()->getScheduler()->performFunctionInCocosThread([=] {sys::cpp_2_js_orientationChange(orient); });
	}
	#endif

	void sys::cpp_2_js_orientationChange(int oritentation)
	{
		
		ScriptingCore * scriptingCore = ScriptingCore::getInstance();

		JSContext * cx = scriptingCore->getGlobalContext();
		JS::RootedObject object(cx, scriptingCore->getGlobalObject());
		JS::RootedValue owner(cx);

		jsval args[1];
		JS_GetProperty(cx, object, "sys", &owner);

		args[0] = INT_TO_JSVAL(oritentation);

		scriptingCore->executeFunctionWithOwner(owner, "onOrientationChange", 1, args);
	}

	int sys::cpp_2_native_getOrientation()
	{
		int orientation = 1;
	#if CC_TARGET_PLATFORM == CC_PLATFORM_ANDROID
		JniMethodInfo t;
		if (JniHelper::getStaticMethodInfo(t, "org/cocos2dx/javascript/ExportJavaFunctions", "androidGetOrientation", "()I"))
		{
			jint retV = t.env->CallStaticIntMethod(t.classID, t.methodID);
			t.env->DeleteLocalRef(t.classID);
			orientation = retV;
		}
	#endif
		return orientation;
	}
	```
	
	### sysinit.js
	
	```js
	var CppUtils = eval('CppUtils');
	```
	
- Java call C++:
	
	http://stnguyen.com/cocos2d-x/call-cpp-functions-from-java.html
	
- C++ call Java:

	http://stnguyen.com/cocos2d-x/call-java-functions-from-cpp.html
	
	
	
	
	
		