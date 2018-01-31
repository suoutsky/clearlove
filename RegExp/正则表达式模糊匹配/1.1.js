// 正则表达式是匹配模式，要么匹配字符，要么匹配位置。 请记住这句话。
// 1.1. 两种模糊匹配
// demo1
var regex1 = /hello/;
console.log(regex1.test("hello") );
// => true


// demo2  
// desc 横向模糊匹配
var regex2 = /ab{2,5}c/g;
var string = "abc abbc abbbc abbbbbc abbbbbbc";
console.log('横向模糊匹配', string.match(regex2));

// demo3
// desc 纵向模糊匹配

var regx3 = /a[123]b/g;
var string = "a0b a1b a2b";
console.log('纵向模糊匹配', string.match(regx3));