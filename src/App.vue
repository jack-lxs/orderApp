<template>
  <div id="app">
    <!-- 一级路由插座 -->
    <router-view></router-view>
    
  </div>
</template>

<style lang="less">
  //全局样式
  #app {
    font-family: Avenir, Helvetica, Arial, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
  }
  body{
    background-color: #f8f8f8;
  }
  .fl{
    float: left;
  }
  .fr{
    float: right;
  }
  .clearfix::after{
    content: '';
    display: block;
    clear: both;
  }
  .auto-img{
    width: 100%;
    display: block;
  }
 /deep/.van-button van-button--info van-button--normal van-button--block van-button--round{
    background-color: aqua;
 }
</style>
