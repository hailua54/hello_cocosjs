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

	static JSFunctionSpec st_funcs[] = {
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