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

- Appdelegate.cpp

	```c
	static u_long myNextRandom = 1;
	double atof(const char *nptr)
	{
		return (strtod(nptr, NULL));
	}

	int rand(void)
	{
		return (int)((myNextRandom = (1103515245 * myNextRandom) + 12345) % ((u_long)RAND_MAX + 1));
	}

	void srand(u_int seed)
	{
		myNextRandom = seed;
	}
	```
## Compile

- web: cocos compile -p web -m release --advanced

- Android studio:
	+ setup for debug on hardware device https://developer.android.com/studio/run/device.html#setting-up
		
		Enable USB debug mode on device
		
		Install driver: Ex: GT-I9100LKAXEU, install Kies to update driver http://www.samsung.com/uk/support/model/GT-I9100LKAXEU
		
	+ command: cocos compile cocos compile -p android --android-studio --app-abi=x86 --ap android-22

## Tip

- The code using tab size = 2. To view the draw code with github, put a tab size on the url ?ts=2
Ex: https://github.com/hailua54/hello_cocosjs/blob/master/typescript/src/scenes/StartScene.ts?ts=2

## References

- Android VideoPlayer: check frameworks\cocos2d-x\cocos\ui\UIVideoPlayer-android.cpp
	
- Android Flow:
	
	+ Build libcocos2dandroid:
	
		frameworks\cocos2d-x\cocos\platform\android\Android.mk ( ... javaactivity-android.cpp \ ...)
		
		javaactivity-android.cpp => frameworks\runtime-src\proj.android-studio\app\jni\hellojavascript\main.cpp:
			
			* cocos_android_app_init(JniHelper::getEnv()); 
			
			* init C++ for java to call via jni:
			
			```c
			// in frameworks\cocos2d-x\cocos\platform\android\javaactivity-android.cpp
			JNIEXPORT void Java_org_cocos2dx_lib_Cocos2dxRenderer_nativeInit(JNIEnv*  env, jobject thiz, jint w, jint h)
			{
				auto director = cocos2d::Director::getInstance();
				auto glview = director->getOpenGLView();
				if (!glview)
				{
					glview = cocos2d::GLViewImpl::create("Android app");
					glview->setFrameSize(w, h);
					director->setOpenGLView(glview);

					cocos2d::Application::getInstance()->run();
				}
				else
				{
					...
				}
				cocos2d::network::_preloadJavaDownloaderClass();
			}
			
			
			// in frameworks\cocos2d-x\cocos\platform\android\jni\Java_org_cocos2dx_lib_Cocos2dxRenderer.cpp
			
			JNIEXPORT void JNICALL Java_org_cocos2dx_lib_Cocos2dxRenderer_nativeRender(JNIEnv* env) {
				cocos2d::Director::getInstance()->mainLoop();
			}
			```
			
		frameworks\cocos2d-x\cocos\platform\android\java\src\org\cocos2dx\lib\Cocos2dxRenderer.java:
			
			```java
			@Override
			public void onSurfaceCreated(final GL10 GL10, final EGLConfig EGLConfig) {
				Cocos2dxRenderer.nativeInit(this.mScreenWidth, this.mScreenHeight);
				this.mLastTickInNanoSeconds = System.nanoTime();
				mNativeInitCompleted = true;
			}
			
			public void onDrawFrame(GL10 unused)
			
			public void onSurfaceChanged(GL10 unused, int width, int height)
			```
		check: http://cnguyen93.blogspot.com/2014/03/khoi-tao-opengl-es-20-tren-android.html
		
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

- Build:

	+ Android: https://developer.android.com/ndk/guides/prebuilts.html#dm
	
