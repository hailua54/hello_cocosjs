/**
 * ...
 * @author: vuanh-Tom
 */
startCCExtend();
namespace vcom
{
	export class BaseComponent extends cc.Node
	{
    // constructor
    public ctor()
		{
			if (!this._super) return;
			this._super();
		}

		public destructor()
		{
		}

		public setStyle(style:any)
		{
		}
	}
}
endCCExtend();
vcom.BaseComponent = cc.Node['extend'](new vcom.BaseComponent());
