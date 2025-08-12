import { createApp } from 'vue'
import { createRouter, createWebHistory} from 'vue-router'
import './style.css'
import App from './App.vue';
import HomeView from './components/Home.vue'
import AboutView from './components/About.vue'
import {initializeApp} from "firebase/app";
import {getAuth} from "firebase/auth";
import Login from "./components/Login.vue";

const firebaseConfig = {
    apiKey: import.meta.env.VITE_API_KEY,
    authDomain: import.meta.env.VITE_AUTH_DOMAIN,
    databaseURL: import.meta.env.VITE_DATABASE_URL,
    projectId: import.meta.env.VITE_PROJECT_ID,
    storageBucket: import.meta.env.VITE_STORAGE_BUCKET,
    messagingSenderId: import.meta.env.VITE_MESSAGING_SENDER_ID,
    appId: import.meta.env.VITE_APP_ID,
    measurementId: import.meta.env.VITE_MEASUREMENT_ID,
};

initializeApp(firebaseConfig);


const routes = [
    { path: '/', component: HomeView, meta: { requiresAuth: true} },
    { path: '/about', component: AboutView, meta: { requiresAuth: true} },
    { path: '/login', component: Login }
]

const router = createRouter({
    history: createWebHistory(),
    routes,
})

router.beforeEach(async (to, from, next) => {
    if (to.matched.some((r) => r.meta.requiresAuth)) {
        const user = getAuth().currentUser;
        if (!user) {
            console.log("beforeEach: User is NOT signed in", from.fullPath, to.fullPath);
            next({ path: "/login", query: { redirect: to.fullPath } });
        } else {
            next();
        }
    }else {
        next();
    }
});

createApp(App)
    .use(router)
    .mount('#app')
