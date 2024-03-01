import { createRouter, createWebHistory } from 'vue-router'
import AviaSalesStart from '../views/AviaSalesStart.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: AviaSalesStart
    }
  ]
})

export default router
