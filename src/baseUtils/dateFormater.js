(function(global){

  global.Date.prototype.format = function (str) {
    var d = this;
    if (!(d instanceof Date)) {
      return 'Date-error';
    }
    var res   = str + '',
    year  = d.getFullYear(),     // yyyy yy
    month = d.getMonth() + 1,    // MM M
    day   = d.getDate(),         // dd d
    hour  = d.getHours(),        // hh h
    minite = d.getMinutes(),     // mm m
    second = d.getSeconds();     // ss s

    res = res
    .replace(/yyyy/, year)
    .replace(/yy/, (year + '').substr(2, 2))
    .replace(/MM/, (month > 9 ? month + '' : '0' + month))
    .replace(/M/, month)
    .replace(/dd/, (day > 9 ? day + '' : '0' + day))
    .replace(/d/, day)
    .replace(/hh/, (hour > 9 ? hour + '' : '0' + hour))
    .replace(/h/, hour)
    .replace(/mm/, (minite > 9 ? minite + '' : '0' + minite))
    .replace(/m/, minite)
    .replace(/ss/, (second > 9 ? second + '' : '0' + second))
    .replace(/s/, second);
    return res;
  }

})(window);
