<template>
  <div :style="{display:'flex',flexDirection:'column',justifyContent:'center',alignItems:'center',width:'100%'}">
    <button class="leaveButton" @click="leaveRoom" v-if="!(game.status==='playing')">Quitter la room</button>
    <WaitLobby v-if="game.status==='waiting'"></WaitLobby>
    <GameLobby v-else>
    </GameLobby>
    
  </div>
</template>

<script setup lang="ts">

import { useSocketStore } from '@/stores/socket'
import { gameStore } from '@/stores/game'
import {onMounted } from 'vue'
import WaitLobby from '@/components/gameRoom/WaitLobby.vue'
import GameLobby from '@/components/gameRoom/GameLobby.vue'
const game=gameStore()
const socket = useSocketStore()
const leaveRoom = () => {
  socket.socket?.emit('leave:room')
}
onMounted(()=>{
  game.getInfogame()
  game.waitLobbyProperties.init()
})

</script>

<style scoped>
.leaveButton{
  width: fit-content;
  padding: 5px 10px;
  height: fit-content;
  background-color: var(--main-red);
  margin: 20px 0;
  border: none;
  border-radius: 5px;
  font-size: 14px;
  cursor: pointer;
}

</style>
