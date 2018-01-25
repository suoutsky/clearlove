// 基本类型 Undefined Null Boolean Number String      //复杂类型 Object
/**
 * "undefined"  这个值未定义 
 * "object"  这个值是对象或者null
 * "function" 这个值是函数
 * "blooean"  这个值是布尔值
 */
console.log(0.1+0.3); // node 环境0.4 浏览器 0.30000000000000004 IEEE754bug
console.log(Number.MAX_VALUE); //1.7976931348623157e+308  

// 所有涉及 NaN的操作都会返回NaN
console.log(NaN == NaN); //false
console.log(isNaN(10)); //false
console.log(isNaN('10')); //false 可以被转化为10
console.log(isNaN('blue'));//true 不可以转化为数值
console.log(isNaN(true)); //false 可以被转为1

// 转型函数Number()
/**
 * Blooean 0或1
 * 数字 简单的传入与返回
 * null 返回0
 * undefined 返回 NaN
 * 字符串 ---> 
 * 1.只含数字“1” 返回10进制数字
 * 2.浮点 “1.1” 返回10进制的 1.1
 * 3.空字符返回 0
 * 4.其他 转化为 NaN
 */

console.log("apple"); //NaN
console.log(" "); //0
console.log("00011"); //00011
console.log(true); //1
console.log("apple");


//parseInt(x, y)    规则看是否符合数值格式
/**
 * @param x 传入数值
 * @param y 指定进制
 */

console.log(070);  //es3 认为 8进制 56    二是 认为10进制 70



