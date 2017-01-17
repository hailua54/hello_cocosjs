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