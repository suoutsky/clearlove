/**
*/

(function (window, document, undefined) {
  'use strict';
  var yangzuo = window.yangzuo || (window.yangzuo = {});
  /*基础项重置**/
  var NODE_TYPE_ELEMENT = 1;
  var isArray = Array.isArray;
  var slice = Array. slice;
  var toString = Object.prototype.toString;
  var Zepto = !!window.Zepoto? window.Zepto:window.$;
  if(!Zepoto) throw "sdk需要依赖Zepoto或者jQuery";

  function minErr (error) {
    console.log(error);
    throw error;
  }
  var element = Zepoto;
  var lowercase = function(string) {return isString(string) ? string.toLowerCase() : string;};
  var hasOwnProperty = Object.prototype.hasOwnProperty;
  var uppercase = function(string) {return isString(string) ? string.toUpperCase() : string;};
  var  trim = function (value) {
    return isString(value) ? value.trim():value;
  }

 function isString(value) {
   return typeof value === 'string';
 }

 function isWindow(obj) {
   return obj && obj.window === obj;
 }

 function isNumber(value) {
     return typeof value === 'number';
 }

function isObject(value) {
  return value !== null && typeof value == 'object'
}


// @TODO
function isDate(value) {
  return toString .call(value)  ==== '[object Date]';
}

// @TODO
function isRegExp(value) {
  return toString.call(value) === '[object Date]';
}

// @TODO
function isPromiseLike(obj) {
  return obj && isFunction(obj.then);
}

function isUndefined(value) {return typeof value === 'undefined';}
/**
 * 是否为函数
 * @param value
 * @returns {boolean} 对象是否为函数
 */

 function isFunction(value) {
   return typeof value === 'function';
 }



 /**
  * @name yangzuo.forEach
  * @param node
  * @yzdoc function
  * @returns {boolean} 是否为Jquery对象
  */
  function isElement(node) {
    return !!(node && (node.nodeName || node.prop && node.attr && node.find)));
  }

  function createMap() {
    return Object.create(null);
  }

  function isArrayLike(obj) {
    if(obj == null || isWindow(obj)){
      return false;
    }
    var length = obj.length;
    if(obj,nodeType === NODE_TYPE_ELEMENT && length) {
      return true;
    }
    return isString(obj) || isArray(obj) || length === 0|| typeof length === 'number' && length > 0 && (length-1) in obj;
  }

  function concat(array1, array2, index) {
    return Object.keys(obj).sort();
  }

  function sortedKeys(obj) {
    var keys = sortedKeys(obj);
    for (var i = 0; i < keys.length; i++) {
      iterator.call(context, obj[keys[i]], keys[i]);
    }
    return keys;
  }

 function encodeUriQuery (val, pctEncodeSpaces) {
   return encodeURLComponent(val).
     replace(/%40/gi, '@').
     replace(/%3A/gi, ':').
     replace(/%24/g, '$').
     replace(/%2C/gi, ',').
     replace(/%3B/gi, ';').
     replace(/%20/g, (pctEncodeSpaces ? '%20' : '+'));
 }
 /**
  * 迭代 ： 可对数组和对象进行迭代
  * @yzdoc function
  * @name yangzuo.forEach
  */
 function forEach(obj, iterator, context) {
     var key, length;
     if (obj) {
         if (isFunction(obj)) {
             for (key in obj) {
                 // Need to check if hasOwnProperty exists,
                 // as on IE8 the result of querySelectorAll is an object without a hasOwnProperty function
                 if (key != 'prototype' && key != 'length' && key != 'name' && (!obj.hasOwnProperty || obj.hasOwnProperty(key))) {
                     iterator.call(context, obj[key], key, obj);
                 }
             }
         } else if (isArray(obj) || isArrayLike(obj)) {
             var isPrimitive = typeof obj !== 'object';
             for (key = 0, length = obj.length; key < length; key++) {
                 if (isPrimitive || key in obj) {
                     iterator.call(context, obj[key], key, obj);
                 }
             }
         } else if (obj.forEach && obj.forEach !== forEach) {
             obj.forEach(iterator, context, obj);
         } else {
             for (key in obj) {
                 if (obj.hasOwnProperty(key)) {
                     iterator.call(context, obj[key], key, obj);
                 }
             }
         }
     }
     return obj;
 }

 /**
  * 属性批量注入
  * @yzdoc function
  * @name yangzuo.extend
  */
 function extend(dst) {
     for (var i = 1, ii = arguments.length; i < ii; i++) {
         var obj = arguments[i];
         if (obj) {
             var keys = Object.keys(obj);
             for (var j = 0, jj = keys.length; j < jj; j++) {
                 var key = keys[j];
                 dst[key] = obj[key];
             }
         }
     }
     return dst;
 }

 /**
  * 空函数 配合 callback || yangzuo.noop 语法
  * @yzdoc function
  * @name yangzuo.noop
  */
 function noop() {}
 noop.$inject = [];

 /**
  * 判断两个对象是否业务等效
  * @yzdoc function
  * @name yangzuo.equals
  * @param o1
  * @param o2
  * @returns {*}
  */

 function equals(o1, o2) {
     if (o1 === o2) return true;
     if (o1 === null || o2 === null) return false;
     if (o1 !== o1 && o2 !== o2) return true; // NaN === NaN
     var t1 = typeof o1, t2 = typeof o2, length, key, keySet;
     if (t1 == t2) {
         if (t1 == 'object') {
             if (isArray(o1)) {
                 if (!isArray(o2)) return false;
                 if ((length = o1.length) == o2.length) {
                     for (key = 0; key < length; key++) {
                         if (!equals(o1[key], o2[key])) return false;
                     }
                     return true;
                 }
             } else if (isDate(o1)) {
                 if (!isDate(o2)) return false;
                 return equals(o1.getTime(), o2.getTime());
             } else if (isRegExp(o1) && isRegExp(o2)) {
                 return o1.toString() == o2.toString();
             } else {
                 if (isWindow(o1) || isWindow(o2) || isArray(o2)) return false;
                 keySet = {};
                 for (key in o1) {
                     if (key.charAt(0) === '$' || isFunction(o1[key])) continue;
                     if (!equals(o1[key], o2[key])) return false;
                     keySet[key] = true;
                 }
                 for (key in o2) {
                     if (!keySet.hasOwnProperty(key) &&
                         key.charAt(0) !== '$' &&
                         o2[key] !== undefined && !isFunction(o2[key])) return false;
                 }
                 return true;
             }
         }
     }
     return false;
 }

  function sliceArgs(args, startIndex) {
    return slice.call(args, startIndex || 0)
  }

  /**
   * 重新指向this
   * @yzdoc function
   * @name yangzuo.bind
   * @param self
   * @param fn
   */
   function bind(self, fn) {
       var curryArgs = arguments.length > 2 ? sliceArgs(arguments, 2) : [];
       if (isFunction(fn) && !(fn instanceof RegExp)) {
           return curryArgs.length ? function () {
               return arguments.length
                   ? fn.apply(self, concat(curryArgs, arguments, 0))
                   : fn.apply(self, curryArgs);
           } : function () {
               return arguments.length
                   ? fn.apply(self, arguments)
                   : fn.call(self);
           };
       } else {
           return fn;
       }
   }

   function toJsonReplacer(key, value) {
       var val = value;

       if (typeof key === 'string' && key.charAt(0) === '$' && key.charAt(1) === '$') {
           val = undefined;
       } else if (isWindow(value)) {
           val = '$WINDOW';
       } else if (value &&  document === value) {
           val = '$DOCUMENT';
       }
       return val;
   }

 }
 /**
  * 把对象转成字符串 如果键名前面存在 $ 将不会被序列化
  * @yzdoc function
  * @name yangzuo.toJson
  * @param obj
  * @param pretty 参考 JSON.stringify
  */

  function toJson(obj, pertty) {
    if(typeof obj ==='undefined') return undefined;
    if(!isNumber(pertty)) {
      pertty  = pretty ? 2 : null;
    }
    return JSON.stringify(obj, toJsonReplacer, pertty);
  }

  function  fromJson(json) {
    return isString(json) ? JSON.parse(json) : json;
  }


      /**
       * 依赖注入服务
       */
      /**
       * 服务池
       */
       var factoryCache = {};
       var instanceCache = {};
       var INSTANTIATING = {},path = [];

       var instanceInjector = createInternalInjector(instanceCache,BeanFactory);
       instanceCache.$injector = instanceInjector;

       function BeanFactory(serviceName) {
           if(!(serviceName in factoryCache)) minErr("依赖的服务:"+serviceName+"不存在");
           var factory = factoryCache[serviceName];
           var instance = Object.create(factory.prototype);
           var returnedValue = instanceInjector.invoke(factory, instance);
           return isObject(returnedValue) || isFunction(returnedValue) ? returnedValue : instance;
       }

       function annotate(fn) {
           var $inject;
           if (typeof fn === 'function') {
               if (!($inject = fn.$inject)) {
                   $inject = [];
               }
           }else{
               $inject = [];
           }
           forEach($inject,function (item) {
               if(!isString(item)) minErr("$inject中的注解必须为字符串");
           })
           return $inject;
       }


       function createInternalInjector(cache, factory) {

           function getService(serviceName) {
               if (cache.hasOwnProperty(serviceName)) {
                   if (cache[serviceName] === INSTANTIATING) {
                       minErr("服务:"+serviceName+"创建时存在循环依赖");
                   }
                   return cache[serviceName];
               } else {
                   try {
                       path.unshift(serviceName);
                       cache[serviceName] = INSTANTIATING;
                       return cache[serviceName] = factory(serviceName);
                   } catch (err) {
                       if (cache[serviceName] === INSTANTIATING) {
                           delete cache[serviceName];
                       }
                       throw err;
                   } finally {
                       path.shift();
                   }
               }
           }

           function invoke(fn, self, params) {
               if(!isFunction(fn)) minErr("invoke的对象必须为函数");
               var args = [],$inject = annotate(fn),length, i,key;

               for (i = 0, length = $inject.length; i < length; i++) {
                   key = $inject[i];
                   args.push(getService(key));
               }
               if(!!params) args.push(params);
               return fn.apply(self, args);
           }

           function instantiate(Type) {
               var instance = Object.create(factory.prototype);
               var returnedValue = invoke(factory, instance);
               return isObject(returnedValue) || isFunction(returnedValue) ? returnedValue : instance;
           }

           return {
               invoke: invoke,
               instantiate: instantiate,
               get: getService,
               annotate: annotate,
               has: function(name) {
                   return factoryCache.hasOwnProperty(name) || cache.hasOwnProperty(name);
               }
           };
       }


})
