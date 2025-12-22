<template>
    <div v-if='isShowDate=="1"' class="income">
        <v-tooltip style="margin-top: 10vh; justify-content: center;" v-model="tipVisible" target="cursor" open-on-click>
            <span>{{tip}}</span>
        </v-tooltip>
        <div class="income-select" style="margin-top: 0vh; height:10vh">
            <div style="height:8vh"></div>
            <v-btn
                style="margin-left: 35vw; margin-top: 1vw; width:30vw; background-color:#b2f0e1; "
                class="text-none"
                variant="text"
                @click="incomeCreate()"
                border
                >
                点击上传
            </v-btn>
        </div>
        
        <div class="income-data" style="color: black;" >
            <v-infinite-scroll
                ref="scroll"
                style="margin-top: 4vh;"
                height="80vh"
                side="end"
                @load="load"
            >
                <template v-for="(income, _) in incomelist" :key="income['incomeId']">
                    <div >
                        <v-card class="income-data-card" variant="text" :subtitle="timestamptoString(income['spendTime'])">
                            <v-row style="margin-left: 5vw; margin-top: 1vh; height:12vh;">
                                <v-col cols="6" style="padding:5px;">
                                    <span>花费金额:{{income['amount']/100}}元</span>
                                </v-col>
                                <v-col cols="6" style="padding:5px;">
                                    <span>花费类型:{{getKeyByValue(this.spendtypelist,income['spendType'])}}</span>
                                </v-col>
                                <v-col cols="6" style="padding:5px;">
                                    <span>备注:{{income['remark']}}</span>
                                </v-col>
                            </v-row>
                            <v-divider></v-divider>
                            <v-btn class="income-data-card-button" text="编辑" @click="incomeEdit(income['incomeId'],income['spendType'],income['remark'],income['amount'],income['spendTime'])"></v-btn>
                            <v-btn class="income-data-card-button" text="删除" @click="incomeDelete(income['incomeId'])"></v-btn>
                        </v-card>
                    </div>
                </template>    
                <template v-slot:empty>
                    <v-card style="color: black;">没有更多数据了哦</v-card>
                </template>
            </v-infinite-scroll>
        </div>
    </div>
    <div v-if='isShowDate=="2"' class="incomeEdit">
        <incomeEdit @child-click="parentMethod"></incomeEdit>
    </div>
</template>

<script>
    import { useDisplay } from 'vuetify'
    import incomeEdit from './incomeEdit.vue'
    import { ref, useTemplateRef } from 'vue'
    export default {
        data(){
            return{
                incomelist:ref([]),
                isloading:false,
                page:1,
                size:10,
                hasMore:true,
                tipVisible:false,
                isShowDate:"1",
                tip:'',
                spendtypelist:{'交通':'1', '购物':'2', '食物':'3', '房租':'4', '转账':'5'},
                url:"",
                token:""
            }
        },
        setup() {
            const infiniteScrollRef = useTemplateRef('scroll')
            function reset (side) {
                infiniteScrollRef.value?.reset(side)
            }
            const { xs,sm,md } = useDisplay();
            return { xs,sm,md,reset};
        },
        components: {
            incomeEdit
        },
        async mounted(){
            this.url=localStorage.getItem('url')
            this.token=localStorage.getItem('token')
        },
        methods:{
            parentMethod(isShowDate) {
                this.isShowDate=isShowDate
                this.resetdate()
            },
            resetdate(){
                this.hasMore=true
                this.page=1
                this.incomelist.length=0
                this.reset()
            },
            async Getincomelist(){
                this.isloading=true;
                
                const response = await fetch(
                    this.url+`/income/queryIncome?page=${this.page}&size=${this.size}&token=`+this.token,
                    {
                    headers:{
                        "cookie": this.cookie,
                    }
                    }
                )
                response.json().then((resp)=>{
                    if (resp['BaseResp']['StatusCode']==0) {
                        resp['IncomeInfo'].map(income =>
                            this.incomelist.push(income)   
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
                    day: '2-digit'
                }));
                return datestring;
            },
            async incomeCreate(){
                this.isShowDate='2'
            },
            async incomeEdit(id,incomeType,incomeRemark,incomeAmount,incomeSpendTime){
                localStorage.setItem('incomeid', id)
                localStorage.setItem('incomeType', incomeType)
                localStorage.setItem('incomeRemark', incomeRemark)
                localStorage.setItem('incomeAmount', incomeAmount)
                localStorage.setItem('incomeSpendTime', incomeSpendTime)
                this.isShowDate='2'
            },
            async incomeDelete(id){
                const response = await fetch(
                    this.url+`/income/deleteIncome?incomeId=${id}&token=`+this.token,
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
            getKeyByValue(obj, targetValue) {
                for (const [key, value] of Object.entries(obj)) {
                    if (value === targetValue) {
                    return key;
                    }
                }
                return null;
            },
            resetparams(){
                localStorage.setItem('incomeid', '')
                localStorage.setItem('incomeType', '')
                localStorage.setItem('incomeRemark', '')
                localStorage.setItem('incomeAmount', '')
                localStorage.setItem('incomeSpendTime', '')
            }
        }
    }     
</script>

<style scoped>
  @import url(/css/app.less);
  @import url(/css/income/income.css);
</style>