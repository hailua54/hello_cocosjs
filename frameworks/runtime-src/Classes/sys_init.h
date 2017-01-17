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