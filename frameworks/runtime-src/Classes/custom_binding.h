#include "jsapi.h"

extern JSClass  *jsb_CppUtils_class;
extern JSObject *jsb_CppUtils_prototype;

bool js_sys_CppUtils_getOrientation(JSContext *cx, uint32_t argc, jsval *vp);
void js_register_sys_CppUtils(JSContext *cx, JS::HandleObject global);