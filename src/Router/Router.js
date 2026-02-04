import { createRouter, createWebHistory } from 'vue-router'
import Login from '../Pages/Login.vue'
import Register from '../Pages/Register.vue'
import Dashboard from '../Pages/Admin/Dashboard.vue'
import Approve from '../Pages/Admin/Approve.vue'
import Setting from '../Pages/Admin/Setting.vue'
import Inventory from '../Pages/Admin/Inventory.vue'

const routes = [
  { path: '/', name: 'Login', component: Login },
  { path: '/register', name: 'Register', component: Register },
  { path: '/dashboard', name: 'Dashboard', component: Dashboard },
  { path : '/approve', name: 'Approve', component: Approve },
  { path: '/settings', name: 'Settings', component: Setting },
  { path: '/inventory', name: 'Inventory', component: Inventory }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router
