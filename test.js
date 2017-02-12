/**
 * Created by Rayr Lee on 2016/10/8.
 */

var str = "Visit W3School";
var patt1 = new RegExp(1);

var result = patt1.test(str);

console.log("Result: " + result);


// function search() {
//     if(!vm.appIds)return;
//     var patt = new RegExp(vm.appIds);
//     if(!patt.test(/^[1-9]+[0-9,]*[1-9]+$/)){
//         model.message("appId必须为整数，多个用逗号隔开");
//         return;
//     }
// }

//new 操作符
var obj = new Base();
var obj = {};
obj.__proto__ = Base.prototype;
Base.call(obj);