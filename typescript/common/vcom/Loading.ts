startCCExtend();
namespace vcom
{
	export class Loading extends BaseComponent
	{
		public bg:cc.DrawNode;
		protected anim:cc.Sprite;
		protected tf:cc.LabelTTF;
		protected titleTf:cc.LabelTTF;
		bgAlpha:number;

		constructor(bgAlpha:number = 1)
		{
			super();
			this.bgAlpha = bgAlpha;
		}

		public ctor()
		{
			// add this code to deal with the draw Object created to pass to Class::extend function
			if (!this._super) return;
			// -------------------------------
			this._super();

			this.bg = new cc.DrawNode();
			this.addChild(this.bg);

			this.anim = new cc.Sprite();
			this.addChild(this.anim);
			var devided = 30;
			var ang = 0;
			var r = 30;
			var total = 360/devided;
			var ra:number = 2;
			for (var i = 0; i < total; i++)
			{
				var circle: cc.DrawNode = new cc.DrawNode();
				this.anim.addChild(circle);
				ra += 0.3;
				if (ra > 5) ra = 5;
				var alpha = 0.1*(i)*255;
				circle.drawDot(cc.p(0, 0), ra, cc.color(0xff,0xff,0xff, alpha < 255?alpha:255));
				//circle.drawCircle(cc.p(0, 0), ra, 2*cc.PI, 30, false, 1, cc.color(0,0,0));
				circle.x = r*Math.cos(ang*Math.PI/180);
				circle.y = r*Math.sin(ang*Math.PI/180);

				ang -= devided;
			}

			this.tf = ComUtils.createText('', {fontFamily:"dinbold", fontSize:20, fontStyle:'bold', fill:0xffffff, /*align:cc.TEXT_ALIGNMENT_LEFT*/});
			this.addChild(this.tf);

			this.titleTf = ComUtils.createText('', {fontFamily:"dinbold", fontSize:12, fontStyle:'bold', fill:0xffffff});
			this.addChild(this.titleTf);
		}

		public onExit()
		{
			this._super();
			this.unscheduleUpdate();
		}

		public onEnter()
		{
			this._super();
			this.scheduleUpdate();
		}

		public setSize(w:number, h:number)
		{
			var bg:cc.DrawNode = this.bg;
			this.bg.clear();
			bg.drawPoly([cc.p(0,0), cc.p(w, 0), cc.p(w, h), cc.p(0,h)],
			new cc.Color(0x22, 0x22, 0x22, this.bgAlpha*255), 1, new cc.Color(0, 0, 0, 0));
			this.tf.x = w*0.5;
			this.tf.y = h*0.5;
			this.titleTf.x = w*0.5;
			this.titleTf.y = h*0.5 + 50;
			this.anim.x = w*0.5;
			this.anim.y = h*0.5;
		}

		public update(delta:number)
		{
			this.anim.rotation += 7;
		}

		public updatePercent(percent:number):void
		{
			this.tf.setString(vcom.ComUtils.getIntInFormat(percent));
		}

		public show(hasPercent:boolean = true, title:string = "", showBg:boolean = true)
		{
			if (!showBg) this.bg.opacity = 0.1*255;
			else this.bg.opacity = 1*255;
			this.visible = true;
			this.tf.setString("");
			this.tf.visible = hasPercent;
			this.titleTf.setString(title);
		}

		public hide()
		{
			this.visible = false;
		}
	}
}
endCCExtend();
vcom.Loading = vcom.BaseComponent['extend'](new vcom.Loading());
