
console.log(1);

setTimeout(function() {
  console.log(2);
}, 0);

console.log(3);

//任务队列
var stack = [];

function fn1() {
  console.log('第一个调用');
}
stack.push(fn1);

function fn2() {
  console.log('第二个调用');
}
stack.push(fn2, function() { console.log('第三个调用') });

stack.forEach(function(fn) { fn() }); // 按顺序输出'第一个调用'、'第二个调用'、'第三个调用'