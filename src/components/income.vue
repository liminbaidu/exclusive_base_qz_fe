<template>
    <v-btn-toggle
      v-model="bottomtab"
      style="margin-left:25vw; height: 4vh; position:absolute; top:30px; opacity: 0.8;"
      color="#EC4899"
      rounded="1"
      group
    >
      <v-btn value="1" style="width:25vw; font-size: 1.2em;" @click="isShowTab = '1'">
        明细
      </v-btn>
      <v-btn value="2"  style="width:25vw; font-size: 1.2em;"  @click="isShowTab = '2'">
        合计
      </v-btn>
    </v-btn-toggle>
    <div v-show="isShowTab==1 &&!isloading && !isClearScreen" :style="xs||sm?{'overflow-y': 'auto','overflow-x': 'hidden'}:{}">
        <income></income>
    </div>
    <div v-show="isShowTab==2">
        <incomeCount></incomeCount>
    </div>
</template>

<script>
    import { useDisplay } from 'vuetify'
    import income from './income/income.vue'
    import incomeCount from './income/incomeCount.vue'
    
    export default {
        components: {
            income,incomeCount
        },
        data(){
            return{
                isShowTab:"1",
                bottomtab:"1",
            }
        },
        setup() {
            const { xs,sm,md } = useDisplay();
            return { xs,sm,md};
        }
    }     
</script>

<style scoped>
  @import url(/css/app.less);
  @import url(/css/income/income.css);
</style>