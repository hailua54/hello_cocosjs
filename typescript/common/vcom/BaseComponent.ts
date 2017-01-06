/**
 * ...
 * @author: vuanh-Tom
 */
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

vcom.BaseComponent = cc.Node['extend'](new vcom.BaseComponent());
