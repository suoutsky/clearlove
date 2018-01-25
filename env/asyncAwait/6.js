// 使用 Promise.all() 让多个 await 操作并行
const fetch = require('node-fetch');

async function getZhihuColumn(id) {
  const url = `https://zhuanlan.zhihu.com/api/columns/${id}`;
  const response = await fetch(url);
  return await response.json();
}

const showColumnInfo = async () => {
  // 并行
  // showColumnInfo: 4415.146ms
  const [feweekly, toolingtips] = await Promise.all([
    getZhihuColumn('feweekly'),
    getZhihuColumn('toolingtips'),
  ]);

  // 串行
  // showColumnInfo: 4544.302ms
  // const feweekly = await getZhihuColumn('feweekly');
  // const toolingtips = await getZhihuColumn('toolingtips');
  console.log(`NAME: ${feweekly.name}`);
  console.log(`INTRO: ${feweekly.intro}`);

  console.log(`NAME: ${toolingtips.name}`);
  console.log(`INTRO: ${toolingtips.intro}`);
};

showColumnInfo();