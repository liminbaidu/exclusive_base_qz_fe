<template>
    <div class="diary">
        <v-tooltip style="margin-top: 10vh; justify-content: center;" v-model="tipVisible" target="cursor" open-on-click>
            <span>{{tip}}</span>
        </v-tooltip>
        <div>&nbsp</div>
        <div class="diary-select" style="margin-top: 10vh; margin-left:10vw; height:35vh; width:80vw;">
            <v-textarea
              v-model="diarydate"
              density="compact"
              placeholder="请输入内容"
              variant="outlined"
              hideDetails=""
              style="margin-top: 0vh; height:30vh; width:80vw; background-color:#FFFFFF; opacity: 0.85;"
            ></v-textarea>
            <v-btn
                color="blue"
                block
                style="margin-top: 1.5vh; opacity: 0.85;"
                @click="diaryEdit()"
            >
                上传
            </v-btn>
            <v-btn
                color="blue"
                block
                style="margin-top: 1.5vh; opacity: 0.85; width:25vw;"
                @click="diaryCancel()"
            >
                取消
            </v-btn>
        </div>
    </div>
</template>

<script>
    import { useDisplay } from 'vuetify'
    import { ref } from 'vue'
    export default {
        data(){
            return{
                tipVisible:false,
                diaryid:ref(''),
                diarydate:ref(''),
                tip:'',
                isShowDate:'2'
            }
        },
        setup() {
            const { xs,sm,md } = useDisplay();
            return { xs,sm,md};
        },
        async mounted(){
            this.resetDiaryInfo()
        },
        methods:{
            async diaryEdit(){
                this.isloading=true;
                if (this.diaryid!=''){
                    const response = await fetch(
                        `http://100.81.86.211:8000/diary/updateDiary?DiaryId=${this.diaryid}&content=${this.diarydate}&token=07b3a50ee98721304338e5027d25e524`,
                        {
                        headers:{
                            "cookie": this.cookie,
                        }
                        }
                    )
                    response.json().then((resp)=>{
                        if (resp['BaseResp']['StatusCode']==0) {
                            this.unsetDiaryInfo()
                            this.$emit('child-click', this.isShowDate)
                            // localStorage.setItem('bottomtab', '2')
                            // window.open('/', '_self')
                        }else{
                            this.tip=resp['BaseResp']['StatusMessage'];
                            console.log(this.tip);
                            this.tipVisible=true;
                            this.closetip();
                        }
                    })
                }else{
                    const response = await fetch(
                        `http://100.81.86.211:8000/diary/createDiary?content=${this.diarydate}&token=07b3a50ee98721304338e5027d25e524`,
                        {
                        headers:{
                            "cookie": this.cookie,
                        }
                        }
                    )
                    response.json().then((resp)=>{
                        if (resp['BaseResp']['StatusCode']==0) {
                            this.$emit('child-click', this.isShowDate)
                            // localStorage.setItem('bottomtab', '2')
                            // window.open('/', '_self')
                        }else{
                            this.tip=resp['BaseResp']['StatusMessage'];
                            console.log(this.tip);
                            this.tipVisible=true;
                            this.closetip();
                        }
                    })
                }
                this.isloading=false
            },
            async closetip(){
                setTimeout(() => {
                this.tipVisible=false
                }, 3000);
            },
            resetDiaryInfo(){
                this.diaryid=localStorage.getItem('diaryid')
                this.diarydate=localStorage.getItem('diarydate')
            },
            async unsetDiaryInfo(){
                this.diaryid=''
                this.diarydate=''
            },
            
            async diaryCancel(){
                this.unsetDiaryInfo()
                this.$emit('child-click', this.isShowDate)
            }
            
        }
    }     
</script>

<style scoped>
  @import url(/css/app.less);
  @import url(/css/diary/diary.css);
</style>