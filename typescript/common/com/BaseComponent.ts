/**
 * ...
 * @author: vuanh-Tom
 */
startCCExtend();
namespace com
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
com.BaseComponent = cc.Node['extend'](new com.BaseComponent());
