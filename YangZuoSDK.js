/**
 * 羊左.js
 * @yzDoc
 * 作者:刘瑶
 * 核心功能:任务序列,promise,数据缓存,请求归并,依赖注入,模板管理
 */
(function (window, document, undefined) {
    'use strict';

    var yangzuo = window.yangzuo || (window.yangzuo = {});
    /**
     * 基础重置
     */
    var NODE_TYPE_ELEMENT = 1;

    var isArray = Array.isArray;
    var slice = Array.slice;
    var toString = Object.prototype.toString;
    var Zepto = !!window.Zepto? window.Zepto:window.$;
    if(!Zepto) throw "羊左.js需要依赖Zepto或者jQuery";

    function minErr(error) {
        console.log(error);
        throw error;
    }

    var element = Zepto;
    var lowercase = function(string) {return isString(string) ? string.toLowerCase() : string;};
    var hasOwnProperty = Object.prototype.hasOwnProperty;
    var uppercase = function(string) {return isString(string) ? string.toUpperCase() : string;};

    var trim = function (value) {
        return isString(value) ? value.trim() : value;
    };

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
        return value !== null && typeof value === 'object';
    }

    function isDate(value) {
        return toString.call(value) === '[object Date]';
    }

    function isRegExp(value) {
        return toString.call(value) === '[object RegExp]';
    }

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
        return !!(node && (node.nodeName || (node.prop && node.attr && node.find)));
    }

    function createMap() {
        return Object.create(null);
    }

    function isArrayLike(obj) {
        if (obj == null || isWindow(obj)) {
            return false;
        }
        var length = obj.length;
        if (obj.nodeType === NODE_TYPE_ELEMENT && length) {
            return true;
        }
        return isString(obj) || isArray(obj) || length === 0 || typeof length === 'number' && length > 0 && (length - 1) in obj;
    }

    function concat(array1, array2, index) {
        return array1.concat(slice.call(array2, index));
    }

    function sortedKeys(obj) {
        return Object.keys(obj).sort();
    }

    function forEachSorted(obj, iterator, context) {
        var keys = sortedKeys(obj);
        for (var i = 0; i < keys.length; i++) {
            iterator.call(context, obj[keys[i]], keys[i]);
        }
        return keys;
    }

    function encodeUriQuery(val, pctEncodeSpaces) {
        return encodeURIComponent(val).
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
        return slice.call(args, startIndex || 0);
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
    /**
     * 把对象转成字符串 如果键名前面存在 $ 将不会被序列化
     * @yzdoc function
     * @name yangzuo.toJson
     * @param obj
     * @param pretty 参考 JSON.stringify
     */
    function toJson(obj, pretty) {
        if (typeof obj === 'undefined') return undefined;
        if (!isNumber(pretty)) {
            pretty = pretty ? 2 : null;
        }
        return JSON.stringify(obj, toJsonReplacer, pretty);
    }
    /**
     * 反序列化
     * @yzdoc function
     * @name yangzuo.fromJson
     * @param json
     */
    function fromJson(json) {
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
    
    
    /**
     * 注入式调用
     * @name yangzuo.injectExecute
     * @param fn
     * @param params 业务参数
     * @param serviceList 服务列表 如果fn.$inject 存在,就会忽略这个值
     * @param obj this指向
     * fn.$inject = ["service1","service2"]
     * fn(service1,service2,params)
     */
    function injectExecute(fn,params,obj){
        if(!isFunction(fn)) throw "fn必须为函数";
        return instanceInjector.invoke(fn,obj,params);
    }

    /**
     * @name yangzuo.service
     * 注册服务,如果注册的服务需要依赖其他服务,请在factory方法对象上增加属性$inject
     * 如:function Factory(s1,s2){}
     *   Factory.$inject = ["si","s2"]
     * 为了精简,服务池中的服务都是单例的,在注册时调用
     * @param serviceName
     * @param factory
     */
    function service(serviceName,factory){
        if(!isString(serviceName)) throw "服务名必须为字符串";
        if(instanceInjector.has(serviceName)) throw serviceName+"重复注册";
        factoryCache[serviceName] = factory;
    }

    /**
     * promise 服务
     */
    service("$q",$qFactory);
    $qFactory.$inject = [];
    function $qFactory(){
        function callOnce(self, resolveFn, rejectFn) {
            var called = false;

            function wrap(fn) {
                return function (value) {
                    if (called) return;
                    called = true;
                    fn.call(self, value);
                };
            }

            return [wrap(resolveFn), wrap(rejectFn)];
        }

        var defer = function() {
            return new Deferred();
        };

        var reject = function(reason) {
            var result = new Deferred();
            result.reject(reason);
            return result.promise;
        };

        var when = function(value, callback, errback, progressBack) {
            var result = new Deferred();
            result.resolve(value);
            return result.promise.then(callback, errback, progressBack);
        };

        function all(promises) {
            var deferred = new Deferred(),
                counter = 0,
                results = isArray(promises) ? [] : {};

            forEach(promises, function(promise, key) {
                counter++;
                when(promise).then(function(value) {
                    if (results.hasOwnProperty(key)) return;
                    results[key] = value;
                    if (!(--counter)) deferred.resolve(results);
                }, function(reason) {
                    if (results.hasOwnProperty(key)) return;
                    deferred.reject(reason);
                });
            });

            if (counter === 0) {
                deferred.resolve(results);
            }

            return deferred.promise;
        }

        function Deferred() {
            this.promise = new Promise();
            this.resolve = simpleBind(this, this.resolve);
            this.reject = simpleBind(this, this.reject);
            this.notify = simpleBind(this, this.notify);
        }

        Deferred.prototype = {
            resolve: function(val) {
                if (this.promise.$$state.status) return;
                if (val === this.promise) {
                    this.$$reject("请不要让promise对象参与回调");
                }else {
                    this.$$resolve(val);
                }

            },

            $$resolve: function(val) {
                var then, fns;
                fns = callOnce(this, this.$$resolve, this.$$reject);
                try {
                    if ((isObject(val) || isFunction(val))) then = val && val.then;
                    if (isFunction(then)) {
                        this.promise.$$state.status = -1;
                        then.call(val, fns[0], fns[1], this.notify);
                    } else {
                        this.promise.$$state.value = val;
                        this.promise.$$state.status = 1;
                        scheduleProcessQueue(this.promise.$$state);
                    }
                } catch (e) {
                    fns[1](e);
                }
            },

            reject: function(reason) {
                if (this.promise.$$state.status) return;
                this.$$reject(reason);
            },

            $$reject: function(reason) {
                this.promise.$$state.value = reason;
                this.promise.$$state.status = 2;
                scheduleProcessQueue(this.promise.$$state);
            },

            notify: function(progress) {
                var callbacks = this.promise.$$state.pending;

                if ((this.promise.$$state.status <= 0) && callbacks && callbacks.length) {
                    setTimeout(function() {
                        var callback, result;
                        for (var i = 0, ii = callbacks.length; i < ii; i++) {
                            result = callbacks[i][0];
                            callback = callbacks[i][3];
                            try {
                                result.notify(isFunction(callback) ? callback(progress) : progress);
                            } catch (e) {
                                minErr(e);
                            }
                        }
                    });
                }
            }
        };

        function simpleBind(context, fn) {
            return function(value) {
                fn.call(context, value);
            };
        }

        function Promise() {
            this.$$state = { status: 0 };
        }

        Promise.prototype = {
            //在Promise上注册回调任务,且then可以调用多次
            then: function(onFulfilled, onRejected, progressBack) {
                var result = new Deferred();
                this.$$state.pending = this.$$state.pending || [];
                this.$$state.pending.push([result, onFulfilled, onRejected, progressBack]);
                if (this.$$state.status > 0) scheduleProcessQueue(this.$$state);
                return result.promise;
            }
        };

        function scheduleProcessQueue(state) {
            if (state.processScheduled || !state.pending) return;
            state.processScheduled = true;
            setTimeout(function(){processQueue(state);})
        }

        function processQueue(state) {
            var fn, promise, pending;

            pending = state.pending;
            state.processScheduled = false;
            state.pending = undefined;
            for (var i = 0, ii = pending.length; i < ii; ++i) {
                promise = pending[i][0];//result
                fn = pending[i][state.status];
                try {
                    if (isFunction(fn)) {
                        promise.resolve(fn(state.value));
                    } else if (state.status === 1) {
                        promise.resolve(state.value);
                    } else {
                        promise.reject(state.value);
                    }
                } catch (e) {
                    promise.reject(e);
                }
            }
        }

        var $Q = function Q(){};

        $Q.defer = defer;
        $Q.reject = reject;
        $Q.when = when;
        $Q.all = all;
        return $Q;
    }



    /**
     * 数据缓存服务
     */
    service("$cacheFactory",$cacheFactory);
    $cacheFactory.$inject = [];
    function $cacheFactory(){
        var caches = createMap();

        return {
            getCache:getCache
        };

        function getCache(cacheId) {
            if(cacheId in caches){
                return caches[cacheId];
            }else{
                return caches[cacheId] = new $Cache(cacheId,caches);
            }
        }
    }

    function $Cache(cacheId,caches){
        this.state = {size:0,cacheId:cacheId}, this.data = {};
        this.caches = caches;
    }

    $Cache.prototype = {
        info: function() {
            return this.state;
        },
        destroy: function() {
            this.data = null;
            var cacheId = this.state.cacheId;
            this.state = null;
            delete this.caches[cacheId];
        },
        removeAll: function() {
            this.data = {};
            this.state.size = 0;
        },
        remove: function(key) {
            delete this.data[key];
            this.state.size--;
        },
        put: function(key, value) {
            if (isUndefined(value)) return;
            if (this.state.size > Number.MAX_VALUE-1){
                throw "缓存溢出";
            }
            if (!(key in this.data)) this.state.size++;
            this.data[key] = value;
            return value;
        },
        get: function(key) {
            return this.data[key];
        },
        has:function(key){
            return (key in this.data);
        }
    }


    /**
     * http服务
     * @type {string[]}
     */
    service("$http",$http)
    $http.$inject = ["$q"]
    function $http($q){
        this.$q = $q;
    }
    $http.prototype = {
        get:function(url,params){
            var deferred = this.$q.defer();
            Zepto.ajax({
                type:'GET',
                url:url,
                data:params,
                success:function(result){
                    deferred.resolve(result);
                },
                error:function(e){
                    deferred.reject(e);
                }
            });
            return deferred.promise;
        },
        post:function (url, data) {
            var deferred = this.$q.defer();
            Zepto.ajax({
                type:'POST',
                url:url,
                data:data,
                success:function(result){
                    deferred.resolve(result);
                },
                error:function(e){
                    deferred.reject(e);
                }
            });
            return deferred.promise;
        },
        jsonp:function (url,data) {
            var deferred = this.$q.defer();
            Zepto.ajax({
                type:"GET",
                url:url,
                data:data,
                dataType:'jsonp',
                success:function(result){
                    deferred.resolve(result);
                },
                error:function(e){
                    deferred.reject(e);
                }
            });
            return deferred.promise;
        }
    }

    //模板缓存服务
    service("$templateCache",$templateCache);
    $templateCache.$inject = ["$cacheFactory"]
    function $templateCache($cacheFactory){
        this.templateCache = $cacheFactory.getCache("$$templateCache");
    }

    $templateCache.prototype = {
        get:function(url){
            if(this.templateCache.has(url)){
                return this.templateCache.get(url);
            }else{
                minErr("模板:"+url+" 加载失败");
            }
        },
        removeAll: function() {
            this.templateCache.removeAll();
        },
        remove: function(url) {
            this.templateCache.remove(url);
        },
        has:function(url){
            this.templateCache.has(url);
        },
        put:function(tid,html){
            this.templateCache.put(tid,html);
        },
        compile:function(){
            var templates = element("script[type='text/html']");
            if(isArrayLike(templates)){
                forEach(templates,function(dom){
                    var $dom = element(dom);
                    var templateUrl = $dom.attr("id");
                    var html = $dom.html();
                    this.put(templateUrl,html);
                },this);
            }
            templates.remove();
        }
    }

    service("$templateRequest",$templateRequest);
    $templateRequest.$inject = ["$templateCache","$q","$cacheFactory","$http"]
    function $templateRequest($templateCache,$q,$cacheFactory,$http){
        var templateHttpResultCache = $cacheFactory.getCache("$$templateHttpResultCache");

        function loadTemplate(url,tid){

            if($templateCache.has(url)){
                var html = !isUndefined(tid)?$templateCache.get(tid):$templateCache.get(url)
                return $q.when(url)
            }else{
                var tpromise = $q.defer();
                if(templateHttpResultCache.has(url)){
                    templateHttpResultCache.get(url).then(function(){
                        var html = !isUndefined(tid)?$templateCache.get(tid):$templateCache.get(url)
                        tpromise.resolve(html);
                    },function (e) {
                        tpromise.reject(e)
                    });
                }else{
                    templateHttpResultCache.put(url,tpromise.promise);
                    $http.get(url).then(function(template){
                        $templateCache.put(url,template)
                        element("body").append('<div id="Template_Box" style="display: none;"></div>');
                        element("#Template_Box").html(template);
                        $templateCache.compile();
                        element("#Template_Box").remove();

                        var html = !isUndefined(tid)?$templateCache.get(tid):$templateCache.get(url)

                        tpromise.resolve(html);
                    },function (e) {
                        tpromise.reject(e)
                    });
                }
                return tpromise.promise;
            }
        }

        return {
            loadTemplate:loadTemplate
        };
    }


    //请求归并
    service("$httpBatchRequest",$httpBatchRequest);
    $httpBatchRequest.$inject = ["$q","$templateRequest","$http","$templateCache","$cacheFactory"]
    function $httpBatchRequest($q,$templateRequest,$http,$templateCache,$cacheFactory){
        var dataSourceMap = $cacheFactory.getCache("$$dataSourceMap");
        var typeList = ["GET","POST","JSONP"];

        /**
         * 注册数据源
         * {url:请求地址,type:"GET","POST","JSONP_GET","JSONP_POST"}
         * @param config
         */
        function regestSource(sourceName,config){
            if(!config.type){config.type = "GET";}
            if(typeList.indexOf(config.type)==-1) minErr("数据源只支持"+typeList.join(",")+"类型");
            dataSourceMap.put(sourceName,config);
            return this;
        }

        function createBatchRequest() {
            var batchRequest = new $$batchRequest();
            return batchRequest;
        }

        function hasSource(sourceName){
            return dataSourceMap.has(sourceName);
        }

        return {
            regestSource:regestSource,
            createBatchRequest:createBatchRequest,
            hasSource:hasSource
        };

        function $$batchRequest(){
            var dataList = [];
            var resultSize = 0;
            var sourceList = [];


            function getData(sourceName, params){
                if(dataSourceMap.has(sourceName)){
                    sourceList.push({type:"dataSource",name:sourceName,params:params});
                }else{
                    minErr("数据源"+sourceName+"不存在");
                }
                dataList.push({});
                return this;
            }

            function getTemplate(url,tid){
                sourceList.push({type:"templateSource",url:url,tid:tid});
                dataList.push({});
                return this;
            }

            function done(){
                var deferred = $q.defer();
                forEach(sourceList,function(source,index){
                    executeDataSource(source).then(function(data){
                        if(isObject(data)){
                            extend(dataList[index],data);
                        } else{
                            dataList[index] = data;
                        }
                        resultSize++;
                        if(resultSize==dataList.length){
                            deferred.resolve(dataList)
                        }
                    },function(e){
                        deferred.reject(e);
                    })
                })
                return deferred.promise;
            }

            function executeDataSource(source){
                if(source.type=="dataSource"){
                    var dataSource = dataSourceMap.get(source.name);
                    if(dataSource.type=="GET"){
                        return $http.get(dataSource.url,source.params);
                    }else if(dataSource.type=="POST"){
                        return $http.post(dataSource.url,source.params);
                    }else if(dataSource.type=="JSONP"){
                        return $http.jsonp(dataSource.url,source.params);
                    }
                }else if(source.type=="templateSource"){
                    if($templateCache.has(source.tid)){
                        return $q.when($templateCache.get(source.tid));
                    }else{
                        var deferred = $q.defer();
                        $templateRequest.loadTemplate(source.url,source.tid).then(function(html){
                            deferred.resolve(html);
                        },function(e){
                            deferred.reject(e);
                        })
                        return deferred.promise;
                    }
                }
            }
            return {
                getData:getData,
                getTemplate:getTemplate,
                done:done
            }
        }
    }


    /**
     * 任务队列
     * 设计模式:责任链
     */
    service("$taskQueue",$taskQueue);
    $taskQueue.$inject=["$injector"]
    function $taskQueue($injector){
        var teskMap = createMap();

        function registTask(teskId,teskFn){
            teskMap[teskId] = teskFn;
        }
        /**
         * @yzDoc yangzuo.executeTaskQueue
         * [{teskId:任务Id,resolve:fn,beforeFn:fn,afterFn:fn},...]
         * fn 是给 注册的任务注入参数用的,比如 有任务为teskFn(p1,p2,p3),那么 fn 返回result[]
         * @param teskList
         */
        function executeTaskQueue(teskList,beforeFn,afterFn){
            if(!isArray(teskList)) minErr("队列参数必须为数组");
            var queue = new $$taskQueue();
            forEach(teskList,function(task,index){
                !("id" in task) && minErr("任务队列中的对象必须存在Id");
                !teskMap[task.id] && minErr("任务:"+task.id+"没有注册");
                if(!!task.resolve && !isFunction(task.resolve)) minErr("队列参数的resolve必须为行数");
                queue.push(new $$task(teskMap[task.id],task.resolve,task.params));
            });
            !!beforeFn && queue.before(beforeFn);
            !!afterFn && queue.after(afterFn);
            queue.run();
        }

        return {
            registTask:registTask,
            executeTaskQueue:executeTaskQueue
        }
    }

    function $$taskQueue(){
        this.size = 0;
        this.taskList = [];
        this.beforeFn = noop;
        this.afterFn = noop;
    }
    $$taskQueue.prototype = {
        run:function(){
            injectExecute(this.beforeFn);
            this.size>0 && this.taskList[0].run();
        },
        push:function (task) {
            if(!(task instanceof $$task)){
                return;
            }
            this.size == 0 && task.setHead();
            this.size != 0 && this.taskList[this.size-1].setNext(task);
            task.$setQueue(this);
            this.taskList.push(task);
            this.size++;
        },
        before:function (fn) {
            if(!isFunction(fn)) minErr("队列前置函数类型异常");
            this.beforeFn = fn;
        },
        after:function(fn){
            if(!isFunction(fn)) minErr("队列后置函数类型异常");
            this.afterFn = fn;
        }
    }

    function $$task(teskFn,resolve,params){
        this.nextItem = null;
        this.isThis = false
        this.dataList = [];
        this.isError = false;
        this.teskFn = teskFn;

        if(!!resolve){
            var promiss = injectExecute(resolve,params);
            if(!isPromiseLike(promiss)){
                minErr("队列的resolve必须返回promiss对象")
            }
            var _this = this;
            promiss.then(function(resultList){
                !isArray(resultList) && minErr("队列resolve的结果必须为数组");
                if(resultList.length == 0){
                    _this.dataList.push(true);
                }else{
                    _this.dataList = [].concat(resultList);
                }
                _this.isThis && _this.run();
            },function(e){
                _this.dataList.push(false);
                _this.isError = true;
                _this.isThis && _this.run();
            })
        }else{
            this.dataList.push(true);
        }
    }

    $$task.prototype = {
        setNext:function(next){
            if(next instanceof $$task){
                this.nextItem = next;
            }else{
                minErr("队列中的个体必须为$$task类型");
            }
            return this;
        },
        setHead:function(){
            this.isThis = true;
            return this;
        },
        $setQueue:function (queue) {
            this.queue = queue;
        },
        run:function(){
            this.isThis = true;
            if(this.dataList.length == 0) return;
            if(!this.isError){
                try{
                    this.teskFn.apply(null,this.dataList);
                }catch(e){
                    console.log(e);//有异常时,忽略当前节点任务,只做提示
                    this.next();
                    return this;
                }
            }
            this.next();
            return this;
        },
        next:function(){
            this.isThis = false;
            if(!!this.nextItem){
                this.nextItem.run();
            }else{
                this.queue && this.queue.afterFn && injectExecute(this.queue.afterFn,undefined,this.queue);
            }
            return this;
        }
    }

    var taskQueue = instanceInjector.get("$taskQueue");

    /**
     * 事件总线,用于封闭代码之间的通信
     */
    service("$eventBus",$eventBus);
    $eventBus.$inject=["$cacheFactory"];
    function $eventBus($cacheFactory){
        this.cache = $cacheFactory.getCache("$$eventBus");
    }
    $eventBus.prototype = {
        on:function(eventName,callback,isSingle){
            if(!isString(eventName)) throw "事件名称必须为字符串";
            if(!isFunction(callback)) throw "callback必须为函数";
            if(isSingle || !this.cache.has(eventName)){
                this.cache.put(eventName,[callback]);
            }else{
                this.cache.get(eventName).push(callback);
            }
        },
        singleOn:function(eventName,callback){
            this.cache.put(eventName,callback,true);
        },
        post:function(eventName,event,obj){
            if(!this.cache.has(eventName)) return;
            forEach(this.cache.get(eventName),function(callback){
                try{
                    injectExecute(callback,event,this);
                }catch(e){
                    console.log(e);
                }
            },obj);
        }
    }
    var eventBus = instanceInjector.get("$eventBus");

    /**
     * 在这里你可以看到yangzuo所有的工具API
     * @param yangzuo
     */
    function publishExternalAPI(yangzuo) {
        extend(yangzuo, {
            'isString': isString,
            'isUndefined': isUndefined,
            'isFunction': isFunction,
            'isObject': isObject,
            'isNumber': isNumber,
            'element': Zepto,
            'extend': extend,
            'equals': equals,
            'noop': noop,
            'forEach': forEach,
            'bind': bind,
            'toJson': toJson,
            'fromJson': fromJson,
            'isElement': isElement,
            'isArray': isArray,
            'isDate': isDate,
            'lowercase': lowercase,
            'uppercase': uppercase,
            'injectExecute':injectExecute,
            'service':service,
            'post': bind(eventBus,eventBus.post),
            'on':bind(eventBus,eventBus.on),
            'singleOn':bind(eventBus,eventBus.singleOn),
            'registTask':bind(taskQueue,taskQueue.registTask),
            'executeTaskQueue':bind(taskQueue,taskQueue.executeTaskQueue)
        });
    }

    publishExternalAPI(yangzuo);

})(window, document);