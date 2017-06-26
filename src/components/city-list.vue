<template lang="html">
  <div class="aimate-wrapper animated" :class="{fadeInDown: isAnimatedShow, fadeOutUp: !isAnimatedShow,'sider-show': isAnimatedShowOnece}">

  <div class="city-list-wrapper">

      <div class="left-city-contain">

        <div class="search-contain" ref="searchCon">
          <input type="text" class="enter-input" v-model="enterVal" @change="finishedFun">
          <span class="search-icon iconfont" @click.stop="searchFun">&#xe607;</span>
        </div>
        <div class="city-name-list-wrapper">

          <ul class="city-list-contain" ref="cityListCon">
              <li class="city-item-wrapper" id="cityWrapper" @click="selcetedFun(index)" v-for="(list,index) in todoCityList">

                <div class="city-item" :class="{'selected-box' : list.selected }">

                  <div class="city-name-content">
                    {{list.name}}
                  </div>
                  <span class="del-btn iconfont del-selected" @click.stop="delFun(index)">&#xe604;</span>
                </div>

              </li>
          </ul>

        </div>
      </div>

      <div class="line-contain">
        <p class="line">
          <span class="line-in"></span>
        </p>
      </div>
      <div class="close-contain" ref="closeCon">
        <span class="close-icon iconfont" @click="closeFun">&#xe630;</span>
      </div>

    </div>

  </div>

</template>

<script>
import bus from "../bus.js"
import commonFun from '../common/js'
import api from '../common/api'

export default {
  data(){
    return {
      enterVal:'',
      isAnimatedShow:false,
      count:0,
      isAnimatedShowOnece:false,
      todoCityList:[
        // name:''
        // selected:false
      ],
      CityNamePos:0
    }
  },

  watch:{
    count(){
     if(this.count === 1){
       this.isAnimatedShowOnece = true;
     }
   },
   todoCityList:{
     handler(){
        this.getEleHeight();
     },
     deep:true
   }
  },

  mounted(){
    let that = this;

    bus.$on('addCityToggle',function(judge){
      that.getAddCityToggleFun(judge);
    });

    bus.$on('todoCityName',function(){
      that.getTodoCityNameFun();
    });
  },

  methods:{

    getEleHeight(){

      let closeH=commonFun.publicFun.getEleHeight(this.$refs.closeCon);
      let searchH = commonFun.publicFun.getEleHeight(this.$refs.searchCon);

      this.$refs.cityListCon.style.height=(commonFun.publicFun.getBrowserWidth().height-api.apiConst.HEIGHT-closeH-searchH)+'px';
    },

    enterCityNam(){
      bus.$emit('enterCityName',this.enterVal);//传输入框中搜索的城市 >> 父组件
      this.enterVal=''
    },

    getTodoCityNameFun(){

      let that = this;

      let judge = this.todoCityList.some(function(item){// 检查是否有相同的城市名字
        return item.name===that.$store.state.cityName;
      })

      if(judge){
        return;
      }

      this.todoCityList.map(function(item){
        item.selected=false;
      })

      let obj={
          name:this.$store.state.cityName,
          selected:true
      }

      this.todoCityList.push(obj);
      this.$store.state.todoList = this.todoCityList;
      bus.$emit('siderTodoList');//传 cityTodoList >> 兄弟组件 sider-menu.vue
    },
    selcetedFun(index){

      this.todoCityList.map(function(item){
        item.selected = false;
      })
      this.todoCityList[index].selected = true;
      bus.$emit('switchCityName',this.todoCityList[index].name);//传一个要获取天气数据的城市 >> 父组件 main.js
    },

    delFun(index){
      this.todoCityList.splice(index,1);
    },

    finishedFun(){
      this.enterCityNam();
    },

    searchFun(){
      this.enterCityNam();
    },

    closeFun(){
      this.$store.state.addCityJudge=!this.$store.state.addCityJudge;
      this.getAddCityToggleFun(this.$store.state.addCityJudge);
    },

    getAddCityToggleFun(judge){

      this.isAnimatedShow = judge;
      ++this.count;
    },
  }
}
</script>

<style scoped lang="scss">
@import "../common/sass/variable.scss";
@import "../common/sass/mixin.scss";



.city-list-wrapper{
  @include base-box(100%);
  position: relative;
  background-color: $color-header;
  padding: 3rem 6rem;
  display: flex;
  justify-content: space-between;
  flex-direction: row;

  .left-city-contain{
    padding-right: 2rem;
    flex-basis: 100%;

    .search-contain{
      width: 100%;
      height: $font-size-theme *1.8;
      position: relative;
      text-align: center;

      .enter-input{
        @include base-box(100%,82%);
        border-radius: 1rem;
        border: 2px solid #eee;
        padding: 2px 6rem;
        font-size: $font-size-add-city*2;
        color:$color-input-font;
      }

      .search-icon{
        position: absolute;
        top:50%;
        right:8rem;
        transform: translateY(-50%);
        color:$color-sider-menu-font;
        font-size: $font-size-title*2;
      }
    }
    .city-name-list-wrapper{
      padding: 3rem 0;

      .city-list-contain{
        width: 100%;
        text-align:center;
        overflow-y: auto;

        .city-item{
         @include base-box(30rem);
          background-color: $color-add-city-box-bg;
          color:$color-header ;
          font-size: $font-size-add-city*2;
          border-radius: 1rem;
          position: relative;


          .del-btn{
            position: absolute;
            top:0;
            right: 0;
            color: $color-sider-menu-font ;
            font-size: $icon-font*2.6;
            transform: translateY(-24%);
          }
        }

        .selected-box{
          background-color:$color-add-city-selected-box-bg ;
          color: $color-input;

          .del-selected{
            color: $color-input ;
          }
        }
      }
    }
  }

  .line-contain{
    @include base-box(100%,20px);

    .line{
      @include base-box(100%,20px);
      padding-top: $font-size-theme *2.4;
      .line-in{
        @include base-box(100%);
        display: block;
        background-color:$color-add-city-selected-box-bg ;
      }

    }
  }

  .city-item-wrapper{
    margin: 2rem 0;
  }

  .close-contain{
    position: fixed;
    bottom: 0;
    left: 0;
    text-align: center;
    @include base-box(100px)

    .close-icon{
      line-height: 90px;
      color: $color-input;
      font-size: $icon-font*2.6;
    }
  }
}
.aimate-wrapper{
  display: none;
  width: 100%;
  height: 100%;
  position: fixed;
  top:0;
  left:0;
  z-index: 3;
}
.sider-show{
  display: block;
}

</style>
