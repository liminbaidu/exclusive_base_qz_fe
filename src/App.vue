<template>
  <v-app class="vapp-fullscreen-background" style="overflow: hidden;" :class="{ 'radius-before': !xs }"
  :style="xs?{height: '100%',width: '100%',top: '0',left:'0'}:(sm?{height: '98%',width: '98%',top: '1%',left:' 1%'}:{height: '96.6%',width: '99%',top: '1.7%',left:' 0.5%'})">
    <transition name="fade">
      <div class="loading" v-show="isloading">
        <loader></loader>
      </div>
    </transition>
    
    <div v-show="isShowTab==1 &&!isloading && !isClearScreen" :style="xs||sm?{'overflow-y': 'auto','overflow-x': 'hidden'}:{}">
        <personalInfo></personalInfo>
    </div>
    <div v-show="isShowTab==2">
        <diary></diary>
    </div>
    <div v-show="isShowTab==3">
        <income></income>
    </div>
    <div v-show="isShowTab==4">
        <trip></trip>
    </div>
    
    <v-btn-toggle
      v-model="bottomtab"
      style="height: 6vh; position:absolute; bottom:0px; opacity: 0.6;"
      color="#29B6F6"
      rounded="1"
      group
    >
      <v-btn value="1" style="width:25vw; font-size: 1.2em;" @click="isShowTab = '1'">
        主页
      </v-btn>
      <v-btn value="2"  style="width:25vw; font-size: 1.2em;"  @click="isShowTab = '2'">
        低语
      </v-btn>
       <v-btn value="3"  style="width:25vw; font-size: 1.2em;"  @click="isShowTab = '3'">
        记账
      </v-btn>
      <v-btn value="4"  style="width:25vw; font-size: 1.2em;"  @click="isShowTab = '4'">
        旅行
      </v-btn>
    </v-btn-toggle>
  </v-app>
</template>

<script src="./app.js"></script>
<style scoped>
  @import url(/css/app.less);
  @import url(/css/mobile.less);
</style>