<template lang="html">
  <div class="forecast-contain" ref="forecastCon">

        <!-- <div class="positon-contain"> -->

          <div class="forecast-list" v-for="forecasHoursItem in forecasHourstListData" ref="forelist">
            <h2 class="forecast-hours-title" ref="hoursTitle">
              <span class="time-content">{{forecasHoursItem.day}} {{forecasHoursItem.month}} {{forecasHoursItem.date}} {{forecasHoursItem.year}}</span>
              <span class="is-taday" v-if="forecasHoursItem.today">today</span>
            </h2>
            <div class="forecast-right" ref="forecastItem" v-for="hoursWeatherList in forecasHoursItem.hoursWeathers">

              <div class="forecast-item">

                  <div class="day-icon-contain">
                    <i class="day-icon wi" :class="[hoursWeatherList.icon]"></i>
                  </div>

                  <div class="other-status-contain">

                    <p class="min-weather-status-temperature">
                      <span class="min-temperature">{{hoursWeatherList.weatherStatus}}</span>
                    </p>

                    <p class="temp-speed-clouds-pressure-contain">
                      <span class="min-temperature">{{ hoursWeatherList.minTem}}</span>
                      <span class="max-temperature">{{ hoursWeatherList.maxTem}}</span>
                    </p>

                  </div>
                </div>

                <div class="forecast-left">
                    <div class="time-contain">
                      <div class="hours-mun">{{ hoursWeatherList.hours }}</div>
                    </div>
                </div>

            </div>
          </div>
        <!-- </div> -->

        <div class="hours-sider-bar-wrapper" ref="hoursSiderBar">
          <div class="hours-sider-bar-contain">

            <ul class="sider-bar-contain">
              <li class="sider-month sider-item-contain">
                <span class="sider-text">{{ time }}</span>
              </li>
              <li class="sider-item-contain" :class="{'selected-date': judgeSelected(index) }" @click="clickDataFun(index)" v-for="(timeList,index) in forecasHourstListData">
                <!-- <div class="sider-item"> -->
                  <span class="sider-text">{{timeList.date | filterDay }}</span>
                <!-- </div> -->
                <!-- index === indexLocation -->
              </li>
            </ul>

          </div>
        </div>
      </div>
</template>

<script>
import bus from '../bus.js'
import commonFun from '../common/js'
import api from '../common/api'

export default {
  props:['heightchlid'],
  data(){
    return{
      forecasHourstListData:[
        // {
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
        // }
      ],
      time:'',
      indexLocation:'',
      listObj:null,
      scrollHeight:0,
      differenceVal:0,
      maxNum:0,
      minNum:0,
      recordDifference:[]
    }
  },
  computed:{

  },
  filters:{
    filterDay(value){
      return value.split(' ')[2];
    },
    filterMonth(value){
      return value.split(' ')[1];
    }
  },
  mounted(){

    let that = this;
    bus.$on('getHoursData',function(obj){//main.js中流过来，获取每三小时的数据
      that.getDayDataFun(obj);
    });
    bus.$on('sendMainHeaderH',function(val){//从mian-header.vue中流过来
      that.getEleHeight(val);
    });

    this.getTime();//获得月份
    this.clickDataFun(api.apiConst.SCROLLIND);//
  },

  methods:{

    judgeSelected(index){

      return index === this.indexLocation;
    },

    getTime(){
      this.time=new Date().toDateString().split(' ')[1];
    },

    scrollFun(){//监听滚动条的高度
      this.$refs.forecastCon.addEventListener('scroll',()=>{
        if(this.recordDifference[1]>this.recordDifference[0] || this.recordDifference.length<2){
          this.getPara();
          this.downSrollFun();
        }else{
          this.getPara();
          this.upSrollFun();
        }
      });
    },

    getPara(){//获得基本的参数，单个元素的高度，滚动动的高度
      let forecastItem=this.$refs.forecastItem[0].offsetTop;
      let hoursTitle=this.$refs.hoursTitle[0].offsetTop;
      this.differenceVal = forecastItem-hoursTitle;//获得一个元素的高度 134

      this.scrollHeight = this.$refs.forecastCon.scrollTop;//滚动的高度，可以计算出整个列表的高度

      this.recordDifference.push(this.scrollHeight);//只存两个数据用来判断递增还是递减
      if( this.recordDifference.length > 2 ){
        this.recordDifference.shift()
      }
    },

    upSrollFun(){

      if(this.indexLocation === 0){
          return;
      }else{

        let itemA = this.indexLocation-1;
        this.minNum = this.getBoundNum(itemA);
      }

      if( this.scrollHeight > this.minNum ){
        this.indexLocation = this.indexLocation;
      }else{
        this.indexLocation = --this.indexLocation;
      }
    },

    downSrollFun(){//处理向下联动的效果

      if(this.indexLocation === 0){

        this.minNum = 0;
        this.maxNum = this.getBoundNum(this.indexLocation);
      }else{
        let itemA = this.indexLocation-1;
        let itemB = this.indexLocation;

        this.minNum = this.getBoundNum(itemA);
        this.maxNum = this.getBoundNum(itemB);
      }

      if( this.scrollHeight >= this.minNum  &&
        this.scrollHeight < this.maxNum ){

        this.indexLocation = this.indexLocation;
      }else{
        this.indexLocation = ++this.indexLocation;
      }
      if(this.indexLocation > 4){
        this.indexLocation = 4;
      }
    },

    getBoundNum(index){//计算每一级的界限

      let count = 0,total=0;
      while (count <= index) {
          total += parseInt(this.listObj[count])*this.differenceVal;

          count++;
      }
      return total;
    },

    getNumArr(){ // 获得每组的数量

     let listData = {};
     this.forecasHourstListData.map(function(item,index){
        if(!listData[index]){
          listData[index] =  item.hoursWeathers.length+1;
        }
     })

    return listData;
    },

    clickDataFun(index){//点击侧边的按钮
      if(index === 0){
        this.indexLocation = index;
        return;
      }

      this.indexLocation = index;

    },

    handlerPosition(){
      console.log(this.$refs.forecastItem);
      console.log(this.$refs.hoursTitle);
      let state = 'absolute';
      console.log(toString.call(this.listObj) === '[object Object]');
      console.log(this.listObj);

      // for(key in this.listObj){
      //   console.log(`${key} : ${this.listObj[key]}`);
      // }
    },

    getDayDataFun(obj){

      let that = this;
      this.forecasHourstListData=obj;
      this.$nextTick(()=>{
          this.listObj=this.getNumArr();// 获得每组的数量=
          console.log(this.listObj);
          this.scrollFun();//滚动条事件
      })
    },

    getEleHeight(val){

      let browserH = this.$store.state.browserH;
      let headerH = this.$store.state.headerH;
      let maiHeaderH = val;
      let total = browserH-headerH-maiHeaderH;
      this.$refs.forecastCon.style.height = total+'px';
      this.$refs.hoursSiderBar.style.height = total+'px';
    }
  }
}
</script>

