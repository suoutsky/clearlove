/**
 * Created by nemo on 2017/3/6.
 */
/**输出Promise**/
console.dir(Promise);

var hero = new Promise(function(resolve, reject){
    setTimeout(function () {
      console.log('执行完成');
      resolve(console.log('bababa----'));
    })

})