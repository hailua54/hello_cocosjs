/**
 * ...
 * @author: vuanh-Tom
 */
namespace com
{
	export class ComUtils
	{
		/**
		style: {text, fontName:'Arial', fontSize:16, dimensions: cc.size(0,0), hAlignment:cc.TEXT_ALIGNMENT_LEFT, vAlignment:cc.TEXT_ALIGNMENT_LEFT}
		*/
		public static createText(str:string, style:any = null):cc.LabelTTF
		{
			if (!style) style = {};
			var tf:cc.LabelTTF = cc.LabelTTF['create'](str, style.fontFamily||null, style.fontSize||16, style.dimensions||null, style.hAlignment||null, style.vAlignment||null);
			return tf;
		}

		/**
		 *
		 * @param	num
		 * @param	d : num of digits next to dot
		 * @return
		 */
		public static getNumInFormat(num:number, d:number = 2):string
		{
			num = Math.round(num*Math.pow(10,d))/Math.pow(10,d);
			var sign = num < 0 ? "-":"";
			num = Math.abs(num);
			var s:string = num.toString();
			var arr:Array<string> = s.split('.');
			// pre
			var s0:string = arr[0];
			var pre:string = "";
			var count:number = 0;
			for (var i:number = s0.length - 1; i > 0; i--)
			{
				count++;
				pre = s0.charAt(i) + pre;
				if (count == 3 && i > 0)
				{
					pre = ',' + pre;
					count = 0;
				}
			}
			pre = s0.charAt(0) + pre;

			if (d == 0) return sign + pre;

			// pos
			var zero:string = "0000000000000000";
			if (arr.length == 1) return sign + pre;

			var s1:string = String(arr[1]).substr(0, d);
			s1 += zero.substr(0, d - s1.length);
			if (parseInt(s1) > 0)  return sign + pre + '.' + s1;
			else return sign + pre;
		}

		public static getIntInFormat(val:number, d:number = 2):string
		{
			val = Math.round(val);
			var str = val.toString();
			var zero:string = "0000000000000000";
			return zero.substr(0, d - str.length) + str;
		}
	}
}
