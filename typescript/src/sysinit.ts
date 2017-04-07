//const std::string GLViewImpl::EVENT_WINDOW_RESIZED = "glview_window_resized";
//const std::string GLViewImpl::EVENT_WINDOW_FOCUSED = "glview_window_focused";
//const std::string GLViewImpl::EVENT_WINDOW_UNFOCUSED = "glview_window_unfocused";
// override extends function of tsc. Nomore using typescript extends. Use cocos Class::extend Instead
//var __extends = function(){}
function startCCExtend() {this['org_extends'] = this['__extends']; this['__extends'] = function(){}}
function endCCExtend() {this['__extends'] = this['org_extends']}
function trace(str){cc.log(str);}
var res = eval("res");
var TweenLite = eval("TweenLite");
var g_resources = eval("g_resources");
var CANVAS_WIDTH = eval("CANVAS_WIDTH");
var CANVAS_HEIGHT = eval("CANVAS_HEIGHT");
var PORTRAIT:number = 1;
var LANDSCAPE:number = 2;
var CppUtils = eval('CppUtils');
var isShowBackGroundColorOpacity = false;

namespace sys
{
	export var ON_ORIENTATION_CHANGE:string = "sys_on_orientation_change";
	export function onOrientationChange(orientation:number)
	{
		cc.eventManager.dispatchCustomEvent(ON_ORIENTATION_CHANGE, orientation);
	}
}
