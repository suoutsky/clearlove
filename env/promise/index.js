/**
 * Created by nemo on 2017/2/12.
 */
let promise = new Promise(resolve => {
  setTimeout(() => {
      resolve('---promise timeout-----');
  }, 2000);
});
promise.then(value => console.log(value));