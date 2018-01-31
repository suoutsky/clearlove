// import { setTimeout } from 'timers';

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
  // request(o, (err, response, body) => {
  //   console.log('--------------------re1()start--------------------------')
  // });
  setTimeout(()=> {
    console.log('1000s');
  }, 1000)

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
  // request(oo, (err, response, body) => {
  //   console.log('--------------------re2()start--------------------------')
  // });
  setTimeout(()=> {
    console.log('2000s');
  }, 2000)

}
const showColumnInfo = async () => {
  await f1();
  await f2();
}

showColumnInfo();