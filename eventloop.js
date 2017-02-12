function bind(self, fn) {
  var curryArgs = arguments.length > 2 ? sliceArgs(arguments, 2) : [];
  if (isFunction(fn) && !(fn instanceof RegExp)) {  //一个非正则表达式的函数
    return curryArgs.length ? fucntion () {
       return arguments.length
         ? fn.apply(self, concat(curryArgs, arguments, 0))
         : fn.call(self);
    } : function () {
      return arguments.length
        ? fn.apply(self, arguments)
        : fn.call(self);
    };
  } else {
    return fn;
  }
}


//self  为需要绑定的执行上下文     fn为需要绑定的 函数


/**
*依赖注入服务
*/

/**
*服务池
*/
var factoryCache = {}; //服务工厂
var instanceCache = {}; //服务实例
var INSTANTIATING ={}, path = []; //服务实例化

var instanceInjector = createInternalInjector(instanceCache, BeanFactory);  //Bean model数据
instanceCache.$injector = instanceInjector;

function BeanFactory(serviceName) {
  if(!(serviceName in factoryCache)) minErr("依赖的服务"+serviceName+"不存在");
  var factory = factoryCache[serviceName];
  var instance = Object.create(factory.prototype);
  var returnedValue = instanceInjector.invoke(factory, instance);
  return isObject(returnedValue) || isFunction(returnedValue) ? returnedValue : instance;
}

function annotate(fn) {  //注解
  var $inject;
  if (typeof fn === 'function') {
    if(!($inject = fn.$inject)){
      $inject = [];
    }
  } else {
    $inject = [];
  }
  forEach($inject, function (item) {
    if(!isString(item)) minErr("$inject中的注解必须为字符串")
  })
  return $inject;
}

function createInternalInjector (cache, factory) {
  function getService(serviceName) {
    if(cache.hasOwnProperty(serviceName)) {
      if(cache[serviceName] === INSTANTIATING) {
        minErr("服务:"+serviceName+"创建时存在循环依赖");
      }
      return cache[serviceName];
    } else {
      try {
        path.unshift(serviceName);
        cache[serviceName] = INSTANTIATING;
        return cache[serviceName] = factory(serviceName);
      } catch (err) {
        if(cache[serviceName] === INSTANTIATING) {
          delete cache[serviceName];
        }
        throw err;
      } finally {
        path.shift();
      }
    }
  }
}

function invoke (fn, self, params) {
  if(!isFunction(fn)) minErr("invoke的对象必须为函数");
  var args = [],$inject = annotate(fn), length, i, key;
  for(i=0, length = $inject.length; i<length; i++) {
    key = $inject[i];
    args.push(getService(key));
  }
  if(!!params) args.push(params);
  return fn.apply(self, args);
}

function instantiate (Type) {
  var instance = Object.create(factory.prototype);
  var returnedValue = invoke(factory, instance);
  return isObject(returnedValue) || isFunction(returnedValue) ? returnedValue : instance;
}

return {
  invoke: invoke,
  instantiate:instantiate,
  get: getService,
  annotate: annotate,
  has: function(name) {
    return factoryCache.hasOwnProperty(name) || cache.hasOwnProperty(name);
  }
}


/**
* 数据缓存服务
*/

serviceName("$cacheFactory", $cacheFactory);
$cacheFactory.$inject = [];
function $cacheFactory() {
  var caches = createMap();
  return {
    get
  }
}


//请求归并
service("$httpBatchRequest", $httpBatchRequest);
$httpBatchRequest.$inject = ["$q", "$templateRequest", "$http", "$templateCache", "$cacheFactory"]
function $httpBatchRequest($q, $templateRequest, $http, $templateCache, $cacheFactory){
  var dataSourceMap = $cacheFactory.getCache("$$dataSourceMap");
  var typeList = ["GET", "POST", "JSONP"];
  function regestSource(sourceName, config){
    if(!config.type){config.type = "GET";}
    if(typeList.indexOf(config.type)==-1) minErr("数据源只支持"+typeList.join(",")+"类型");
    dataSourceMap.put(sourceName, config);
    return this;
  }
}

function createBatchRequest() {
  var batchRequest = new $$batchRequest();
  return  batchRequest;
}

function hasSource(sourceName){
  return dataSourceMap.has(sourceName);
}

//js 任务队列
function SimpleQuene(len){
    var capacity=len;
    var list=[];
    this.in=function(data){
        if(!data){return false;}
        if(list.length == capacity){
            this.out();
        }
        list.push(data);
        return true;
    };
    this.out=function(){
        // return list.splice(0,1).join();
        return list.shift();
    }
    this.isEmpty=function(){
        return list.length==0?true:false;
    }
    this.size=function(){
        return list.length;
    }
}
