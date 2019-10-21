import Vue from 'vue'
import Router from 'vue-router'
import Home from './views/Home.vue'

Vue.use(Router)

export default new Router({
    routes: [
        { path: '/', name: 'home', component: Home },
        { path: '/tasks', name: 'tasks', component: () => import('./views/Tasks.vue') },
        { path: '/register', name: 'register', component: () => import('./views/Register.vue') },
        { path: '/login', name: 'login', component: () => import('./views/Login.vue') },
    ]
})