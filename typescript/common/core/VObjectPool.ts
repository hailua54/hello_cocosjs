/**
 * ...
 * @author vuanh-Tom
 */
namespace core
{
  export class VObjectPool
  {
    // for sharing usaed purpose
    public static instance = new VObjectPool();
    pool:Object;
    MAX_OBJECT = 1000;

    constructor()
    {
      this.pool = {};
    }

    public static get(typeClass:any):any
    {
      return VObjectPool.instance.get(typeClass);
    }

    public static release(obj:any, typeClass:any):boolean
    {
      return VObjectPool.instance.release(obj, typeClass);
    }

    public get(typeClass:any):any
    {
      if (!this.pool[core.VUtils.getObjKey(typeClass)]) this.pool[core.VUtils.getObjKey(typeClass)] = [];
      if (this.pool[core.VUtils.getObjKey(typeClass)].length == 0)
      {
      	//console.log("VObjectPool: create Object =============================== " + typeClass.name);
      	return new typeClass();
      }

      return this.pool[core.VUtils.getObjKey(typeClass)].pop();
    }

    public release(obj:any, typeClass:any):boolean
    {
      //console.log("VObjectPool: release Object " + typeClass.name);
      if (!this.pool[core.VUtils.getObjKey(typeClass)]) this.pool[core.VUtils.getObjKey(typeClass)] = [];
      if (obj[VUtils.getObjKeyName()]) delete obj[VUtils.getObjKeyName()];
      if (!VUtils.isNull(obj.clean)) obj.clean();
      if (this.pool[core.VUtils.getObjKey(typeClass)].length == this.MAX_OBJECT)
      {
        if (obj.destroy)
        {
          obj.destroy.length ? obj.destroy(true):obj.destroy();
        }
        return false;
      }
      this.pool[core.VUtils.getObjKey(typeClass)].push(obj);
      return true;
    }

    public clearAll()
    {
      var obj:any;
      for (var type in this.pool)
      {
        for (var i = 0; i < this.pool[type].length; i++)
        {
          obj = this.pool[type][i];
          if (obj.clean) obj.clean();
          if (obj.destroy) obj.destroy.length ? obj.destroy(true):obj.destroy();
        }
        delete this.pool[type];
      }
      this.pool = null;
    }

  }
}
