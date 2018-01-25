// 结合 await 和任意兼容 .then() 的代码
const bluebird = require('bluebird');

async function main() {
  console.log('waiting...');
  await bluebird.delay(2000);
  console.log('done!');
}

main();