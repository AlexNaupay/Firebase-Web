import { createApp } from 'vue'
import { createRouter, createWebHistory} from 'vue-router'
import './style.css'
import App from './App.vue'


import HomeView from './components/Home.vue'
import AboutView from './components/About.vue'

const routes = [
    { path: '/', component: HomeView },
    { path: '/about', component: AboutView },
]

const router = createRouter({
    history: createWebHistory(),
    routes,
})

createApp(App)
    .use(router)
    .mount('#app')
