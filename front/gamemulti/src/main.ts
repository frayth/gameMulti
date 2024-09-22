import './assets/main.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import router from './router'
import useFecth from './modules/fetch'
const app = createApp(App)

app.use(createPinia()).use(router).provide('fetch', useFecth)

app.mount('#app')