- Video Player:

	+  Binding:
	
		### frameworks\cocos2d-x\cocos\scripting\js-bindings\manual\experimental\jsb_cocos2dx_experimental_video_manual.cpp
	
		```c
		static bool jsb_cocos2dx_experimental_ui_VideoPlayer_addEventListener(JSContext *cx, uint32_t argc, jsval *vp)
		{
			JS::CallArgs args = JS::CallArgsFromVp(argc, vp);
			JS::RootedObject obj(cx, args.thisv().toObjectOrNull());
			js_proxy_t *proxy = jsb_get_js_proxy(obj);
			experimental::ui::VideoPlayer* cobj = (experimental::ui::VideoPlayer *)(proxy ? proxy->ptr : NULL);
			JSB_PRECONDITION2( cobj, cx, false, "Invalid Native Object");

			if(argc == 1){
				std::shared_ptr<JSFunctionWrapper> func(new JSFunctionWrapper(cx, obj, args.get(0)));
				cobj->addEventListener([=](Ref* widget, experimental::ui::VideoPlayer::EventType type)->void{
					jsval arg[2];
					JS::RootedObject jsobj(cx, js_get_or_create_jsobject<Ref>(cx, widget));
					arg[0] = OBJECT_TO_JSVAL(jsobj);
					arg[1] = int32_to_jsval(cx, (int32_t)type);
					JS::RootedValue rval(cx);

					bool ok = func->invoke(2, arg, &rval);
					if (!ok && JS_IsExceptionPending(cx)) {
						JS_ReportPendingException(cx);
					}
				});
				return true;
			}

			JS_ReportError(cx, "jsb_cocos2dx_experimental_ui_VideoPlayer_addEventListener : wrong number of arguments: %d, was expecting %d", argc, 1);
			return false;
		}
		```
	
		### frameworks\cocos2d-x\cocos\scripting\js-bindings\auto\jsb_cocos2dx_experimental_video_auto.cpp
	
		```c
		bool js_cocos2dx_experimental_video_VideoPlayer_onPlayEvent(JSContext *cx, uint32_t argc, jsval *vp)
		{
			JS::CallArgs args = JS::CallArgsFromVp(argc, vp);
			bool ok = true;
			JS::RootedObject obj(cx, args.thisv().toObjectOrNull());
			js_proxy_t *proxy = jsb_get_js_proxy(obj);
			cocos2d::experimental::ui::VideoPlayer* cobj = (cocos2d::experimental::ui::VideoPlayer *)(proxy ? proxy->ptr : NULL);
			JSB_PRECONDITION2( cobj, cx, false, "js_cocos2dx_experimental_video_VideoPlayer_onPlayEvent : Invalid Native Object");
			if (argc == 1) {
				int arg0 = 0;
				ok &= jsval_to_int32(cx, args.get(0), (int32_t *)&arg0);
				JSB_PRECONDITION2(ok, cx, false, "js_cocos2dx_experimental_video_VideoPlayer_onPlayEvent : Error processing arguments");
				cobj->onPlayEvent(arg0);
				args.rval().setUndefined();
				return true;
			}

			JS_ReportError(cx, "js_cocos2dx_experimental_video_VideoPlayer_onPlayEvent : wrong number of arguments: %d, was expecting %d", argc, 1);
			return false;
		}
		```
		
	+ JS code:
		
		### frameworks\cocos2d-x\cocos\scripting\js-bindings\script\ccui\jsb_cocos2d_ui.js
		
		```js
		ccui.VideoPlayer.prototype.setEventListener = function(event, callback){
			if (!this.videoPlayerCallback)
			{
				this.videoPlayerCallback = function(sender, eventType){
					cc.log("videoEventCallback eventType:" + eventType);
					switch (eventType) {
						case 0:
							this["VideoPlayer_"+ccui.VideoPlayer.EventType.PLAYING] && this["VideoPlayer_"+ccui.VideoPlayer.EventType.PLAYING](sender);
							break;
						case 1:
							this["VideoPlayer_"+ccui.VideoPlayer.EventType.PAUSED] && this["VideoPlayer_"+ccui.VideoPlayer.EventType.PAUSED](sender);
							break;
						case 2:
							this["VideoPlayer_"+ccui.VideoPlayer.EventType.STOPPED] && this["VideoPlayer_"+ccui.VideoPlayer.EventType.STOPPED](sender);
							break;
						case 3:
							this["VideoPlayer_"+ccui.VideoPlayer.EventType.COMPLETED] && this["VideoPlayer_"+ccui.VideoPlayer.EventType.COMPLETED](sender);
							break;
						default:
							break;
					}
				};
				this.addEventListener(this.videoPlayerCallback);
			}
			this["VideoPlayer_"+event] = callback;
		};
		```
		
	+ Andoid cpp:
		
		### frameworks\cocos2d-x\cocos\ui\UIVideoPlayer-android.cpp
		
		```c
		
		#include "ui/UIVideoPlayer.h"
		
		//...
		
		void VideoPlayer::addEventListener(const VideoPlayer::ccVideoPlayerCallback& callback)
		{
			_eventCallback = callback;
		}
		```
		
		
	
		