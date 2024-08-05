<script setup lang="ts">
import { RouterView } from 'vue-router'
import { onBeforeMount } from 'vue'
import { userStore } from './stores/user'
import { useSocketStore } from './stores/socket'
import { appliStore } from './stores/appli'
import bandeau from './components/disconnectBanderolle.vue'
import popUp from './components/interactive/PopUp.vue'
import router from './router/index'

const socket = useSocketStore()
const user = userStore()
const appli = appliStore()
onBeforeMount(() => {
  user.init()
  appli.checkIfMobile()
})

function ping() {
  socket.emit('ping', { ping: 'ping' })
}
window.addEventListener('popstate', function () {
  router.go(0)
})
</script>

<template>
  <popUp v-if="appli.popUp.show" />
  <bandeau v-if="!appli.isOnline" />
  <header>
    <p @click="ping">Quizz game</p>
    <div>
      <button v-if="user.isConnect" @click="user.logout">LOGOUT</button>
    </div>
  </header>

  <RouterView class="view" />
</template>

<style scoped>
header {
  background-color: #f1f1f1;
  text-align: center;
  padding: 10px;
  color: black;
  font-size: 30px;
}
video{
  background-color: transparent;
}
.view{
  margin-top: 10px;
}
</style>
