
// js 非基本类型按引用传递 ,这种直接赋值的方式就是浅拷贝
var arr = ['a', 'b', 'c'];

var arrto = arr;

arrto[1] = 'test';

console.log(arr);    //[ 'a', 'test', 'c' ]
console.log(arrto);  //[ 'a', 'test', 'c' ]

//其实我们想要的是arr的值不变

//方法1 slice 

// arrayObj.slice(start, [end]);返回一个新的数组。

var arr1 = ["One","Two","Three"];

var arrto1 = arr1.slice(0);
arrto1[1] = "set Map";
console.log(arr1);    //[ 'One', 'Two', 'Three' ]
console.log(arrto1);  //[ 'One', 'Two', 'Three' ]

// 方法2 concat方法

//arrayObject.concat(arrayX,arrayX,......,arrayX); 返回一个新的数组。
arr2 = ['tim', 'kobe', 'curray'];
var arrto2 = arr2.concat();
arrto2[0] = 'mvp';
console.log(arr2);    //[ 'tim', 'kobe', 'curray' ]
console.log(arrto2);  //[ 'mvp', 'kobe', 'curray' ]

