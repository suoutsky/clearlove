
// 并不是所有的函数加上await就是按照同步的顺序执行
let request = require('request');

var ticket;
var name;
var email;

function f1() {
  let o = {
    url: 'http://' + '192.168.2.82:8888' + '/remoteSSOService/findTicketByStamp?_p0=16&_p1=%221516884377652%22',
    method: 'get',
    strictSSL: false,
    timeout: 1500,
    headers: {
      'X-Rpc': 'true',
      'Content-Type': 'application/x-www-form-urlencoded',

    },

  };
  console.log('fn1')
  request(o, (err, response, body) => {
    console.log('--------------------re1()start--------------------------')
  });

}
function f2() {
  var oo = {
    url: 'http://' + '192.168.2.82:8888' + '/remoteSSOService/verifyTicketAndGetAdmin?_p0=%22' + ticket + '%22',
    method: 'get',
    strictSSL: false,
    timeout: 1500,
    headers: {
      'X-Rpc': 'true',
      'Content-Type': 'application/x-www-form-urlencoded',

    }
  };
  console.log('fn2')
  request(oo, (err, response, body) => {
    console.log('--------------------re2()start--------------------------')
  });
}
const showColumnInfo = async () => {
  await f1();   
  // 如果它等到的不是一个 Promise 对象，那 await 表达式的运算结果就是它等到的东西。
  // 如果它等到的是一个 Promise 对象，await 就忙起来了，它会阻塞后面的代码，等着 Promise 对象 resolve，然后得到 resolve 的值，作为 await 表达式的运算结果。
  await f2();
}

showColumnInfo();