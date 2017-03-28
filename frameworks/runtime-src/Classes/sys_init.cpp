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