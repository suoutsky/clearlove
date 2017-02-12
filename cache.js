/**数据缓存*/
service("$cacheFactory",$cacheFactory);
$cacheFactory.$inject = [];
function $cacheFactory(){
  var caches = createMap();
  return {
    getCache: getCache
  };
  function getCache(cacheId){
    if(cacheId in caches){
      return caches[cacheId];
    }else {
      return caches[cacheId] = new $Cache(cacheId, caches);
    }
  }

 function $Cache(cacheId){
   this.state = {size:0, cacheId:cacheId}, this.data = {};
   this.caches = caches;
 }

$Cache.protoype = {
  info: function() {
    return this.state;
  },
  destory: function() {
    this.data = null;
    var cacheId = this.state.cacheId;
    this.state = null;
    delete this.caches[cacheId];
  }
}


}
