<script setup lang="ts">
import { RouterView } from 'vue-router'
import { onBeforeMount } from 'vue'
import { userStore } from './stores/user'
import { useSocketStore } from './stores/socket'
import { appliStore } from './stores/appli'
import bandeau from './components/disconnectBanderolle.vue'
import popUp from './components/interactive/PopUp.vue'
import router from './router/index'
import logOut from '@/assets/SVG/logOut.vue'
import {usePopup} from '@/stores/popUp'
const popupStore= usePopup()
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
function startTimer(){
  popupStore.startPopUpTimer("Déconnexion")
}
function cancelTimer(){
  popupStore.cancelPopUpTimer()
}
</script>

<template>
  <div id="screenNotif"></div>
  <popUp v-if="popupStore.popUp.show" />
  <bandeau v-if="!appli.isOnline" />
  <header>
    <p @click="ping">Quizz game</p>
    <div class="logout">
      <logOut  size="40" v-if="user.isConnect" @mouseenter="startTimer" @mouseleave="cancelTimer" @click="user.logout"/>
    </div>
  </header>

  <RouterView class="view" />
</template>

<style scoped>
header {
  background-color: transparent;
  text-align: center;
  padding: 10px;
  color: var(--colorNormalText);
  font-size: 30px;
}
video{
  background-color: transparent;
}
.view{
  margin-top: 10px;
}
header{
  position: relative;
}
#screenNotif{
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: transparent;
  overflow: hidden;
  z-index: 100;
  pointer-events: none;

}
.logout{
  position: absolute;
  right: 10px;
  top: 10px;
  cursor: pointer;
}
</style>
