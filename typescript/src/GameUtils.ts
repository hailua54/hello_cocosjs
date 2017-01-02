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
}
