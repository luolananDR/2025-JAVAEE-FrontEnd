import { createWebHashHistory, createRouter } from 'vue-router'
import Index from '../pages/index.vue'
import Login from '../pages/loginRegister/loginRegister.vue'
import Layout from '../components/Layout/layout.vue'
const routes = [
    { path: '/',
      component: Layout,
      children:[
          {
              path:'/',
              component:Index,
              meta:{title:"后台首页"}
          }
      ]

    },

]

const router = createRouter({
    history: createWebHashHistory(),
    routes,
})

export default router