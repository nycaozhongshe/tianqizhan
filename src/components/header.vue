<template lang="html">
  <div>
    <div class="header-contain" ref="headerCon">

      <div class="sider-tab-icon-contain" :class="{toggleBtn: isShHid }">
        <span class="sider-tab-icon sider-tab-icon-show-hidden iconfont" @click="tabToggle"> &#xe6f4; </span>
        <span class="sider-tab-back-icon sider-tab-back-icon-show-hidden iconfont" @click="tabToggle"> &#xe600; </span>
      </div>

      <div class="city-contain">
        <p class="city"> {{ name }} </p>
      </div>

      <div class="refresh-time-contain">
        <span class="refresh iconfont"  @click="refreshFun"> &#xe6bb; </span>
        <span class="time"> {{ time }}</span>
      </div>

    </div>
  </div>
</template>

<script>
import bus from "../bus.js"
import commonFun from '../common/js'


export default {

  data(){
    return{
      name:'',
      time:'',
      isShHid:false
    }
  },

  created(){
    this.getCityName();
  },

  mounted(){

    let that =this;
    bus.$on('getCityName',function(name){//从父组件中或
      that.getCityName(name);
    })
    this.getTimeNow();
    this.getEleHeightFun();
  },

  methods:{

    tabToggle(){
      this.isShHid = !this.isShHid;
      bus.$emit('tabToggle',this.isShHid); // 传切换 sider-nenu 的 boolean >> 兄弟组件 sider-menu.vue
    },

    refreshFun(){
      bus.$emit('switchCityName',this.$store.state.cityName);//刷新页面
    },

    getCityName(name){
      this.name=name;
    },

    getTimeNow(){
      this.time = (new Date()).toTimeString().substr(0,5);
    },

    getEleHeightFun() {

      let eleHeight = commonFun.publicFun.getEleHeight(this.$refs.headerCon);
      this.$store.state.headerH = eleHeight;
    },
  }
}
</script>

<style scoped lang="scss">
@import "../common/sass/variable.scss";
@import "../common/sass/mixin.scss";

  .header-contain{
    background: $color-header;
    color: $color-input;
    display: flex;
    justify-content: space-between;
    padding: 0 20px;
    @include base-box($line-height-def);
    font-size:$font-size-sider-title*2;

    .sider-tab-icon-contain{
      flex-basis: 10%;
      position: relative;
      z-index: 2;
    }

    .refresh-time-contain{
      flex-basis: 20%;
      display: flex;
      justify-content: space-between;
      position: relative;
      padding-left: 10%;
    }

    .sider-tab-back-icon,
    .sider-tab-icon{
      font-size: $icon-font*2;
      position: absolute;
      top:50%;
      left: 10%;
      transform: translateY(-50%);
    }

    .sider-tab-back-icon{
      display: none;
    }

    .toggleBtn>.sider-tab-back-icon-show-hidden{
      display: block;
    }

    .toggleBtn>.sider-tab-icon-show-hidden{
      display: none;
    }

    .refresh{
      font-size: $icon-font*2;
      position: absolute;
      top:50%;
      left: 0;
      transform: translateY(-50%);
    }

    .city-contain{
      font-size: $font-size-title*2;
      width: 65%;
      @extend %line-height;
    }

    .refresh-time-contain{
      @extend %line-height;
    }

    .time{
      font-size: $font-size-main*2 ;
    }
  }

</style>
