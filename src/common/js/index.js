const publicFun = {
  getIconImgFun(item){

    switch (item.main) {

            case 'clouds':
            item=this.getCloudsIcon(item.desStr);
            break;

            case 'clear':
            item=this.getClearIcon(item.desStr);
            break;

            case 'rain':
            item=this.getRainIcon(item.desStr);
            break;

            default:
            item;
    }

    return `wi-day-${item}`;
  },

  getCloudsIcon(descri){//云
      switch (descri) {
        case 'scattered':
        return 'sunny-overcast';

        case 'broken':
        return 'cloudy-high';

        case 'overcast':
        return 'fog';

        case 'few':
        return 'cloudy-gusts';
      }
  },

  getClearIcon(descri){//晴
      switch (descri) {
        case 'sky':
        case 'clear':
        return 'sunny';
      }
  },

  getRainIcon(descri){//雨
      switch (descri) {
        case 'light':
        return 'showers';

        case 'moderate':
        return 'rain-wind';

        case 'heavy':
        return 'rain';

        case 'very':
        return 'thunderstorm';
      }
  },

  getBrowserWidth() {

    return {
     width:  window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth,
     height: window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight
   };
  },

  getEleHeight(ele) {

    return ele.getBoundingClientRect().height;
  },


  speedJudgeFun(speedJudge) { //根据风速判断，描述风的内容

    if (speedJudge >= 32.7) return 'Hurricane force ';

    if (speedJudge >= 28.5) return 'Violent storm ';

    if (speedJudge >= 24.5) return 'Storm ';

    if (speedJudge >= 20.8) return 'severe gale ';

    if (speedJudge >= 17.2) return 'moderate gale ';

    if (speedJudge >= 10.8) return 'Strong breeze ';

    if (speedJudge >= 8) return 'Fresh breeze ';

    if (speedJudge >= 5.5) return 'Moderate breeze ';

    if (speedJudge >= 3.4) return 'Gentle breeze ';

    if (speedJudge >= 1.6) return 'Light breeze';

    if (speedJudge >= 0.3) {
      return 'Light air ';
    } else {
      return 'Calm ';
    }
  },

  toTextualDescription: function toTextualDescription(degree) { //根据角度，描述风向

    if (degree > 337.5) return '北风 ';

    if (degree > 292.5) return '西北风 ';

    if (degree > 247.5) return '西风 ';

    if (degree > 202.5) return '西南风 ';

    if (degree > 157.5) return '南风 ';

    if (degree > 122.5) return '东南风 ';

    if (degree > 67.5) return '东风 ';

    if (degree > 22.5) {
      return '东南风 ';
    } else {
      return '北风 ';
    }
  }
}
//和pp内的数据关系密切的函数
const appHandleDataFun = {

  transformTime(sun, i) { //转化时间

    let time = {};
    const JUDGETIME = 12;
    let newDateNums = new Date(sun * 1000);

    let newDateTestH = newDateNums.getHours(); //获取小时
    time.hours = this.timeFun(newDateTestH);

    time.dercTime = newDateTestH >= JUDGETIME ? 'PM' : 'AM';

    let newDateTestM = newDateNums.getMinutes(); //获取分钟
    time.minutes = this.timeFun(newDateTestM);

    let newDateTestD = newDateNums.getDate(); //获取日期
    time.date = this.timeFun(newDateTestD, i);

    let newDateTestDay = newDateNums.getDay(); //获取星期
    time.day = newDateTestDay;

    let newDateTestMo = newDateNums.getMonth() + 1; //获取月份
    time.month = this.timeFun(newDateTestMo);

    let newDateTestY = newDateNums.getFullYear(); //获取年
    time.year = this.timeFun(newDateTestY);

    return time;
  },

  timeFun(timeNum, i) { //具体的天数，是否添加zero

    var time;

    if (i || i === 0) {
      time = this.nothingZero(timeNum, i);
    } else {
      time = this.addZero(timeNum);
    }
    return time;
  },

  nothingZero(timeNum, day) { //计算16天之内的天数，只显示一位数字的时候不会显示‘0’；

    const MONTHDAY = 30;

    return (timeNum + day) % MONTHDAY;
  },

  addZero(timeNum) { //给只有一位数的数字，添加‘0’；

    var addZeroTime;

    if (timeNum.toString().length <= 1) {
      addZeroTime = '0' + timeNum;
    } else {
      addZeroTime = timeNum;
    }

    return addZeroTime;
  },

  transformDay(i) { //数字转化为文字；

    var weeks = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']

    return weeks[i % 7];
  },

  transformMonth(monthStr) { //转化为月份

    var init = '';
    var months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']

    return months[(+monthStr) - 1];
  }
}

//ES6导出语法
export default {
  publicFun,
  appHandleDataFun
}
