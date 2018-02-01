  const data = {
    "id": 1,
    "categoryName": "报表管理",
    "list": [
      {
        "id": 2,
        "categoryName": "推啊",
        "list": [
          {
            "id": 4,
            "categoryName": "媒体运营",
            "list": [],
            "queryList": [
              {
                "chartQueryId": 6,
                "queryName": "test",
                "isCheck": 0
              },
              {
                "chartQueryId": 4,
                "queryName": "string",
                "isCheck": 0
              },
              {
                "chartQueryId": 7,
                "queryName": "line_test",
                "isCheck": 0
              }
            ]
          },
          {
            "id": 5,
            "categoryName": "活动运营",
            "list": [],
            "queryList": []
          },
          {
            "id": 6,
            "categoryName": "渠道运营",
            "list": [],
            "queryList": []
          }
        ],
        "queryList": []
      },
      {
        "id": 3,
        "categoryName": "兑吧",
        "list": [],
        "queryList": []
      },
      {
        "id": -1,
        "categoryName": "其他",
        "list": [
          {
            "id": -2,
            "categoryName": "未分类",
            "list": [],
            "queryList": [
              {
                "chartQueryId": 5,
                "queryName": "string2",
                "isCheck": 0
              }
            ]
          }
        ],
        "queryList": []
      }
    ],
    "queryList": []
  }


let  res = {};

res.child = data.list;

res.child.forEach(item => {
  item.parentId = 0;
  item.click = false;
  item.name = item.categoryName;
  item.child = item.list;
  item.child.forEach(item1 => {
    item.parentId = item.id;
    item1.click = false;
    item1.name = item1.categoryName;
    item1.child = item1.list;
    item1.child.forEach(item2 => {
      item2.parentId = item2.chartQueryId;
      item2.id = item2.chartQueryId;
      item2.click = item2.isCheck;
      item2.child = item2.queryList;
      item2.name = item2.queryName;
    });
  });
});

console.log(res);


let a = 'chartQueryId22';
let regex = /\D{1,}/g;
console.log(a.match(regex));