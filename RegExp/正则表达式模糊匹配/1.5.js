// demo1 颜色
var string = "#ffbbad #Fc01DF #FFF #ffE";
var regex1 = /#([0-9a-fA-F]{6}|[0=9a-fA-F]{3})/g;
console.log(string.match(regex1));

// demo2 时间匹配 
var regex2 = /^[01][0-9]|[2][0-3]:[0-5][0-9]$/;
console.log( regex2.test("23:59") );
console.log( regex2.test("02:07") );

// demo3 匹配日期
var regex3 = /^[0-9]{4}-(0[1-9]|1[0-2])-(0[1-9]|[12][0-9]|3[01])$/;
console.log( '匹配日期', regex3.test("2017-06-10") );
// => true

// demo4 匹配id
// 贪婪
var string = '<div id="container" class="main"></div>';
var regex4 = /id=".*"/
console.log(string.match(regex4)[0]);
// 惰性
var regex5 = /id=".*?"/;
console.log(string.match(regex5)[0]);

// 优化
var regex = /id="[^"]*"/
console.log(string.match(regex)[0]);
// => id="container"