/**
 * ...
 * @author: vuanh-Tom
 */
startCCExtend();
namespace com
{
	export class BaseComponent extends cc.Node
	{
		constructor()
		{}

    // constructor
    public ctor()
		{
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
