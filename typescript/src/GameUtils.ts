class GameUtils
{
	public static getItemHit(items:Array<any>, touchPos:cc.Point):any
	{
		// check item hit
		for (var i = 0; i < items.length; i++)
		{
			var item = items[i];
			//Get the position of the current point relative to the button
			var mp:cc.Point = item.convertToNodeSpace(touchPos);
			//cc.log("mp " + mp.x + " " + mp.y);
			var r:cc.Rect = item.localBound;
			var rect:cc.Rect = cc.rect(r.x, r.y, r.width, r.height);
			//Check the click area
			if (cc.rectContainsPoint(rect, mp)) return item;
		}
		return null;
	}

	//======================================================================================
  // Get Window Size (Width / Height)
  //======================================================================================
	public static copyUIStatus(src:any, des:any)
	{
		if (!(src instanceof ccui.Widget)) return;
		for (var i = 0; i < src.children.length; i++)
		{
			var srcNode = src.children[i];
			var desNode = des.getChildByName(srcNode.name);
			if (!desNode) continue;
			if (srcNode instanceof ccui.CheckBox)
			{
				GameUtils.copyCCCheckBoxStatus(srcNode, desNode);
			}
			this.copyUIStatus(srcNode, desNode);
		}
	}

	public static copyCCCheckBoxStatus(src:any, des:any)
	{
		des.setSelected(src.isSelected());
	}

	public static getOrientation():number
	{
		if (!cc.sys.isNative)
		{
			return GameUtils.getScreenSize().width > GameUtils.getScreenSize().height ? LANDSCAPE : PORTRAIT;
		}
		else return CppUtils.getOrientation();
	}

	public static getScreenSize():cc.Size
	{
		if (!cc.sys.isNative) return cc.size(GameUtils.getSize("Width"), GameUtils.getSize("Height"));
		else
		{
			// NOTE: be careful for thread conflig here to call Native code
			var orientation:number = CppUtils.getOrientation();
			var win = cc.director.getWinSize();
			if (orientation == PORTRAIT)
				return cc.size(Math.min(win.width, win.height), Math.max(win.width, win.height));
			else return cc.size(Math.max(win.width, win.height), Math.min(win.width, win.height));
		}
	}

  public static getSize(Name:string):number {
      var size:number;
      var name = Name.toLowerCase();
      var document = window.document;
      var documentElement = document.documentElement;
  	//trace("innerWidth " + window.innerWidth + " clientWidth " + window.document.documentElement.clientWidth + " scrollWidth " + window.document.documentElement.scrollWidth + " window.screen.width " + window.screen.width);
  	//trace("innerHeight " + window.innerHeight + " clientHeight " + window.document.documentElement.clientHeight + " scrollHeight " + window.document.documentElement.scrollHeight  + " window.screen.height " + window.screen.height);

  	if (window["inner" + Name] === undefined) {
          // IE6 & IE7 don't have window.innerWidth or innerHeight
          size = documentElement["client" + Name];
      }
      else if (window["inner" + Name] !== documentElement["client" + Name]) {
          // WebKit doesn't include scrollbars while calculating viewport size so we have to get fancy

          // Insert markup to test if a media query will match document.doumentElement["client" + Name]
          var bodyElement = document.createElement("body");
          bodyElement.id = "vpw-test-b";
          bodyElement.style.cssText = "overflow:scroll";
          var divElement = document.createElement("div");
          divElement.id = "vpw-test-d";
          divElement.style.cssText = "position:absolute;top:-1000px";
          // Getting specific on the CSS selector so it won't get overridden easily
          divElement.innerHTML = "<style>@media(" + name + ":" + documentElement["client" + Name] + "px){body#vpw-test-b div#vpw-test-d{" + name + ":7px!important}}</style>";
          bodyElement.appendChild(divElement);
          documentElement.insertBefore(bodyElement, document.head);

          if (divElement["offset" + Name] === 7) {
              // Media query matches document.documentElement["client" + Name]
              size = documentElement["client" + Name];
          }
          else {
              // Media query didn't match, use window["inner" + Name]
              size = window["inner" + Name];
          }
          // Cleanup
          documentElement.removeChild(bodyElement);
      }
      else {
          // Default to use window["inner" + Name]
          size = window["inner" + Name];
      }

      return size;
  }


}
