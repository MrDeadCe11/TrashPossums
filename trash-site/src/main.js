import { createApp } from 'vue'
import App from './App.vue'
import './index.css'
import router from './router'
import store from './store'
import vuex from 'vuex'

createApp(App).use(router,vuex).use(store).mount('#app')
