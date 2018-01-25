// 在本例中,正则表达式在创建之后都处于编译后的状态。
// 如果我们将re1的引用再替换成
var re1 = /test/i;
var re2 = new RegExp('test', 'i');

console.log(re1.toString(), re1.toString() === '/test/i');
