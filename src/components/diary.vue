<template>
    <div v-if="isShowDate=='1'"><diaryEdit ref="diaryEdit" @child-click="parentMethod"></diaryEdit></div>
    <div v-if="isShowDate=='2'" class="diary">
        <v-tooltip style="margin-top: 10vh; justify-content: center;" v-model="tipVisible" target="cursor" open-on-click>
            <span>{{tip}}</span>
        </v-tooltip>
        <div class="diary-select" style="margin-top: 0vh; height:10vh">
            <div style="height:8vh"></div>
            <v-btn
                class="diary-button"
                style="margin-left: 65vw; margin-top: 1vw; width:30vw; height:4vh;"
                variant="text"
                @click="diaryCreate()"
                border
                >
                点击上传
            </v-btn>
        </div>
        
        <div class="diary-data" style="color: black;" >
            <v-infinite-scroll
                ref="scroll"
                style="margin-top: 4vh;"
                height="80vh"
                side="end"
                @load="load"
            >
                <template v-for="(diary, _) in diarylist" :key="diary['diaryId']">
                    <div >
                        <v-card class="diary-data-card" variant="text" :subtitle="timestamptoString(diary['postTime'])" :text="diary['content']">
                            <v-divider></v-divider>
                            <v-btn class="diary-data-card-button" text="编辑" @click="diaryEdit(diary['diaryId'],diary['content'])"></v-btn>
                            <v-btn class="diary-data-card-button" text="删除" @click="diaryDelete(diary['diaryId'])"></v-btn>
                        </v-card>
                    </div>
                </template>
                <template v-slot:empty>
                    <v-card style="background-color:#FFFFFF; opacity: 0.75; color: #000000;">没有更多数据了哦</v-card>
                </template>
            </v-infinite-scroll>
        </div>
    </div>
</template>

<script>
    import { useDisplay } from 'vuetify'
    import diaryEdit from './diary/diaryEdit.vue'
    import { ref, useTemplateRef,reactive } from 'vue'
    export default {
        data(){
            return{
                isShowDate:'2',
                aa:'3',
                diarylist:ref([]),
                isloading:false,
                page:1,
                size:10,
                hasMore:true,
                tipVisible:false,
                tip:'',
                showChild : ref(false),
                url:"",
                token:""
            }
        },
        components: {
            diaryEdit
        },
        setup() {
            const { xs,sm,md } = useDisplay();
            const infiniteScrollRef = useTemplateRef('scroll')
            function reset (side) {
                infiniteScrollRef.value?.reset(side)
            }
            return { xs,sm,md,reset};
        },
        async mounted(){
            this.resetparams();
        },
        methods:{
            async Getdiarylist(){
                this.isloading=true;
                
                const response = await fetch(
                    this.url+`/diary/queryDiary?page=${this.page}&size=${this.size}&token=`+this.token,
                    {
                    headers:{
                        "cookie": this.cookie,
                    }
                    }
                )
                response.json().then((resp)=>{
                    if (resp['BaseResp']['StatusCode']==0) {
                        resp['diaryList'].map(diary =>
                            this.diarylist.push(diary)   
                        )
                        if (Number(resp['total'])>this.page*this.size){
                            this.hasMore=true;
                            this.page=this.page+1;
                        }else{
                            this.hasMore=false;
                        }
                        console.log(this.hasMore)
                    }
                })
                this.isloading=false
            },
            load ({ done }) {
                console.log(done)
                console.log("load"+this.hasMore)
                if (this.hasMore==false){
                    done('empty');
                    return;
                }
                setTimeout(() => {
                    if (this.page==1 && this.diarylist.length!=0){
                        done('empty');
                        return;
                    }
                    this.Getdiarylist()
                    done('ok');
                }, 1000)
            },
            timestamptoString(timestamp){
                const date = new Date(Number(timestamp)*1000);
                const datestring = String(date.toLocaleString('zh-CN', {
                    year: 'numeric',
                    month: '2-digit',
                    day: '2-digit',
                    hour: '2-digit',
                    minute: '2-digit',
                    second: '2-digit'
                }));
                return datestring;
            },
            async diaryCreate(){
                this.resetparams()
                this.isShowDate='1'
            },
            parentMethod(isShowDate) {
                this.isShowDate=isShowDate
                this.resetdate()
            },
            resetdate(){
                this.resetparams()
                this.reset()
            },
            async diaryEdit(id,data){
                localStorage.setItem('diaryid', id)
                localStorage.setItem('diarydate', data)
                this.isShowDate='1'
            },
            async diaryDelete(id){
                const response = await fetch(
                    this.url+`/diary/deleteDiary?diaryId=${id}&token=`+this.token,
                    {
                    headers:{
                        "cookie": this.cookie,
                    }
                    }
                )
                response.json().then((resp)=>{
                    if (resp['BaseResp']['StatusCode']==0) {
                        this.resetdate()
                    }else{
                        this.tip=resp['BaseResp']['StatusMessage'];
                        this.tipVisible=true;
                        this.closetip();
                    }
                })
            },
            async closetip(){
                setTimeout(() => {
                this.tipVisible=false
                }, 3000);
            },
            resetparams(){
                localStorage.setItem('diaryid', '')
                localStorage.setItem('diarydate', '')
                console.log('22')
                this.hasMore=true
                this.page=1
                this.diarylist.length=0
                this.url=localStorage.getItem('url')
                this.token=localStorage.getItem('token')
            }
            
        }
    }     
</script>

<style scoped>
  @import url(/css/app.less);
  @import url(/css/diary/diary.css);
</style>