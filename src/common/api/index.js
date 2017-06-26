const apiUrl = {
  DAY: 13, //获取到16天之内的天,
  IMASRC: 'http://api.openweathermap.org/img/w/', //图片的sr,
  SRCSUFFIX: `.png`,

  // url
  URLHEADER: 'http://api.openweathermap.org/data/2.5/',
  MODEANDUNTIL: '&units=metric&mode=json',
  ROFOREDILY: 'forecast/daily',
  ROUFORE: 'forecast',
  ROUWEATHER: 'weather',

  // 默认参数
  APPIDDEF: 'dd561652b90af3a2408ea80b668650d7',
  REPLACE: 'beijing'
}

// 单位
const apiUnit = {
  TEMP: '°C',
  PRESSURE: 'pha',
  SPEED: 'm/s',
  PERCENTSIGN: '%',
  ACTIVE: 'active'
}

const apiConst = {
  HEIGHT : 60,
  SCROLLIND: 0//dun ddun ds
}

export default {
  apiUrl,
  apiUnit,
  apiConst
}
