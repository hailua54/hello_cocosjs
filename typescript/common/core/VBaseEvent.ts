/**
 * ...
 * @author vuanh-Tom
 */
namespace core
{
  export class VBaseEvent
  {
    /**
     * ...
     * a refrerence from Starling Framework
     */
    public data:any = null;
    public type:string = "";
    public target:any = null;
    public currentTarget:any = null;
    public stopsPropagation:boolean = false;
    public stopsImmediatePropagation:boolean = false;

    constructor(){}

    public init(type:string, data:any):VBaseEvent
    {
      this.type = type;
      this.data = data;
      return this;
    }

    public clean():void
    {
      this.data = null;
      this.type = "";
      this.target = null;
      this.currentTarget = null;
      this.stopsPropagation = false;
      this.stopsImmediatePropagation = false;
    }
  }
}
