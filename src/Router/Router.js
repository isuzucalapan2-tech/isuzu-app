import { createRouter, createWebHistory } from 'vue-router'
import Login from '../Pages/Login.vue'
import Register from '../Pages/Register.vue'
import Dashboard from '../Pages/Admin/Dashboard.vue'
import Approve from '../Pages/Admin/Approve.vue'
import SA_Rotation from '../AfterSales/SA_Rotation.vue'

const routes = [
  { path: '/', name: 'Login', component: Login },
  { path: '/register', name: 'Register', component: Register },
  { path: '/dashboard', name: 'Dashboard', component: Dashboard },
  { path : '/approve', name: 'Approve', component: Approve },
  { path : '/sa-rotation', name: 'SA_Rotation', component: SA_Rotation },

]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router
