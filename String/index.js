
var data =  {
        "floorTitle": "精选推荐",
        "list": [
            {
                "credits": "299",
                "image": "//yun.duiba.com.cn/images/201609/6aqdrdp95o.jpg",
                "link": "//goods.m.duiba.com.cn/mobile/appItemDetail?spm=14695.2.4.40&appItemId=529848&dbnewopen",
                "logo": "//yun.duiba.com.cn/images/201609/q6b9x3ud4m.jpg",
                "recommendText": "兑换",
                "stInfo": "{\"app_item_id\":529848,\"info_type\":\"3\",\"location_type\":4,\"location_num\":40,\"domain\":\"//embedlog.duiba.com.cn/\",\"consumer_id\":243734603,\"button_type\":\"190003\",\"app_id\":14695,\"ip\":\"115.238.95.186\",\"info\":\"529848\",\"login_type\":1}",
                "tagClasses": "custom",
                "tagColor": "#05b2c2",
                "tagText": "+16.8元",
                "title": "蜂胶嫩肤面膜5片",
                "type": "coupon",
                "whiteImage": "//yun.duiba.com.cn/images/201609/6aqdrdp95o.jpg"
            },
            {
                "credits": "299",
                "image": "//yun.duiba.com.cn/images/201701/ktx6m0xdf0.jpg",
                "link": "//goods.m.duiba.com.cn/mobile/appItemDetail?spm=14695.2.4.47&appItemId=750860&dbnewopen",
                "logo": "//yun.duiba.com.cn/images/201701/9zmcp3zub1.png",
                "recommendText": "兑换",
                "stInfo": "{\"app_item_id\":750860,\"info_type\":\"3\",\"location_type\":4,\"location_num\":47,\"domain\":\"//embedlog.duiba.com.cn/\",\"consumer_id\":243734603,\"button_type\":\"190003\",\"app_id\":14695,\"ip\":\"115.238.95.186\",\"info\":\"750860\",\"login_type\":1}",
                "tagClasses": "",
                "tagText": "",
                "title": "爱听30天会员",
                "type": "coupon",
                "whiteImage": "//yun.duiba.com.cn/images/201701/ktx6m0xdf0.jpg"
            }
        ],
        "success": true
    }



    for (var i= 0; i < data.list.length; i++) {
        var jsonObj = eval("("+data.list[i].stInfo+")");
        // console.log(jsonObj.app_item_id)
        data.list[i].app_item_id = jsonObj.app_item_id;
        console.log(data.list[i], data.list[i].app_item_id);
    }

