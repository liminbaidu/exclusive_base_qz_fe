<template>
  <v-app>
    <div class="login">
      <div
        class="login-card" type="flex"
      >
          <v-tooltip style="margin-top: 10vh;  justify-content: center;height:10vh" v-model="loginTipVisible" target="cursor" open-on-click>
            <span >{{logintip}}</span>
          </v-tooltip>
          <div class="text-subtitle-1 text-medium-emphasis d-flex align-center justify-space-between">用户名</div>
          <v-text-field
              v-model="user"
              density="compact"
              placeholder="请输入用户名"
              variant="outlined"
            ></v-text-field>
          <div class="text-subtitle-1 text-medium-emphasis d-flex align-center justify-space-between">
            密码
          </div>

          <v-text-field
            v-model="password"
            :append-inner-icon="visible ? 'mdi-eye-off' : 'mdi-eye'"
            :type="visible ? 'text' : 'password'"
            density="compact"
            placeholder="请输入密码"
            prepend-inner-icon="mdi-lock-outline"
            variant="outlined"
            @click:append-inner="visible = !visible"
          ></v-text-field>

          <v-btn
            class="mb-8"
            color="blue"
            size="large"
            variant="tonal"
            block
            @click="loginIn()"
          >
            登陆
          </v-btn>
      </div>
    </div>
  </v-app>
</template>

<script>
  import { useDisplay } from 'vuetify'
  import { ref } from 'vue'
  import { useRouter } from 'vue-router'
  import config from './config.js';
  const router = useRouter() 

  export default {
    setup() {
      const visible = ref(false)
      const { xs,sm,md } = useDisplay();
      return { xs,sm,md,visible };
    },
    data(){
      return{
        user:'',
        password:'',
        islogin:false,
        isloading:false,
        configdata: config,
        qztoken:"",
        LoginErr:"",
        toggle_none: null,
        text: 'left',
        token:"",
        loginTipVisible:false,
        logintip:ref(""),
      }
    },
    methods: {
      async loginIn(){
        this.isloading=true
        const response = await fetch(
          this.configdata.url+`/common/login?user=${this.user}&password=${this.password}`,
          {
            headers:{
              "cookie": this.cookie,
            }
          }
        )
        response.json().then((logresp)=>{
          if (logresp['BaseResp']['StatusCode']==0) {
            this.islogin = true;
            this.qztoken = logresp['token'];
            this.setToken(this.qztoken);
            window.open('/', '_self')
          }else{
            this.logintip=logresp['BaseResp']['StatusMessage'];
            console.log(this.logintip);
            this.loginTipVisible=true
            this.closetip();
          }
        })
        this.isloading=false
        // this.setloginTipVisible();
      },
      async setToken(token){
        localStorage.setItem('token', token)
      },
      async closetip(){
        setTimeout(() => {
          this.loginTipVisible=false
        }, 3000);
      }
    }
  }
</script>
<style scoped>
  @import url(/public/css/style.css);
  @import url(/css/app.less);
  @import url(/css/mobile.less);    
</style>
