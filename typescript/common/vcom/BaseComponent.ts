/**
 * ...
 * @author: vuanh-Tom
 */
startCCExtend();
namespace vcom
{
	export class BaseComponent extends cc.Node
	{
		constructor()
		{
			super();
		}

		public setStyle(style:any)
		{
		}
	}
}
endCCExtend();
vcom.BaseComponent = cc.Node['extend'](new vcom.BaseComponent());
