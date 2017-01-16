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

	custom_binding.h:
	
	```c
	#include "jsapi.h"

	extern JSClass  *jsb_CppSysInit_class;
	extern JSObject *jsb_CppSysInit_prototype;

	bool js_CppSysInit_getOrientation(JSContext *cx, uint32_t argc, jsval *vp);
	void js_register_CppSysInit(JSContext *cx, JS::HandleObject global);
	```
	
	custom_binding.cpp:
	
	```c
	#include "custom_binding.h"
	#include "CppSysInit.h"

	JSClass  *jsb_CppSysInit_class;
	JSObject *jsb_CppSysInit_prototype;

	static bool empty_constructor(JSContext *cx, uint32_t argc, jsval *vp) {
		return false;
	}

	static bool js_is_native_obj(JSContext *cx, uint32_t argc, jsval *vp)
	{
		JS::CallArgs args = JS::CallArgsFromVp(argc, vp);
		args.rval().setBoolean(true);
		return true;
	}

	bool js_CppSysInit_getOrientation(JSContext *cx, uint32_t argc, jsval *vp)
	{
		JS::CallArgs args = JS::CallArgsFromVp(argc, vp);

		if (argc == 0) {
			int orientation = CppSysInit::cpp_2_native_getOrientation();
			args.rval().setInt32(orientation);
			return true;
		}

		JS_ReportError(cx, "js_CppSysInit_getOrientation : wrong number of arguments: %d, was expecting %d", argc, 0);
		return false;
	}

	void js_register_CppSysInit(JSContext *cx, JS::HandleObject global)
	{
		jsb_CppSysInit_class = (JSClass *)calloc(1, sizeof(JSClass));
		jsb_CppSysInit_class->name = "CppSysInit";
		jsb_CppSysInit_class->addProperty = JS_PropertyStub;
		jsb_CppSysInit_class->delProperty = JS_DeletePropertyStub;
		jsb_CppSysInit_class->getProperty = JS_PropertyStub;
		jsb_CppSysInit_class->setProperty = JS_StrictPropertyStub;
		jsb_CppSysInit_class->enumerate = JS_EnumerateStub;
		jsb_CppSysInit_class->resolve = JS_ResolveStub;
		jsb_CppSysInit_class->convert = JS_ConvertStub;
		jsb_CppSysInit_class->flags = JSCLASS_HAS_RESERVED_SLOTS(2);

		static JSPropertySpec properties[] = {
			JS_PS_END
		};

		static JSFunctionSpec funcs[] = {
			JS_FS_END
		};

		JSFunctionSpec st_funcs[] = {
			JS_FN("getOrientation", js_CppSysInit_getOrientation, 0, JSPROP_PERMANENT | JSPROP_ENUMERATE),
			JS_FS_END
		};

		jsb_CppSysInit_prototype = JS_InitClass(
			cx, global,
			JS::NullPtr(),
			jsb_CppSysInit_class,
			empty_constructor, 0,
			properties,
			funcs,
			NULL, // no static properties
			st_funcs);

		JS::RootedObject proto(cx, jsb_CppSysInit_prototype);
		JS::RootedValue className(cx, std_string_to_jsval(cx, "Director"));
		JS_SetProperty(cx, proto, "_className", className);
		JS_SetProperty(cx, proto, "__nativeObj", JS::TrueHandleValue);
		JS_SetProperty(cx, proto, "__is_ref", JS::TrueHandleValue);
		// add the proto and JSClass to the type->js info hash table
		jsb_register_class<CppSysInit>(cx, jsb_CppSysInit_class, proto, JS::NullPtr());
	}
	```
	
- C++ call JS, C++ call Native, Native call C++:

	SysInit.h: 
	
	```c
	#ifndef  _SYS_INIT_H_
	#define  _SYS_INIT_H_
	#include "cocos2d.h"
	#include "scripting/js-bindings/manual/ScriptingCore.h"

	#if CC_TARGET_PLATFORM == CC_PLATFORM_ANDROID
	#include <jni.h>
	#include "platform/android/jni/JniHelper.h"
	#endif

	USING_NS_CC;

	class CppSysInit
	{
	public:

		static inline void cpp_2_js_orientationChange(int oritentation)
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

		static inline int cpp_2_native_getOrientation()
		{
			int orientation = 1;
	#if CC_TARGET_PLATFORM == CC_PLATFORM_ANDROID
			JniMethodInfo t;
			if (JniHelper::getStaticMethodInfo(t,"org.cocos2dx.javascript.ExportJavaFunctions","androidGetOrientation","()I;")) 
			{
				jint retV = t.env->CallStaticIntMethod(t.classID, t.methodID);
				t.env->DeleteLocalRef(t.classID);
				orientation = retV;
			}
	#endif
			return orientation;
		}

	};

	#endif
	```
	AppDelegate.cpp:
	
	```c
	#if CC_TARGET_PLATFORM == CC_PLATFORM_ANDROID
	#include <jni.h>
	#include "platform/android/jni/JniHelper.h"
	#endif

	USING_NS_CC;
	using namespace CocosDenshion;

	#if (CC_TARGET_PLATFORM == CC_PLATFORM_ANDROID)
	// custom cpp functions for Java to call
	extern "C"
	void Java_org_cocos2dx_javascript_NativeCppFunctions_cppOrientationChange(JNIEnv* env, jobject /* this */, jint orientation)
	{
		CCLOG("Java_org_cocos2dx_javascript_NativeCppFunctions_cppOrientationChange %d ", orientation);
		int orient = orientation;
		CppSysInit::cpp_2_js_orientationChange(orient);
	}
	#endif
	```
	
	```java
	package org.cocos2dx.javascript;
	
	Declare static Java function for C++ to call via JNI:
	
	import android.app.Activity;

	/**
	 * Created by user on 1/16/2017.
	 */

	public class ExportJavaFunctions {
		public static Activity activity;
		public static int androidGetOrientation()
		{
			return activity.getResources().getConfiguration().orientation;
		}
	}
	```
	
	Declare native C++ for Java to call:
	
	```java
	package org.cocos2dx.javascript;

	/**
	 * Created by user on 1/16/2017.
	 */

	public class NativeCppFunctions {
		public static native void cppOrientationChange(int orientation);
	}

	```
	
	sysinit.js
	
	```js
	var CppSysInit = eval('CppSysInit');
	```
	
- Java call C++:
	
	http://stnguyen.com/cocos2d-x/call-cpp-functions-from-java.html
	
- C++ call Java:

	http://stnguyen.com/cocos2d-x/call-java-functions-from-cpp.html
	
	
	
	
	
		