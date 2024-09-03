<template>
  <div>
    <button @click="leaveRoom" v-if="!(game.status==='playing')">Quitter la room</button>
    <WaitLobby v-if="game.status==='waiting'"></WaitLobby>
    <GameLobby v-else>
    </GameLobby>
    
  </div>
</template>

<script setup lang="ts">
import { useSocketStore } from '@/stores/socket'
import { userStore } from '@/stores/user'
import { gameStore } from '@/stores/game'
import {onMounted,reactive } from 'vue'
import type {GameStatus,TypeRoom} from '@/models/room.model'
import WaitLobby from '@/components/gameRoom/WaitLobby.vue'
import GameLobby from '@/components/gameRoom/GameLobby.vue'
const user = userStore()
const game=gameStore()
const socket = useSocketStore()
interface Room {
  name: string
  type: TypeRoom | null
  gameStatus: GameStatus |null
}
const room:Room=reactive({
  name:user.room.name,
  type:'gameRoom',
  gameStatus:'waiting'
})

const leaveRoom = () => {
  socket.socket?.emit('leave:room')
}
onMounted(()=>{
  game.getInfogame()
  game.waitLobbyProperties.init()
})

</script>

<style scoped></style>
