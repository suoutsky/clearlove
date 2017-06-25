// 结果显然   注意点 function(){} 闭包    指向同一内存地址 可是context是独立的

var a = {name: 1};
var b = a;

console.log(a);
console.log(b);

b.name = 2;
console.log(a);
console.log(b);

var b = {name: 3};
console.log(a);
console.log(b);