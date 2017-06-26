<template lang="html">
  <div>
    <div class="main-header-contain" ref="mainHeaderCon">
      <div class="main-header-pad">


        <div class="icon-temp-contain">
          <div class="icon-img-contain">
            <i class="icon-img wi" :class="[weatherState.icon]"></i>
          </div>
          <span class="temp-content">{{ weatherState.temp }} </span>
        </div>

        <div class="icon-list-contain">
          <ul class="param-list-contain">
            <li class="param">{{ weatherState.humidity }}
              <span class="state-icon iconfont">&#xe601;</span>
            </li>
            <li class="param">{{ weatherState.speed }}
              <span class="state-icon iconfont">&#xe68b;</span>
            </li>
            <li class="param">{{ weatherState.clouds }}
              <span class="state-icon iconfont">&#xe605;</span>
            </li>
            <li class="param">{{ weatherState.pressure }}
              <span class="state-icon iconfont">&#xe677;</span>
            </li>
            <li class="param tab-btn" :class="{'show-hidden-tab': isTabToggle}" @click="toggleFun">
              <span class="calendar-toggle btn-calendar toggle-btn iconfont">&#xe602;</span>
              <span class="hour-toggle btn-hour toggle-btn iconfont">&#xe615;</span>
            </li>
          </ul>
        </div>
     </div>
    </div>
    <div class="weather-wrapper">
      <div class="padding-contain" ref="paddingCon">

      </div>
      <div class="weather-contain" ref="q">
        <div class="list-day" v-show="!isTabToggle">
          <weather-list></weather-list>
        </div>
        <div class="list-hour" v-show="isTabToggle">
          <weather-hour :heightchlid="mainHeaderH"></weather-hour>
        </div>
      </div>
    </div>

  </div>
</template>

<script>
import bus from "../bus.js"
import commonFun from '../common/js'
import weatherList from './weather-list.vue'
import weatherHour from './weather-hour.vue'

export default {

  data(){
    return{
      weatherState:{},
      isTabToggle:false,
      headerIcon:'',
      mainHeaderH:''
    }
  },

  components:{
    weatherList,
    weatherHour
  },

  mounted(){

    let that =this;
    bus.$on('getTodayData',function(obj){
      that.getWeatherData(obj);
      that.getEleHeightListFun();
    })
  },
  methods:{

    toggleFun(){
      this.isTabToggle = !this.isTabToggle;
      this.$store.state.listToggleBtn = this.isTabToggle;
    },

    getWeatherData(obj){
      this.weatherState={
        temp:obj.temp,
        humidity:obj.humidity,
        speed:obj.speed,
        pressure:obj.pressure,
        icon:obj.icon,
        clouds:obj.clouds
      }
    },
    getEleHeightListFun() {//获取的头部和内容的头部的高度

      let eleHeight = commonFun.publicFun.getEleHeight(this.$refs.mainHeaderCon);
      let elePadHeight = commonFun.publicFun.getEleHeight(this.$refs.paddingCon);
      this.$store.state.maiHeaderH = eleHeight+elePadHeight;
      this.mainHeaderH=eleHeight+elePadHeight;

      bus.$emit("sendMainHeaderH",this.mainHeaderH);
    },
  }
}
</script>

<style scoped lang="scss">
@import "../common/sass/variable.scss";
@import "../common/sass/mixin.scss";

.main-header-contain{
  width: 100%;
  position: relative;

  @include base-box(550px);
  background-color: $color-header;
  .main-header-pad{
    padding: 0 30px;
  }
  .icon-temp-contain{
    display: flex;
    justify-content: space-between;

    .icon-img-contain{
      width: 50%;
      position: relative;

      .icon-img{
        position: absolute;
        top: 40%;
        left: 66%;
        transform: scale(25);
        color:$color-input;
      }
    }

    .temp-content{
      @include base-box(50rem,50rem);
      font-size: $font-size-theme*2;
      line-height: 40rem;
      color: $color-input;
      text-align: center;
    }
  }

  .icon-list-contain{
    $width-or-height:10rem;
    $width-or-height-big:14rem;
    position: absolute;
    bottom: 0;
    left: 0;
    transform: translateY(50%);
    @include base-box($width-or-height);

    .param-list-contain{
      font-size: $font-size-main*2;
      display: flex;
      justify-content: space-between;
      padding-left: 60px;
      padding-right: 60px;

      .param{
        @include base-box($width-or-height,$width-or-height);
        border-radius: 50%;
        text-align: center;
        line-height: $width-or-height;
        background: $color-header-icon;
        color:$color-input;
        position: relative;

        .state-icon{
          $state-line:4rem;
          position: absolute;
          @include base-box($state-line,$state-line);
          top: -4%;
          right: -4%;
          border-radius: 50%;
          background-color: $color-input;
          color:$color-header ;
          text-align: center;
          line-height: $state-line;
        }
      }

      .tab-btn{
        background-color: $color-add-city-selected-box-bg;
        @include base-box($width-or-height-big,$width-or-height-big);
        line-height: $width-or-height-big;
        margin-top: -2rem;

        .toggle-btn{
          font-size: $font-size-add-city;
          line-height: 12rem;
          font-size: $font-size-theme*2;
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%,-50%);
        }

        .calendar-toggle{
          display: block;
        }
        .hour-toggle{
          display: none;
        }
      }

      .show-hidden-tab>.btn-calendar{
        display: none;
      }
      .show-hidden-tab>.btn-hour{
        display: block;
        font-size: $font-size-theme*2.5;
      }
    }
  }
}

.weather-wrapper{
  background-color:$color-add-city-box-bg;

  .padding-contain{
    @include base-box(8rem);
    background-color: $color-add-city-box-bg;
  }

  .weather-contain{
    background-color:$color-add-city-box-bg ;
    // overflow-y: auto;
  }
}

</style>
