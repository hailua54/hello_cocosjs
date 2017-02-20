/// <reference path="../../cocos2d-lib.d.ts" />
declare namespace ccui {
	export class Widget extends cc.Node {
		public static  BRIGHT_STYLE_NONE:number;
		/**
		 * Normal bright style of public static
		 * @constant
		 * @type {number}
		 */
		public static  BRIGHT_STYLE_NORMAL:number;
		/**
		 * Light bright style of public static
		 * @constant
		 * @type {number}
		 */
		public static  BRIGHT_STYLE_HIGH_LIGHT:number;

		//widget type
		/**
		 * The type code of Widget for ccui controls.
		 * @constant
		 * @type {number}
		 */
		public static  TYPE_WIDGET:number;
		/**
		 * The type code of Container for ccui controls.
		 * @constant
		 * @type {number}
		 */
		public static  TYPE_CONTAINER:number;

		//Focus Direction
		/**
		 * The left of Focus direction for ccui.Widget
		 * @constant
		 * @type {number}
		 */
		public static  LEFT:number;
		/**
		 * The right of Focus direction for ccui.Widget
		 * @constant
		 * @type {number}
		 */
		public static  RIGHT:number;
		/**
		 * The up of Focus direction for ccui.Widget
		 * @constant
		 * @type {number}
		 */
		public static  UP:number;
		/**
		 * The down of Focus direction for ccui.Widget
		 * @constant
		 * @type {number}
		 */
		public static  DOWN:number;

		//texture resource type
		/**
		 * The image file texture type of ccui.Widget loads.
		 * @constant
		 * @type {number}
		 */
		public static  LOCAL_TEXTURE:number;
		/**
		 * The sprite frame texture type of ccui.Widget loads.
		 * @constant
		 * @type {number}
		 */
		public static  PLIST_TEXTURE:number;

		//touch event type
		/**
		 * The touch began type of ccui.Widget's touch event
		 * @constant
		 * @type {number}
		 */
		public static  TOUCH_BEGAN:number;
		/**
		 * The touch moved type of ccui.Widget's touch event
		 * @constant
		 * @type {number}
		 */
		public static  TOUCH_MOVED:number;
		/**
		 * The touch end type of ccui.Widget's touch event
		 * @constant
		 * @type {number}
		 */
		public static  TOUCH_ENDED:number;
		/**
		 * The touch canceled type of ccui.Widget's touch event
		 * @constant
		 * @type {number}
		 */
		public static  TOUCH_CANCELED:number;

		//size type
		/**
		 * The absolute of ccui.Widget's size type.
		 * @constant
		 * @type {number}
		 */
		public static  SIZE_ABSOLUTE:number;
		/**
		 * The percent of ccui.Widget's size type.
		 * @constant
		 * @type {number}
		 */
		public static  SIZE_PERCENT:number;

		//position type
		/**
		 * The absolute of ccui.Widget's position type.
		 * @constant
		 * @type {number}
		 */
		public static  POSITION_ABSOLUTE:number;
		/**
		 * The percent of ccui.Widget's position type.
		 * @constant
		 * @type {number}
		 */
		public static  POSITION_PERCENT:number;

		public xPercent:number;
		public yPercent:number;
		public widthPercent:number;
		public heightPercent:number;
		addCCSEventListener(callback)
		addNode(node, zOrder, tag)
		addTouchEventListener(selector, target)
		checkChildInfo(handleState, sender, touchPoint)
		clippingParentAreaContainPoint(pt)
		clone()
		create()
		ctor()
		didNotSelectSelf()
		dispatchFocusEvent(widgetLostFocus, widgetGetFocus)
		enableDpadNavigation(enable)
		findNextFocusedWidget(direction, current)
		getBottomBoundary()
		getBottomInParent()
		getCallbackName()
		getCallbackType()
		getCurrentFocusedWidget()
		getCurrentFocusedWidget()
		getCustomSize()
		getDescription()
		getLayoutParameter(type)
		getLayoutSize()
		getLeftBoundary()
		getLeftInParent()
		getNodeByTag(tag)
		getNodes()
		getPositionPercent()
		getPositionType()
		getRightBoundary()
		getRightInParent()
		getSize()
		getSizePercent()
		getSizeType()
		getTopBoundary()
		getTopInParent()
		getTouchBeganPosition()
		getTouchEndPos()
		getTouchEndPosition()
		getTouchMovePos()
		getTouchMovePosition()
		getTouchStartPos()
		getVirtualRenderer()
		getVirtualRendererSize()
		getWidgetParent()
		getWidgetType()
		getWorldPosition()
		hitTest(pt)
		ignoreContentAdaptWithSize(ignore)
		init()
		interceptTouchEvent(eventType, sender, touch)
		isBright()
		isClippingParentContainsPoint(pt)
		isEnabled()
		isFlippedX()
		isFlippedY()
		isFocused()
		isFocusEnabled()
		isHighlighted()
		isIgnoreContentAdaptWithSize()
		isLayoutComponentEnabled()
		isPropagateTouchEvents()
		isSwallowTouches()
		isTouchEnabled()
		isUnifySizeEnabled()
		onEnter()
		onExit()
		onFocusChange(widgetLostFocus, widgetGetFocus)
		onTouchBegan(touch, event)
		onTouchCancelled(touchPoint)
		onTouchEnded(touch, event)
		onTouchLongClicked(touchPoint)
		onTouchMoved(touch, event)
		removeAllNodes()
		removeNode(node, cleanup)
		removeNodeByTag(tag, cleanup)
		requestFocus()
		setBright(bright)
		setBrightStyle(style)
		setCallbackName(callbackName)
		setCallbackType(callbackType)
		setContentSize(contentSize, height?)
		setEnabled(enabled)
		setFlippedX(flipX)
		setFlippedY(flipY)
		setFocused(focus)
		setFocusEnabled(enable)
		setHighlighted(highlight)
		setLayoutComponentEnabled(enable)
		setLayoutParameter(parameter)
		setPosition(pos, posY)
		setPositionPercent(percent)
		setPositionType(type)
		setPropagateTouchEvents(isPropagate)
		setSize(size)
		setSizePercent(percent)
		setSizeType(type)
		setSwallowTouches(swallow)
		setTouchEnabled(enable)
		setUnifySizeEnabled(enable)
		updateSizeAndPosition(parentSize)
	}

