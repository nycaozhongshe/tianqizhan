<template lang="html">
  <div class="forecast-list-wrapper" ref="forecastListWrapper">
     <div class="forecast-list"  v-for="forecastItem in forecastList">
       <div class="item-contian">

         <div class="left-weather-contaim">

            <div class="forecast-item">

              <div class="day-icon-contain">
                <i class="day-icon wi" :class="[forecastItem.icon]"></i>
              </div>

              <div class="other-status-contain">
                <p class="max-min-temperature">
                  <span class="max-temperature">{{ forecastItem.description }} </span>
                </p>

                <p class="wind-speed-contain">
                  <span class="min-temperature">{{ forecastItem.tempMin }} </span>-<span class="weather-status">{{forecastItem.tempMax}} </span>
                </p>

                <p class="clouds-pressure-contain">
                </p>

              </div>
            </div>
          </div>
          <div class="rihgt-time-contain">
            <div class="time-day">{{ forecastItem.day  }}</div>
            <div class="time">{{forecastItem.month}},{{ forecastItem.date }}</div>
          </div>
        </div>

      <!-- <p class="daytime">{{forecastItem.today}} </p> -->
    </div>
  </div>

</template>

<script>
import bus from "../bus.js"

export default {
  data(){
    return {
       forecastList:[]
    }
  },

  mounted(){

    const that = this;
    bus.$on('getDayData',function(arr){//从main.js,祖父级中流过来，获取16天之内的事件
      that.getDayDataFun(arr);
    });
    bus.$on('sendMainHeaderH',function(val){//从mian-header.vue中流过来
      that.getEleHeight(val);
    })
  },

  methods:{

    getDayDataFun(arr){
      this.forecastList=arr;
    },

    getEleHeight(val){

      let browserH = this.$store.state.browserH;
      let headerH = this.$store.state.headerH;
      let maiHeaderH = val;
      this.$refs.forecastListWrapper.style.height = (browserH-headerH-maiHeaderH)+'px';
    }
  }
}
</script>

<style scoped lang="scss">
@import "../common/sass/variable.scss";
@import "../common/sass/mixin.scss";

.item-contian{
  display: flex;
  justify-content: space-between;
  flex-basis: 80%;
  padding-right: 6rem;
  padding-left: 6rem;
}

.rihgt-time-contain{
   flex-basis: 20%;
   text-align: right;
}

.forecast-list-wrapper{
  width: 100%;
  overflow-y: auto;

}

.forecast-list {
  padding-left: 10px;
  border-bottom: 2px solid #aaa;
  font-size: $font-size-main*2.5;
}

.forecast-list:nth-of-type(1) {
  background: rgba(200, 200, 200, 0.1);
}

.forecast-item {
  display: table;
  width: 100%;
}

.forecast-item {
  padding: 4px 0 10px;
}

//
.day-icon-contain {
  padding-left: 8px;
  width: 200px;
  position: relative;
}

.day-icon-contain,
.rihgt-time-contain,
.other-status-contain {
  display: table-cell;
  vertical-align: middle;
  padding-top: 10px;
  padding-bottom: 10px;
}

.day-icon {
  width: 8rem;
  height: 8rem;
  vertical-align: middle;
  position: absolute;
  top: 50%;
  left: 30%;
  transform: scale(2);
}

.daytime {
 line-height: 20px;
 padding-bottom: 6px;
 color: #aaa;
 font-weight: lighter;
}
</style>
