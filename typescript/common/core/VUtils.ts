/**
 * ...
 * @author: vuanh-Tom
 */
namespace core
{
  export class VUtils
  {
    constructor() {}
    public static isNull(object:any):boolean
    {
      return (object === null || object === undefined);
    }

    public static removeElementFromArray(arr:Array<any>, e:any):void
    {
      for ( var i = 0; i < arr.length; i++ )
      {
        if (arr[i] === e)
        {
          arr.splice(i, 1);
          return;
        }
      }
    }

    public static getObjKey(obj:Object):string
    {
      if (obj["__vSysObjKey__"]) return obj["__vSysObjKey__"];
      else {
        return obj["__vSysObjKey__"] = "vSysObjKey_" + Math.random()*2147483647 + "_" + new Date().getTime();
      }
    }

    public static getObjKeyName():string
    {
      return "__vSysObjKey__";
    }

    public static copy(source:Object, des:Object):void
    {
      if (!des)
      {
        var i = 1;
      }
      for (var attr in source) {
          if (source.hasOwnProperty(attr)) des[attr] = source[attr];
      }
    }

    public static copyClass(source:any, des:any):void
    {
      for (var attr in source) {
          if (source.hasOwnProperty(attr)) des[attr] = source[attr];
      }
      //des.prototype = source.prototype;
    }

    public static cleanObj(obj:Object)
    {
      for (var i in obj) delete obj[i];
    }
  }
}
