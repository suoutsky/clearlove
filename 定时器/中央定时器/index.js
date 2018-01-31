var timers = {
  timerID: 0,
  timers: [],
  add: function(fn) {
    this.timers.push(fn);
  },
  // 在即时函数内，如果注册了处理程序，
  // 就遍历执行每个处理程序。
  // 如果有处理程序返回false，
  // 我们就从数组中将其删除，最后进行下一次调度。
  start: function() {
    if (this.timerID) return;
    // IIFE 运行队列
    (function runNext() {
      if (timers.timers.length > 0) {
        for (var i=0; i < timers.timers.length; i++ ) {
          if (timers.timers[i]() === false) {
            timers.timers.splice(i, 1);
            i--;
          }
        }
        timers.timerID = setTimeout(runNext, 0);
      }
    })();
  },
  stop: function() {
    clearTimeout(this.timerID);
    this.timerID = 0;
  }
}