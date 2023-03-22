import { useUserStore } from '@/stores/user'
import { createRouter, createWebHistory } from 'vue-router'
import LoginView from '../views/LoginView.vue'
import RegisterView from '../views/RegisterView.vue'
import DashboardView from '../views/DashboardView.vue'
import TeamDetailsView from '../views/TeamDetailsView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'dashboard',
      component: DashboardView,
      meta: {
        isProtected: true
      }
    },
    {
      path: '/:teamId',
      name: 'details',
      component: TeamDetailsView,
      meta: {
        isProtected: true
      }
    },
    {
      path: '/login',
      name: 'login',
      component: LoginView
    },
    {
      path: '/register',
      name: 'register',
      component: RegisterView
    }
  ]
})

router.beforeEach((to, from, next) => {
  const userStore = useUserStore()

  console.log({ to, from, isAuthenticated: userStore.isAuthenticated })
  if (to.meta.isProtected && !userStore.isAuthenticated) {
    next('/login')
    return
  }

  next()
})

export default router
