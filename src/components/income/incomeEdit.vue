<template>
    <div class="incomeCreate">
        <div>&nbsp</div>
        <v-tooltip style="margin-top: 10vh; justify-content: center;" v-model="tipVisible" target="cursor" open-on-click>
        </v-tooltip>
        <v-infinite-scroll
            ref="scroll"
            style="margin-top: 4vh;"
            height="80vh"
            side="end"
            @load="load"
        >
        <div class="incomeCreate-from" style="margin-top: 10vh; margin-left:10vw; width:80vw;">
            <div>类型</div>
            <v-select
                style="padding:0px; border-radius: 8px;"
                v-model="incomeType"
                variant="underlined"
                :items="['交通', '购物', '食物', '房租', '转账']"
            ></v-select>
            <div>花费时间</div> 
            <input 
                class="incomeCreate-from-field"
                v-model="incomeSpendTime"
                type="text"
                placeholder="输入时间格式: 2025.01.03"
            >
            <div style="margin-top: 1vh;">金额</div> 
            <input 
                v-model="incomeAmount"
                class="incomeCreate-from-field"
                type="text"
                @input="handleInput"
                @blur="handleBlur"
            >
            <div style="margin-top: 1vh;">备注</div> 
            <v-textarea
              v-model="incomeRemark"
              density="compact"
              placeholder="请输入内容"
              variant="outlined"
              hideDetails=""
              style="width:80vw; border-radius: 8px;"
            ></v-textarea>
            <v-btn
                style="margin-top: 2vh;"
                color="blue"
                size="large"
                block
                @click="incomeEdit()"
            >
                上传
            </v-btn>
            <v-btn
                color="blue"
                block
                style="margin-top: 1vh; opacity: 0.85;"
                @click="incomeCancel()"
            >
                取消
            </v-btn>
        </div>
            <template v-slot:empty>
                <div>&nbsp</div>
            </template>
        </v-infinite-scroll>
        
    </div>
</template>

<script>
    import { useDisplay } from 'vuetify'
    import { getKeyByValue } from '../../utils/common.js';
    export default {
        data(){
            return{
                tipVisible:false,
                incomeid:'',
                incomedate:'',
                tip:'',
                incomeTypeJson:{'交通':'1', '购物':'2', '食物':'3', '房租':'4', '转账':'5'},
                incomeType:'交通',
                incomeRemark:'',
                incomeAmount:"",
                incomeSpendTime:'',
                isShowDate:'1',
                url:"",
                token:""
            }
        },
        setup() {
            const { xs,sm,md } = useDisplay();
            return { xs,sm,md};
        },
        async mounted(){
            this.url=localStorage.getItem('url')
            this.token=localStorage.getItem('token')
            this.resetincomeInfo()
        },
        methods:{
            async incomeEdit(){
                this.isloading=true;
                const spendstampS = Math.floor(new Date(this.incomeSpendTime.replace(/\./g, '-')).getTime() / 1000)
                const incomeTypeV = this.incomeTypeJson[this.incomeType]
                const incomeAmountS = String(parseFloat(this.incomeAmount)*100);
                if (this.incomeid!=''){
                    const response = await fetch(
                        this.url+`/income/updateIncome?incomeId=${this.incomeid}&spendType=${incomeTypeV}&remark=${this.incomeRemark}&spendTime=${spendstampS}&amount=${incomeAmountS}&token=`+this.token,
                        {
                        headers:{
                            "cookie": this.cookie,
                        }
                        }
                    )
                    response.json().then((resp)=>{
                        if (resp['BaseResp']['StatusCode']==0) {
                            this.unsetincomeInfo()
                            this.$emit('child-click', this.isShowDate)
                        }else{
                            this.tip=resp['BaseResp']['StatusMessage'];
                            console.log(this.tip);
                            this.tipVisible=true;
                            this.closetip();
                        }
                    })
                }else{
                    const response = await fetch(
                        this.url+`/income/createIncome?spendType=${incomeTypeV}&remark=${this.incomeRemark}&spendTime=${spendstampS}&amount=${incomeAmountS}&token=`+this.token,
                        {
                        headers:{
                            "cookie": this.cookie,
                        }
                        }
                    )
                    response.json().then((resp)=>{
                        if (resp['BaseResp']['StatusCode']==0) {
                            this.unsetincomeInfo()
                            this.$emit('child-click', this.isShowDate)
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
            async resetincomeInfo(){
                this.incomeid=localStorage.getItem('incomeid')
                this.incomeType=getKeyByValue(this.incomeTypeJson,localStorage.getItem('incomeType'))
                this.incomeRemark=localStorage.getItem('incomeRemark')
                if (localStorage.getItem('incomeAmount')==""){
                    this.incomeAmount="0.00"
                    const secondTimestamp = Math.floor(Date.now() / 1000);
                    this.incomeSpendTime=this.timestamptoString(secondTimestamp)
                }else{
                    this.incomeAmount=String(parseFloat(localStorage.getItem('incomeAmount'))/100)
                    this.incomeSpendTime=this.timestamptoString(localStorage.getItem('incomeSpendTime'))
                }
                
            },
            async unsetincomeInfo(){
                localStorage.setItem('incomeid', '')
                localStorage.setItem('incomeType', '')
                localStorage.setItem('incomeRemark', '')
                localStorage.setItem('incomeAmount', '')
                localStorage.setItem('incomeSpendTime', '')
            },
            load ({ done }) {
                done('empty');
            },
            handleInput(){
                let value = this.incomeAmount.replace(/[^-0-9.]/g, '');
                if (value.indexOf('.') !== -1) {
                    const parts = value.split('.');
                    value = parts[0] + '.' + (parts[1] ? parts[1].substring(0, 2) : '');
                }
                this.incomeAmount = value;
            },
            handleBlur(){
                let value = this.incomeAmount;
                if (!value) return;
                if (!value.includes('.')) {
                    this.incomeAmount = value + '.00';
                } else {
                    const parts = value.split('.');
                    if (parts[1].length === 1) {
                    this.incomeAmount = value + '0';
                    }
                }
            },
            timestamptoString(timestamp){
                const date = new Date(Number(timestamp)*1000);
                const year = date.getFullYear();
                const month = String(date.getMonth() + 1).padStart(2, '0'); // 补零：1 → 01
                const day = String(date.getDate()).padStart(2, '0'); // 补零：3 → 03
                return `${year}.${month}.${day}`;
            },
            async incomeCancel(){
                this.unsetincomeInfo()
                this.$emit('child-click', this.isShowDate)
            }
            
        }
    }     
</script>

<style scoped>
  @import url(/css/app.less);
  @import url(/css/income/income.css);
</style>