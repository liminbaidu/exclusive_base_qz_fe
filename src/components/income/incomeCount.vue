<template>
    <div class="income">
        <v-btn-toggle
            v-model="countTypeTab"
            style="margin-left:25vw; height: 4vh; position:absolute; top:70px; opacity: 0.8;"
            color="#EC4899"
            rounded="1"
            group
            >
            <v-btn value="1" style="width:25vw; font-size: 1.2em;" @click="updateCountTypeTab('1')">
                月
            </v-btn>
            <v-btn value="2"  style="width:25vw; font-size: 1.2em;"  @click="updateCountTypeTab('2')">
                周
            </v-btn>
        </v-btn-toggle>
        <v-tooltip style="margin-top: 10vh; justify-content: center;" v-model="tipVisible" target="cursor" open-on-click>
            <span>{{tip}}</span>
        </v-tooltip>
        <div class="income-select" style="margin-top: 0vh; height:10vh"></div>
        <div class="income-data" style="color: black;" >
            <v-infinite-scroll
                style="margin-top: 2.5vh;"
                height="80vh"
                side="end"
                @load="load"
            >
                <template v-for="(income, index) in incomelistCount" :key="income['incomeId']">
                    <div >
                        <v-card class="income-data-card" variant="text" :subtitle="income['key']">
                            <v-card-text>合计:{{income['value']/100}}元</v-card-text>
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
                incomelist:[],
                incomelistCount:[],
                isloading:false,
                page:1,
                size:10,
                hasMore:false,
                tipVisible:false,
                tip:'',
                isShowTab:'1',
                countTypeTab:'1'
            }
        },
        setup() {
            const { xs,sm,md } = useDisplay();
            return { xs,sm,md};
        },
        async mounted(){
            await this.Getincomelist();
        },
        methods:{
            async Getincomelist(type){
                this.isloading=true;
                const response = await fetch(
                    `http://100.81.86.211:8000/income/queryIncome??page=${this.page}&size=${this.size}&token=07b3a50ee98721304338e5027d25e524`,
                    {
                    headers:{
                        "cookie": this.cookie,
                    }
                    }
                )
                response.json().then((resp)=>{
                    this.incomelistCount=[]
                    if (resp['BaseResp']['StatusCode']==0) {
                        switch (type){
                            case '1':
                                Object.keys(resp['IncomeCount']['month']).forEach(key => {      
                                    this.incomelistCount.push({key:key,value:resp['IncomeCount']['month'][key]})
                                }); 
                                break;
                            case '2':
                                Object.keys(resp['IncomeCount']['week']).forEach(key => {      
                                    this.incomelistCount.push({key:key,value:resp['IncomeCount']['week'][key]})
                                });
                                break;
                            default:
                                Object.keys(resp['IncomeCount']['month']).forEach(key => {      
                                    this.incomelistCount.push({key:key,value:resp['IncomeCount']['month'][key]})
                                }); 
                                
                        }
                        console.log(this.hasMore,this.incomelistCount)
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
                    if (this.page==1 && this.incomelist.length!=0){
                        done('empty');
                        return;
                    }
                    this.Getincomelist()
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
            async incomeCreate(){
                window.open('/#/income/edit', '_self')
            },
            async incomeEdit(id,data){
                localStorage.setItem('incomeid', id)
                localStorage.setItem('incomedata', data)
                window.open('/#/income/edit', '_self')
            },
            async incomeDelete(id){
                const response = await fetch(
                    `http://100.81.86.211:8000/income/deleteincome?incomeId=${id}&token=07b3a50ee98721304338e5027d25e524`,
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
            async updateCountTypeTab(key){
                this.isShowTab=key
                if (key=='1'){
                    this.Getincomelist('1')
                }else {
                    this.Getincomelist('2')
                }
            }
            
        }
    }     
</script>

<style scoped>
  @import url(/css/app.less);
  @import url(/css/income/income.css);
</style>