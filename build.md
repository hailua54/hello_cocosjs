# ANDROID
		
## Build tests: cocos2d-x 3.12.0
	
	- NDK 1.0e 86_64:
		
		js-tests: 
			
			cocos compile -p android : SUCCESS
			
		hello-cocosjs:
		
			cocos compile -p android : SUCCESS
			
	- NDK 1.2b 86_64:
		
		js-tests: 
			
			cocos compile -p android : FAIL
			
	- NDK 1.3b 86_64:
		
		js-tests: 
			
			cocos compile -p android : FAIL
			
			cocos compile -p android --app-abi=armeabi: FAIL
			
		hello-cocosjs: using default external lib
		
			cocos compile -p android --app-abi=armeabi: FAIL
			
		hello-cocosjs: using external lib for NDK r11+ https://github.com/cocos2d/cocos2d-x-3rd-party-libs-bin
			
			cocos compile -p android --app-abi=armeabi: FAIL
		
	- Embeded NDK r13.1.3.. for Android Studio:
		
		js-tests: 
			
			cocos compile -p android : FAIL
			
			cocos compile -p android --app-abi=armeabi: FAIL
			
## Build tests: cocos2d-x 3.14.0

		- Embeded NDK r13.1.3.. for Android Studio:
		
		js-tests: 
			
			cocos compile -p android --ap android-20 : SUCCESS
			
## Setting:

	- Check default ABI: proj.android-studio\app\jni\Application.mk
		
		...
		
		APP_ABI := armeabi

		USE_ARM_MODE := 1
		
		...
		
	- Check which Android Platform (coresponding to API level) supported: Go to Sdk\platforms
	
		Ex: android-20 <=> API level 20 <=> android 5.1.1
		
		to compile cocos with specific api level (25 as in this sample), use --ap android-25
		
	- Supported ABIs
		
		https://developer.android.com/ndk/guides/abis.html#sa
	
		For ANDROID emulator: use ABI x86 --app-abi=x86
	
		
	
			
			
			
			
			