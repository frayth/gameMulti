import { createRouter, createWebHistory } from 'vue-router'
import LoginView from '../views/loginView.vue'
import RoomView from '../views/RoomView.vue'
import waitingRoom from '@/views/waitingRoom.vue'
import { userStore } from '@/stores/user'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'login',
      component: LoginView
    },
    {
      path: '/login',
      name: 'login',
      component: LoginView
    },
    {
      path: '/room/waitingRoom',
      name: 'waitingRoom',
      component: waitingRoom,
      beforeEnter: (to, from, next) => {
        console.log('waitingRoom')
        next()
      }
    },
    {
      path: '/room/:room',
      name: 'room',
      component: RoomView,
      beforeEnter: (to, from, next) => {
        if (to.params.room === 'waitingRoom') next({ name: 'waitingRoom' })
        else next()
      }
    }
  ]
})
router.beforeEach((to, from, next) => {

  const user = userStore()
  

  if (to.name !== 'login' && !user.isConnect) {
    next({ name: 'login' })
  } else {
    next()
  }
})

export default router
