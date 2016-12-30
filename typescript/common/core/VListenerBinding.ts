/**
 * ...
 * @author: vuanh-Tom
 */
namespace core
{
    export class VListenerBinding
    {
      public listener:Function;
      public context:Object;
      constructor()
      {

      }

      public init(listener:Function, context:Object):VListenerBinding
      {
        this.listener = listener;
        this.context = context;
        return this;
      }

      public has(listener:Function, context:Object):boolean
      {
        return this.listener === listener && this.context === context;
      }

      public clean():void
      {
        this.listener = null;
        this.context = null;
      }
    }
}