	export class Layout extends Widget {
		public static BG_COLOR_NONE = 0;
		/**
		 * The solid of ccui.Layout's background color type, it will use a LayerColor to draw the background.
		 * @constant
		 * @type {number}
		 */
		public static BG_COLOR_SOLID = 1;
		/**
		 * The gradient of ccui.Layout's background color type, it will use a LayerGradient to draw the background.
		 * @constant
		 * @type {number}
		 */
		public static BG_COLOR_GRADIENT = 2;

		//Layout type
		/**
		 * The absolute of ccui.Layout's layout type.
		 * @type {number}
		 * @constant
		 */
		public static ABSOLUTE = 0;
		/**
		 * The vertical of ccui.Layout's layout type.
		 * @type {number}
		 * @constant
		 */
		public static LINEAR_VERTICAL = 1;
		/**
		 * The horizontal of ccui.Layout's layout type.
		 * @type {number}
		 * @constant
		 */
		public static LINEAR_HORIZONTAL = 2;
		/**
		 * The relative of ccui.Layout's layout type.
		 * @type {number}
		 * @constant
		 */
		public static RELATIVE = 3;

		//Layout clipping type
		/**
		 * The stencil of ccui.Layout's clipping type.
		 * @type {number}
		 * @constant
		 */
		public static CLIPPING_STENCIL = 0;
		/**
		 * The scissor of ccui.Layout's clipping type.
		 * @type {number}
		 * @constant
		 */
		public static CLIPPING_SCISSOR = 1;

		/**
		 * The zOrder value of ccui.Layout's image background.
		 * @type {number}
		 * @constant
		 */
		public static BACKGROUND_IMAGE_ZORDER = -1;
		/**
		 * The zOrder value of ccui.Layout's color background.
		 * @type {number}
		 * @constant
		 */
		public static BACKGROUND_RENDERER_ZORDER = -2;
		addBackGroundImage()
		static create()
		getBackGroundColor()
		getBackGroundColorOpacity()
		getBackGroundColorType()
		getBackGroundColorVector()
		getBackGroundEndColor()
		getBackGroundImageCapInsets()
		getBackGroundImageColor()
		getBackGroundImageOpacity()
		getBackGroundImageTextureSize()
		getBackGroundStartColor()
		getClippingType()
		getDescription()
		getLayoutType()
		isBackGroundImageScale9Enabled()
		isClippingEnabled()
		removeAllChildren(cleanup)
		removeBackGroundImage()
		removeChild(widget, cleanup)
		removeChild(widget)
		requestDoLayout()
		setBackGroundColor(color, endColor)
		setBackGroundColorOpacity(opacity)
		setBackGroundColorType(type)
		setBackGroundColorVector(vector)
		setBackGroundImage(fileName, texType)
		setBackGroundImageCapInsets(capInsets)
		setBackGroundImageColor(color)
		setBackGroundImageOpacity(opacity)
		setBackGroundImageScale9Enabled(able)
		setClippingEnabled(able)
		setClippingType(type)
		setLayoutType(type)
	}

	export class CheckBox extends Widget {
	}

	export class ImageView extends Widget {
		constructor(fileUrl?:any, texType?:any);
	}

