let request = require('request');

var ticket;
    var name;
    var email;
    // log.info("req.param('ssoStamp'):"+req.param('ssoStamp'))

     async function f1(){
      let o = {
        url: 'http://' + '192.168.2.82:8888' + '/remoteSSOService/findTicketByStamp?_p0=16&_p1=%221516884377652%22',
        method: 'get',
        strictSSL: false,
        timeout: 1500,
        headers: {  
          'X-Rpc': 'true',
          'Content-Type':'application/x-www-form-urlencoded',
             
        } ,
        
      };
      request(o, (err, response, body) => {
        console.log('--------------------re()start--------------------------')
      });

    }
     function f2(){
      var oo = {
        url: 'http://' + '192.168.2.82:8888' + '/remoteSSOService/verifyTicketAndGetAdmin?_p0=%22'+ticket+'%22',
       method: 'get',                          
       strictSSL: false,
       timeout: 1500,
       headers: {  
         'X-Rpc': 'true',
         'Content-Type':'application/x-www-form-urlencoded',
        
       }
      };
        request(oo, (err, response, body) => {
        console.log('--------------------ree()start--------------------------')
      });

    }
     const showColumnInfo = async () => {
        f1();
      // await f2();
      // await f3();
    }

        showColumnInfo();
        var testasync = f2();
        console.log('testasync', testasync);