<template lang="html">

  <div class="sider-wrapper animated" :class="{fadeInLeft: isAnimatedShow, fadeOutLeft: !isAnimatedShow,'sider-show': isAnimatedShowOnece}">
     <div class="sider-contain">

      <img src="../assets/sider-bg-N.png" alt="" class="sider-img">
      <div class="list-contain">
        <ul class="selected-city-contain">
          <li class="selected-city" v-for="(list,index) in todoCityList">

            <div class="selected-city-wrapper" :class="{'select-state': list.selected}"  @click="selectNameFun(index)">

                <div class="selected-city-name select-name">{{ list.name }}</div>
                <span class="select-btn iconfont toggle-btn">&#xe612;</span>
            </div>

          </li>
        </ul>
        <div class="add-del-city" @click="showCityFun">
          <span class="location-icon iconfont"> &#xe633; </span>
          <span class="todo-city-text">add/delete location</span>
        </div>
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
      isAnimatedShow:false,
      count:0,
      isAnimatedShowOnece:false,
      todoCityList:[]
    }
  },

  watch:{
    count(){
     if(this.count === 1){
       this.isAnimatedShowOnece = true;
     }
    }
  },

  mounted(){

    let that = this;
    bus.$on('tabToggle',function(judge){ // 从兄弟组件 header.vue 接收触发事件
      that.getTabToggleFun(judge);
    })
    bus.$on('siderTodoList',function(){ // 从兄弟组件 city-list.vue 接收触发事件
      that.getSiderTodoListFun();
    })

  },

  methods:{

    selectNameFun(index){

      let todoList = this.$store.state.todoList;
      todoList.map(function(item){
        item.selected=false;
      })
      todoList[index].selected=true;
      bus.$emit('switchCityName',todoList[index].name); //传一个要获取天气数据的城市 >> 父组件 main.js
    },

    getTabToggleFun(judge){
      this.isAnimatedShow = judge;
      ++this.count;
    },

    getSiderTodoListFun(){
      this.todoCityList=this.$store.state.todoList
    },

    showCityFun(){

      this.$store.state.addCityJudge = !this.$store.state.addCityJudge;
      bus.$emit('addCityToggle',this.$store.state.addCityJudge); //实现添加新城市的动画 >> 兄弟组件 city-list.vue

    }
  }
}
</script>

<style lang="scss">
@import "../common/sass/variable.scss";
@import "../common/sass/mixin.scss";

.sider-wrapper{
  display: none;
  @include base-box(100%,80%);
  position: fixed;
  top: 0;
  left: 0;
  background-color: $color-add-city-box-bg;
}
.sider-contain{
  @include base-box(100%);

}

.sider-img{
  width: 100%;
}

.sider-show{
  display: block;
}

.list-contain{


  .selected-city{
    font-size: $font-size-add-city*2 ;
    border-bottom: 2px solid $color-input-font ;


    .selected-city-wrapper{
      position: relative;
      padding-left: 30px;
      padding-right: 30px;


      .selected-city-name{
         margin-left: 8rem;
         color:$color-input-font ;

      }

      .toggle-btn{
        position: absolute;
        top:50%;
        left: 30px;
        transform: translateY(-50%);
        font-size: $icon-font *2.4 ;
        color: $color-input-font ;
        display: none;

      }

    }

   .select-state{

     .select-name{
       color:$color-add-city-selected-box-bg ;

     }

     .select-btn{
      color:$color-add-city-selected-box-bg ;
      display: block;
     }

   }

  }

  .add-del-city{
    color: $color-sider-menu-font ;
    background-color: $color-input ;
    padding: 20px 30px;
    .location-icon{
      color: $color-sider-menu-font ;
      font-size: $font-size-add-city*2.4 ;
    }

    .todo-city-text{

      font-size: $font-size-add-city*2.2 ;
    }
  }
}

</style>
