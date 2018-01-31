// demo1
// 范围表示法
var regex1 = /[1-6a-fG-M]/g;
var string = "123456abcdefGHIJKLM";
console.log('范围表示法', string.match(regex1));
// 贪婪匹配与惰性匹配

// demo2
// 但是其是贪婪的，它会尽可能多的匹配。你能给我 6 个，我就要 5 个。你能给我 3 个，我就要 3 个。
// 反正只要在能力范围内，越多越好。
var regex2 = /\d{2,5}/g;
 string = "123 1234 12345 123456";
console.log('贪婪', string.match(regex2));

// demo3
// 而惰性匹配，就是尽可能少的匹配:
  var regex = /\d{2,5}?/g;
  var string = "123 1234 12345 123456";
  console.log('惰性', string.match(regex) );
