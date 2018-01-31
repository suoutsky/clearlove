// async 起什么作用 (https://segmentfault.com/a/1190000007535316)
async function testAsync() {
  return "hello async";
}
const result = testAsync();
console.log(result);   
// 看到输出就恍然大悟了——输出的是一个 Promise 对象。
// Promise { 'hello async' }
testAsync().then(v => {
  console.log(v);    // 输出 hello async
});