import homeright from '../src/components/hoemright.vue';
import typewriter from './components/typewriter.vue';
import tab1 from './components/tabs/tab1.vue';
import tab2 from './components/tabs/tab2.vue';
import tab3 from './components/tabs/tab3.vue';
import loader from './components/loader.vue';
import polarchart from './components/polarchart.vue';
import config from './config.js';
import { getCookie } from './utils/cookieUtils.js';
import { setMeta,getFormattedTime,getFormattedDate,dataConsole } from './utils/common.js';
import { useDisplay } from 'vuetify'
import { reactive, ref } from 'vue'


export default {
  setup() {
    const { xs,sm,md } = useDisplay();
    const debug = ref('Hello Vue!');
    return { xs,sm,md };
  },
  data(){
    return{
      form : reactive({
        user: '',
        password: ''
      }),
      islogin:false,
      isloading:false,
      qztoken:"",
      LoginErr:"",
      toggle_none: null,
      text: 'left',
    }
  },
  methods: {
    async onSubmit(){
      this.isloading=true
      console.log(this.form);
      const response = await fetch(
        `http://10.254.242.168:8000/common/login?user=${this.form.user}&password=${this.form.password}&token=${this.qztoken}`,
        {
          headers:{
            "cookie": this.cookie,
          }
        }
      )
      response.json().then((logresp)=>{
        if (logresp['BaseResp']['StatusCode']==0) {
          this.qztoken = logresp['token'];
        }else{
          this.LoginErr=logresp['BaseResp']['StatusMessage'];
        }
      })
      this.isloading=false
    }
  }
}
