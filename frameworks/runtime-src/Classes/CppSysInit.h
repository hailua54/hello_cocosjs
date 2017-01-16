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