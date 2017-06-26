<template>
  <div id="app">
    <div class="static-padding-contain">

      <div class="static-contain">
        <top-header></top-header>
        <main-header></main-header>
      </div>

    </div>
    <sider-menu></sider-menu>
    <city-list></city-list>
  </div>

</template>

<script>
import topHeader from "./components/header.vue"
import mainHeader from "./components/main-header.vue"
import siderMenu from "./components/sider-menu.vue"
import cityList from "./components/city-list.vue"

export default {
  name: 'app',
  data () {
    return {
      msg: 'hello'
    }
  },
  components:{
    topHeader,
    mainHeader,
    siderMenu,
    cityList
  }
}
</script>

<style scoped lang="scss" >
@import "./common/sass/variable.scss";
#app{
  position: relative;
}
.static-padding-contain{
}
.static-contain{
    background-color: $color-header;
}

</style>
