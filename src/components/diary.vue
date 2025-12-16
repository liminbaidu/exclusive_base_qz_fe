<template>
    <div class="diary">
        <v-tooltip style="margin-top: 10vh; justify-content: center;" v-model="tipVisible" target="cursor" open-on-click>
            <span>{{tip}}</span>
        </v-tooltip>
        <div class="diary-select" style="margin-top: 0vh; height:10vh">
            <div style="height:8vh"></div>
            <v-btn
                style="margin-left: 70vw; height:4vh; background-color:#e6fdb8; "
                class="text-none"
                variant="text"
                @click="diaryCreate()"
                border
                >
                点击上传
            </v-btn>
        </div>
        
        <div class="diary-data" style="color: black;" >
            <v-infinite-scroll
                style="margin-top: 2.5vh;"
                height="80vh"
                side="end"
                @load="load"
            >
                <template v-for="(diary, index) in diarylist" :key="diary['diaryId']">
                    <div >
                        <v-card class="diary-data-card" variant="text" :subtitle="timestamptoString(diary['postTime'])" :text="diary['content']">
                            <v-divider></v-divider>
                            <v-btn class="diary-data-card-button" text="编辑" @click="diaryEdit(diary['diaryId'],diary['content'])"></v-btn>
                            <v-btn class="diary-data-card-button" text="删除" @click="diaryDelete(diary['diaryId'])"></v-btn>
                        </v-card>
                    </div>
                </template>
                <template v-slot:empty>
                    <v-card style="color: black;">没有更多数据了哦</v-card>
                </template>
            </v-infinite-scroll>
        </div>
    </div>
</template>

<script>
    import { useDisplay } from 'vuetify'
    export default {
        data(){
            return{
                diarylist:[],
                isloading:false,
                page:1,
                size:10,
                hasMore:true,
                tipVisible:false,
                tip:'',
            }
        },
        setup() {
            const { xs,sm,md } = useDisplay();
            return { xs,sm,md};
        },
        async mounted(){
            await this.Getdiarylist();
        },
        methods:{
            async Getdiarylist(){
                this.isloading=true;
                
                const response = await fetch(
                    `http://100.81.86.211:8000/diary/queryDiary?page=${this.page}&size=${this.size}&token=07b3a50ee98721304338e5027d25e524`,
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
                console.log("22")
                window.open('/#/diary/edit', '_self')
            },
            async diaryEdit(id,data){
                localStorage.setItem('diaryid', id)
                localStorage.setItem('diarydata', data)
                window.open('/#/diary/edit', '_self')
            },
            async diaryDelete(id){
                const response = await fetch(
                    `http://100.81.86.211:8000/diary/deleteDiary?diaryId=${id}&token=07b3a50ee98721304338e5027d25e524`,
                    {
                    headers:{
                        "cookie": this.cookie,
                    }
                    }
                )
                response.json().then((resp)=>{
                    if (resp['BaseResp']['StatusCode']==0) {
                        localStorage.setItem('bottomtab', '2')
                        window.open('/', '_self')
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
            
        }
    }     
</script>

<style scoped>
  @import url(/css/app.less);
  @import url(/css/diary/diary.css);
</style>