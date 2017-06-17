// 基本类型 Undefined Null Boolean Number String      //复杂类型 Object
/**
 * "undefined"  这个值未定义 
 * "object"  这个值是对象或者null
 * "function" 这个值是函数
 */

console.log(typeof null);  //object
console.log(typeof undefined); //undefined
console.log(null == undefined); //true 
console.log(null === undefined); //内存地址不同
// >>>>>>>>>未定义
var a;
if(a) {
  console.log('if (a == true)');
} else {
  console.log('if (a == false)');
  console.log('a >' + a);
}
console.log("已声明 var a; 未定义"+typeof a); //undefined
console.log("未声明  未定义" + typeof b); //undefined

// >>>>>>>>>未声明
//if(b) {
//   ^
//ReferenceError: b is not defined  产生错误

// if(b) {
//   console.log('if (b == true)');
// } else {
//   console.log('if (b == false)');
//   console.log('b >' + a);
// }


// null 表示空指针 返回object
var house = null;
console.log('null >>>>>>' + typeof house);



// 应用;
/**
 * 意在保存对象的的变量还没有保存真正的对象 就应该明确让该变量 保存null;
 */