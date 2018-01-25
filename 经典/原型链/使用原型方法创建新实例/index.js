function NinJa() {}

// 原型可以让我们预定义属性， 包括属性和方法自动应用在新对象上
NinJa.prototype.swingSword = function() {
  console.log('prototype', true);
  return true;
};

var ninja1 = NinJa();
console.log('ninja1 === undefined', ninja1 === undefined);

var ninja2 = new NinJa();
console.log('ninja2 !== undefined', ninja2 !== undefined);

// ninja的构造函数
try {
  console.log(ninja1.constructor);
} catch(err) {
  console.log('catch err::::', 'ninja1 no constructor');
}
console.log('ninja2.constructor:::', ninja2.constructor);
console.log('ninja2.constructor.prototype:::', ninja2.constructor.prototype);

