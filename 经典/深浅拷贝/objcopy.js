// 对象的深浅拷贝
var a = { name: 'tim', type: 'mvp'};
var b = {};
b.name = a.name;
b.type = a.type;
a.name = 'mamu';
console.log(a);  //{ name: 'mamu', type: 'mvp' }
console.log(b);  //{ name: 'tim', type: 'mvp' }


// 深拷贝方法
var deepCopy= function(source) { 
  var result={};
  for (var key in source) {
    result[key] = typeof source[key]==='object'? deepCoyp(source[key]): source[key];
  } 
  return result;
}
