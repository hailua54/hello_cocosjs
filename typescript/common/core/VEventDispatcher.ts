/**
 * ...
 * @author vuanh-Tom
 * a refrerence from Starling Framework
 */
namespace core
{
  export class VEventDispatcher
  {
    private mEventListeners:Object;
    constructor()
    {
    	this.mEventListeners = null;
    };

    /** Registers an event listener at a certain object. */
    public addEventListener = function(type:string, listener:Function, context:Object)
    {
    	if (this.mEventListeners == null) this.mEventListeners = {};

    	var listeners = this.mEventListeners[type];
    	if (listeners == null)
      {
        this.mEventListeners[type] = [];
        listeners = this.mEventListeners[type];
      }
    	if (!this.hasEventListener(type, listener, context)) // check for duplicates
    		listeners[listeners.length] = VObjectPool.get(core.VListenerBinding).init(listener, context); // avoid 'push'
    }

    /** Removes an event listener from the object. */
    public removeEventListener(type:string, listener:Function, context:Object)
    {
    	if (this.mEventListeners)
    	{
    		var listenerBindings = this.mEventListeners[type];
    		var numListeners = listenerBindings ? listenerBindings.length : 0;

    		if (numListeners > 0)
    		{
    			// we must not modify the original vector, but work on a copy.
    			// => because user may call removeEventListener when we travelling the original vector incase dispatching an event
    			var index = 0;
    			var tempListenerBindings = new Array(numListeners - 1);

    			for (var i = 0; i < numListeners; ++i)
    			{
    				var otherListener = listenerBindings[i];
    				if (!otherListener.has(listener, context)) tempListenerBindings[index++] = otherListener;
            else VObjectPool.release(otherListener, core.VListenerBinding);
    			}

    			this.mEventListeners[type] = tempListenerBindings;
    		}
    	}
    }

    /** Removes all event listeners with a certain type, or all of them if type is null.
     *  Be careful when removing all event listeners: you never know who else was listening. */
    public removeAllEventListeners(type:string = null)
    {
    	if (type && this.mEventListeners)
      {
        for (var i = 0; i < this.mEventListeners[type].length; ++i) VObjectPool.release(this.mEventListeners[type][i], core.VListenerBinding);
    		delete this.mEventListeners[type];
      }
    	else // clear all
      {
        for (var ty in this.mEventListeners)
        {
          if (this.mEventListeners[ty])
          {
            for (var i = 0; i < this.mEventListeners[ty].length; ++i) VObjectPool.release(this.mEventListeners[ty][i], core.VListenerBinding);
        		delete this.mEventListeners[ty];
          }
        }
        this.mEventListeners = null;
      }

    };

    /** Dispatches an event to all objects that have registered listeners for its type.
     * event format {type, target, data, stopsImmediatePropagation}
     */
    public dispatchEvent(event:VBaseEvent)
    {
    	if ((this.mEventListeners == null || !(event.type in this.mEventListeners)))
    		return; // no need to do anything

    	// we save the current target and restore it later;
    	// this allows users to re-dispatch events without creating a clone.

    	var previousTarget = event.target;
    	event.target = this;

    	this.invokeEvent(event);
    	if (previousTarget) event.target = previousTarget;
    };

    /** @private
     *  Invokes an event*/
    private invokeEvent(event:VBaseEvent):boolean
    {
    	var listenerBindings = this.mEventListeners ? this.mEventListeners[event.type]: null;
    	var numListeners = listenerBindings == null ? 0 : listenerBindings.length;

    	if (numListeners)
    	{
    		event.currentTarget = this;

    		// we can enumerate directly over the vector, because:
    		// when somebody modifies the list while we're looping, "addEventListener" is not
    		// problematic, and "removeEventListener" will create a new Vector, anyway.

    		for (var i = 0; i < numListeners; ++i)
    		{

    			var binding = listenerBindings[i];
    			var numArgs = binding.listener.length;

    			if (numArgs == 0) binding.listener.call(binding.context);
    			else if (numArgs == 1) binding.listener.call(binding.context, event);
    			if (event.stopsImmediatePropagation)
    				return true;
    		}

    		return event.stopsPropagation;
    	}
    	else
    	{
    		return false;
    	}
    };

    /** Dispatches an event with the given parameters to all objects that have registered
     *  listeners for the given type. The method uses an internal pool of event objects to
     *  avoid allocations. */
    public dispatchEventWith(type:string, data:any = null):void
    {
  		var event:VBaseEvent = VObjectPool.get(VBaseEvent);
  		event.type = type;
  		event.data = data;
  		this.dispatchEvent(event);
  		VObjectPool.release(event, VBaseEvent);
    };

    /** Returns if there are listeners registered for a certain event type. */
    public hasEventListener(type:string, listener:Function, context:Object):boolean
    {
      if (!this.mEventListeners) return false;
      if (!this.mEventListeners[type]) return false;
    	var listeners = this.mEventListeners[type];
    	for (var i = 0; i < listeners.length; i++)
      {
        if (listeners[i].listener === listener && listeners[i].context === context) return true;
      }
      return false;
    };
  }
}
