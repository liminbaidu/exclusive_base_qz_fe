import { createApp } from 'vue'
import Index from './Index.vue'

import 'vuetify/styles'
import { createVuetify } from 'vuetify'
import * as components from 'vuetify/components'
import * as directives from 'vuetify/directives'
import '@mdi/font/css/materialdesignicons.css'
import {createRouter, createWebHashHistory} from 'vue-router'

import App from './App.vue'
import Login from './Login.vue'
import DiaryEdit from './components/diary/diaryEdit.vue'
import IncomeEdit from './components/income/incomeEdit.vue'

const routes = [
  { path: '/', component: App },
  { path: '/aa', component: App },
  { path: '/login', component: Login },
  { path: '/diary/edit', component: DiaryEdit },
  { path: '/income/edit', component: IncomeEdit },
]
const router = createRouter({
  history: createWebHashHistory(),
  routes
})

const vuetify = createVuetify({
    components,
    directives,
    icons: {
        defaultSet: 'mdi', // 这已经是默认值-仅用于显示目的 
    },
    defaults: {
        VCard: {
            variant: 'tonal',
        },
    },
})
const app = createApp(Index);
app.config.warnHandler = () => {};
app.use(vuetify);
app.use(router);
app.mount('#app')