<style scoped lang="scss">
@import "../common/sass/variable.scss";
@import "../common/sass/mixin.scss";

.forecast-right{
  display: flex;
  justify-content: space-between;
  padding-right: 6rem;
  padding-left: 10rem;
  box-shadow: 0 -2px 0 0 #aaa inset;
  width: 100%;

}

.forecast-list .forecast-right:nth-last-of-type(1){
  border-bottom: 0;
}

.forecast-left{

  .hours-mun{
    line-height: 10rem;
  }
}

.forecast-contain .forecast-list:nth-of-type(1){
  background:rgba(245,245,245,.7);
}
.forecast-contain{
  overflow-y: auto;

  // .positon-contain{
  //   position: absolute;
  //   width: 100%;
  // }

    .hours-sider-bar-wrapper{
      position: absolute;
      bottom: 0;
      left: 0;
      width: 12%;
      background-color:  $color-add-city-box-bg;
    .hours-sider-bar-contain{
      @include base-box(100%);

      .sider-bar-contain{
        @include base-box(100%);
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        border-right: 2px solid $color-add-city-selected-box-bg ;

        .sider-item-contain{
          text-align: center;
          @include base-box(10%);
          line-height: 7rem;
          font-weight: bold;
        }

        .selected-date{
          background-color:$color-add-city-selected-box-bg ;
          color: $color-input;
        }
        .sider-item{
          text-align: center;

        }

        .sider-month{
          text-align: center;
          background-color:$color-add-city-selected-box-bg ;
          color: $color-input;
        }

        .sider-text{
            font-size: $font-size-main*3;
        }

      }
    }
  }
}


.forecast-title{
  margin:10px 2px;
}

 .chart-contain{
  width: 100%;
  height: 200px;
  background:rgba(245,245,245,.7);
}

.forecast-item{
  display: table;
}
 .forecast-contain .forecast-list:nth-of-type(1){
  background:rgba(245,245,245,.7);

}
 .forecast-list{
  box-shadow: 0 -2px 0 0 #eee;
  font-size: $font-size-add-city*1.5;
}
.day-icon-contain,.other-status-contain{
  display: table-cell;
  vertical-align: middle;
  padding-top: 10px;
  padding-bottom: 10px;
}

.day-icon-contain{
  width: 200px;
  padding-left: 8px;
  position: relative;
}

.day-icon{
 width: 40px;
 height: 40px;
 vertical-align: middle;
 position: absolute;
 top: 50%;
 left: 30%;
 transform: scale(2);
}
//温度
 .max-temperature, .min-temperature{
 padding: 2px 10px;
 line-height: 50px;
 border-radius: 2px;
}

 .weather-status{
  font-style: italic;
  margin-left: 10px;
}
//Today样式
.forecast-item{
  padding: 4px 0 10px;
}
 .daytime{
  line-height: 20px;
  padding-bottom: 6px;
}

.forecast-hours-title{
  width: 100%;
 font-size: $font-size-add-city*2;
 color:$color-input;
 background-color:$color-add-city-selected-box-bg;
 padding: 2rem 8rem 2rem 14rem;
}

.min-weather-status-temperature .min-temperature{

  border-radius: 4px;
  padding:2px 8px;
  font-size: $font-size-add-city*1.5;
}
.min-weather-status-temperature,
.temp-speed-clouds-pressure-contain{
  line-height: 30px;
}
.forecast-list{
  box-shadow: 0 2px 0 0 #eee;
}


</style>
