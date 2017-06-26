import Vue from 'vue'
import App from './App.vue'

import router from './router'
import store from './store'
import api from './common/api'
import commonFun from './common/js'
import Resource from 'vue-resource'

import bus from './bus.js'

Vue.use(Resource)

//css
import "./common/sass/index.min.css"
import "./common/sass/animate.css"
//weathericon
import "./common/weatherCss/weather-icons-wind.css"
import "./common/weatherCss/weather-icons.css"

new Vue({
  el: '#app',
  router,
  store,
  data: {
    todayWeatherData: {},
    one: '',
    dayWeatherData:[],
    forecasHourstList: [{ //5天之内每3个小时的天气预报的数据
    //   day: '',
    //   month: '',
    //   data: '',
    //   year: '',
    //   today: '',
    //   hoursWeathers: [{
    //     maxTem: '',
    //     minTem: '',
    //     weatherStatus: '',
    //     speed: '',
    //     humidity: '',
    //     pressure: '',
    //     icon: '',
    //     hours: ''
    //   }]
    }],
    message:''
  },
  render: h => h(App),
  mounted() {

    let that= this;
    this.getBrowserWidthFun(); //获取html的fantasize
    this.getTodayNow();

    this.ajaxTest({});
    this.ajaxTest({
      dayNums: api.apiUrl.DAY,
      weatherOrForecast: api.apiUrl.ROFOREDILY
    });
    this.ajaxTest({
      weatherOrForecast: api.apiUrl.ROUFORE
    });

    bus.$on('enterCityName',function(name){//这是 city-list 中搜索的功能，对城市天气进行查询
      that.message = name;
      that.combineObj();
    });
    bus.$on('switchCityName',function(name){//根据 city-list 和 sider-list 传过来的数据进行查询城市的切换
      that.message = name;
      that.combineObj();
    });
  },

  watch: {
    todayWeatherData: {
      handler: function() {
        console.log(' todayWeatherData 数据取到了');
      },
      deep: true
    }
  },

  methods: {
    combineObj: function() { //把字符串填充到对象中
      var apiArguments = {
        dayNums: '',
        weatherOrForecast: '',
        name: '',
        id: ''
      };
      if (this.message === '') return; //没有输入字符的时候，回车不要自动跳转到默认的城市
      apiArguments.name = this.message;

      this.ajaxTest(apiArguments); //一天

      this.ajaxTest({ //16天之内的天气预报
        dayNums: api.apiUrl.DAY,
        weatherOrForecast: api.apiUrl.ROFOREDILY,
        name: this.message
      })

      this.ajaxTest({ //5天
        weatherOrForecast: api.apiUrl.ROUFORE,
        name: this.message
      })
    },

    ajaxTest: function(apiArguments) { //ajax发送get请求
      var url;
      var id = apiArguments.id || api.apiUrl.APPIDDEF;
      var cityName = apiArguments.name || api.apiUrl.REPLACE;
      var weatherOrForecast = apiArguments.weatherOrForecast || api.apiUrl.ROUWEATHER;
      var dayNums = apiArguments.dayNums || '';
      var main = `${api.apiUrl.URLHEADER}${weatherOrForecast}?q=${cityName}&appid=${id}`;

      if (weatherOrForecast === api.apiUrl.ROUFORE) { //每3个小时的天气预报
        url = `${main}${api.apiUrl.MODEANDUNTIL}`;
        this.getHoursFun(url);
      }
      if (weatherOrForecast === api.apiUrl.ROFOREDILY) { //16天之内的天气预报
        url = `${main}${api.apiUrl.MODEANDUNTIL}&cnt=${dayNums}`;
        this.getDayFun(url);
      }
      if (weatherOrForecast === api.apiUrl.ROUWEATHER) { //一天的天气预报
        url = `${main}${api.apiUrl.MODEANDUNTIL}`;
        this.getTodayDataFun(url);
      }
    },

    getHoursFun(url){
      let that = this;

      this.$http
        .get(url)
        .then(function(res){

           let listLen = res.data.list.length;

           this.forecasHourstList = []; // 清空旧数据

           var tempForcast = null;
           var nowDate = new Date(); //存放首次获得本机的时间

           for (var i = 0; i < res.data.list.length; i++) {
             let tempDate, time;
             tempDate = new Date(res.data.list[i].dt * 1000); //每三小时的时间戳
             time = commonFun.appHandleDataFun.transformTime(tempDate / 1000);

            //  var main = res.data.list[i].weather[0].main;
             var str =res.data.list[i].weather[0].main;
             var weaterJudge = {
               desStr:(res.data.list[i].weather[0].description).split(' ')[0],
               main:str[0].toLowerCase()+str.substr(1)
             };


             var tempHourlyWeather = { //每三小时的数据
               minTem: res.data.list[i].main.temp_min + api.apiUnit.TEMP,
               maxTem: res.data.list[i].main.temp_max + api.apiUnit.TEMP,
               weatherStatus: res.data.list[i].weather[0].description,
               speed: res.data.list[i].wind.speed + api.apiUnit.SPEED,
               clouds: res.data.list[i].main.humidity + api.apiUnit.PERCENTSIGN,
               pressure: res.data.list[i].main.pressure + api.apiUnit.PRESSURE,
               icon: commonFun.publicFun.getIconImgFun(weaterJudge),
               hours: `${time.hours}:${time.minutes}`
             };

             if (i === 0 || tempForcast.date !== tempDate.toDateString()) {

               if (i !== 0) { //把同一天
                 this.forecasHourstList.push(tempForcast)
               }

               tempForcast = {
                 date: tempDate.toDateString(),
                 hoursWeathers: [tempHourlyWeather]
               }

               if (nowDate.toDateString() === tempDate.toDateString()) {
                 tempForcast.today = true
               } else {
                 tempForcast.today = false
               }

             } else { //是同一天的话就直接把天气的信息直接插入到该天的天气列表中
               tempForcast.hoursWeathers.push(tempHourlyWeather)
             }
           }

           if (tempForcast) {
             this.forecasHourstList.push(tempForcast)
           }
           this.informHoursBus();
        },function(err){
          console.log(err);
        })

    },
    getDayFun:function(url){//16天的数据

      var that = this;

      this.$http
        .get(url)
        .then(function(res){
          var data = res.data;
          if(data.cod === '200'){
              var that = this;
              var newData = data.list;
              this.dayWeatherData = [];
              newData.map(function(item,index){

                  if(!that.dayWeatherData[index]){

                    var forecastTime={};
                    var nowDate = (+new Date()) / 1000;
                    var time = commonFun.appHandleDataFun.transformTime(nowDate, index);
                    forecastTime.day = commonFun.appHandleDataFun.transformDay(time.day + index);
                    forecastTime.date = time.date;
                    forecastTime.month = commonFun.appHandleDataFun.transformMonth(time.month);

                    // var main = item.weather[0].main;
                    var str = item.weather[0].main;
                    var weaterJudge = {
                      desStr:(item.weather[0].description).split(' ')[0],
                      main:str[0].toLowerCase()+str.substr(1)
                    };

                    var obj={
                      clouds:item.clouds,
                      deg:item.deg,
                      humidity:item.humidity,
                      speed:item.speed,
                      temp:item.temp.day,
                      tempMax:item.temp.max,
                      tempMin:item.temp.min,
                      description:item.weather[0].description,
                      icon:commonFun.publicFun.getIconImgFun(weaterJudge),
                      idIcon: item.weather[0].id,
                      main:item.weather[0].main,
                      day:forecastTime.day,
                      date:forecastTime.date,
                      month:forecastTime.month
                    };

                    that.dayWeatherData.push(obj);
                  }
              });
              this.informDayBus();
          }
        },
        function(){

        });
    },
    getBrowserWidthFun:function() {
      var browserSize = commonFun.publicFun.getBrowserWidth();
      var ele = document.getElementsByTagName('html')[0];

      this.$store.state.browserH = browserSize.height;

      console.log(this.$store.state.browserH);
      if (ele) {
        ele.style.fontSize = browserSize.width / 100 + 'px';
      }
    },
    getTodayDataFun:function(url) {

      this.$http
        .get(url)
        .then(function(res) {
          var data = res.data;

          var str = data.weather[0].main;
          var weaterJudge = {
            desStr:(data.weather[0].description).split(' ')[0],
            main:str[0].toLowerCase()+str.substr(1)
          };

          console.log();
          this.todayWeatherData = {
            name: data.name,
            country: data.sys.country,
            lon: data.coord.lon,
            lat: data.coord.lat,
            humidity: data.main.humidity + api.apiUnit.PERCENTSIGN,
            pressure: data.main.pressure + api.apiUnit.PRESSURE,
            temp: data.main.temp + api.apiUnit.TEMP,
            description: data.weather[0].description,
            icon: commonFun.publicFun.getIconImgFun(weaterJudge),
            idIcon: data.weather[0].id,
            main: data.weather[0].main,
            speed: data.wind.speed + api.apiUnit.SPEED,
            deg: data.wind.deg,
            clouds:data.clouds.all + api.apiUnit.PERCENTSIGN
          };

          this.$store.state.cityName = data.name;
          this.informTodayBus();
        }, function(err) {
          console.log(err);
        });
    },


    informTodayBus:function () { //把数据发送给子组件
      bus.$emit("getCityName",this.todayWeatherData.name);//传 cityname >> 子组件 header.vue
      bus.$emit("getTodayData",this.todayWeatherData);//传 cityname >> 子组件 header.vue
      bus.$emit("todoCityName");//把获取到的 cityName >> 子组件city-list.vue
    },
    informDayBus:function() {
      bus.$emit("getDayData",this.dayWeatherData);//传 13 天之内的数据 >> 子子组件 weather-list.vue
    },
    informHoursBus:function(){
      bus.$emit("getHoursData",this.forecasHourstList);//传 5天之内的每 3 小时的数据 >> 子子组件 weather-hour.vue
    },

    getTodayNow:function() { //传当天的天气的数据 >> vuex( src/store/index.js )
      this.$store.state.todayWeather = this.todayWeatherData;
    }
  }
});
