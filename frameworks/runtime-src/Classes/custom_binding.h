#include "jsapi.h"

extern JSClass  *jsb_CppSysInit_class;
extern JSObject *jsb_CppSysInit_prototype;

bool js_CppSysInit_getOrientation(JSContext *cx, uint32_t argc, jsval *vp);
void js_register_CppSysInit(JSContext *cx, JS::HandleObject global);