	export class Button extends Widget
	{
		loadTextures(pressed:string, normal:string, disabled:string, texType?:number):void;
	}

	export class ScrollView extends Widget
	{
		public static DIR_NONE:number;
		/**
		 * The vertical flag of ccui.ScrollView's direction.
		 * @constant
		 * @type {number}
		 */
		public static DIR_VERTICAL:number;
		/**
		 * The horizontal flag of ccui.ScrollView's direction.
		 * @constant
		 * @type {number}
		 */
		public static DIR_HORIZONTAL:number;
		/**
		 * The both flag of ccui.ScrollView's direction.
		 * @constant
		 * @type {number}
		 */
		public static DIR_BOTH:number;

		//ScrollView event
		/**
		 * The flag scroll to top of ccui.ScrollView's event.
		 * @constant
		 * @type {number}
		 */
		public static EVENT_SCROLL_TO_TOP:number;
		/**
		 * The flag scroll to bottom of ccui.ScrollView's event.
		 * @constant
		 * @type {number}
		 */
		public static EVENT_SCROLL_TO_BOTTOM:number;
		/**
		 * The flag scroll to left of ccui.ScrollView's event.
		 * @constant
		 * @type {number}
		 */
		public static EVENT_SCROLL_TO_LEFT:number;
		/**
		 * The flag scroll to right of ccui.ScrollView's event.
		 * @constant
		 * @type {number}
		 */
		public static EVENT_SCROLL_TO_RIGHT:number;
		/**
		 * The scrolling flag of ccui.ScrollView's event.
		 * @constant
		 * @type {number}
		 */
		public static EVENT_SCROLLING:number;
		/**
		 * The flag bounce top of ccui.ScrollView's event.
		 * @constant
		 * @type {number}
		 */
		public static EVENT_BOUNCE_TOP:number;
		/**
		 * The flag bounce bottom of ccui.ScrollView's event.
		 * @constant
		 * @type {number}
		 */
		public static EVENT_BOUNCE_BOTTOM:number;
		/**
		 * The flag bounce left of ccui.ScrollView's event.
		 * @constant
		 * @type {number}
		 */
		public static EVENT_BOUNCE_LEFT:number;
		/**
		 * The flag bounce right of ccui.ScrollView's event.
		 * @constant
		 * @type {number}
		 */
		public static EVENT_BOUNCE_RIGHT:number;
		/**
		 * The flag container moved of ccui.ScrollView's event.
		 * @constant
		 * @type {number}
		 */
		public static EVENT_CONTAINER_MOVED:number;
		/**
		 * The flag autoscroll ended of ccui.ScrollView's event.
		 * @constant
		 * @type {number}
		 */
		public static EVENT_AUTOSCROLL_ENDED:number;

		/**
		 * @ignore
		 */

		public static MOVEDIR_TOP:number;
		public static MOVEDIR_BOTTOM:number;
		public static MOVEDIR_LEFT:number;
		public static MOVEDIR_RIGHT:number;

    setDirection(dir:number):void;
    setTouchEnabled(enanble:boolean):void;
    setBounceEnabled(enanble:boolean):void;
    setBackGroundImage(file:string):void;
    setBackGroundImageScale9Enabled(enanble:boolean):void;
    addEventListener(handler:any, context:any):void;
	}

	export class ListView extends ScrollView {
		public static GRAVITY_CENTER_VERTICAL:number;
		public static EVENT_SELECTED_ITEM:any;
		setItemModel(item:any):void;
		pushBackCustomItem(item:any):void;
		setGravity(gravity:number):void;
		setItemsMargin(spacing:number):void;
		forceDoLayout():void;
		getInnerContainer():Widget;
		getInnerContainerSize():cc.Size;
		jumpToTop():void;
		getItems():Array<any>;
	}

	export class Text extends Widget
	{
		constructor(textContent:any, fontName:any, fontSize:any);

		disableEffect():void

		enableGlow(glowColor:any):void

		enableOutline(outlineColor:any, outlineSize:any):void

		enableShadow(shadowColor:any, offset:any, blurRadius:any):void

		getDescription():any

		getFontName():any

		getFontSize():any

		getString():any

		getStringLength():any

		getStringValue():any

		getTextAreaSize():any

		getTextHorizontalAlignment():any

		getTextVerticalAlignment():any

		getType():any

		getVirtualRenderer():any

		getVirtualRendererSize():any

		isTouchScaleChangeEnabled():any

		setFontName(name:string):void

		setFontSize(size:any):void

		setString(text:any):void

		setText(text:any):void

		setTextAreaSize(size:any):void

		setTextHorizontalAlignment(alignment:any):void

		setTextVerticalAlignment(alignment:any):void

		setTouchScaleChangeEnabled(enable:any):void
	}

}
