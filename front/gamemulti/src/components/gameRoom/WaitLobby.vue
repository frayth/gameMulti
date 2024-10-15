<template>
  <div class="main-wait">
    <OptionSvg class="option" v-if="widthAppli<=630" @click="showPanelOption=true" :color="'var(--normalTextColor)'"/>
    <Transition name="panel">
      <div id="panelOption" v-show="showPanelOption" >
        <ArrowUndoSvg @click="showPanelOption=false" class="undo" :color="'var(--colorNormalText)'" />
        </div>
    </Transition>
    <div class="flex-main">
    <Teleport defer to="#panelOption" :disabled="widthAppli>630">
      <OptionsLobby />
    </Teleport>
    <div>
    <div class="main-waitLobby"> 
      <div
        :class="`wait-info ${isReady(player.id) ? 'isReady' : ''}`"
        v-for="player in currentPlayer"
        :key="player.id"
      >
        <div v-if="isOwner(player.id)" class="owner">
          <ActivePopUp :message="'Leader'">
            <BadgeOwner fill="white"/>
          </ActivePopUp>
        </div>
        <div :class="`wait-status`">
          <ConnexionStatut :statusConnection="player.connected" :size="12" />
        </div>
        <div class="name-player">
          <p>{{ player.name }}</p>
        </div>
        <div :class="`face`" :style="{ overflow: 'hidden', maxWidth: '30px', maxHeight: '30px' }">
          <happyFace :fill="player.ready ? '#159b48' : 'transparent'" :size="30" />
        </div>
        <button
          :class="`ready-button  ${isPlayer(player.id) && isReady(player.id) ? 'ready' : ''}`"
          v-if="isPlayer(player.id)"
          @click="sendReady(player.id)"
        >
          {{ `${!isReady(player.id) ? 'Pret' : 'Annuler'}` }}
        </button>
        <button
          :class="`ready-button kick  ${isPlayer(player.id) && isReady(player.id) ? 'ready' : ''}`"
          v-else-if="!isPlayer(player.id) && isOwner(user.id)"
          @click="kickPlayer(player.id)"
        >
          kick
        </button>
      </div>
    </div>
    <div class="action-div-wait">
      <div v-if="isOwner(user.id) && !game.waitLobbyProperties.lauchGame">
        <button :class="`${gameIsReady ? 'isActive' : ''}`" @click="handleStartGame">
          Lancer la partie
        </button>
        <Transition>
          <div v-if="panelError.error" class="panel-error-wait">
            <p>{{ panelError.message }}</p>
          </div>
        </Transition>
      </div>
      <div v-else-if="!game.waitLobbyProperties.lauchGame"><p>En attente du propiétaire pour lancer la partie...</p></div>
      <div v-if="game.waitLobbyProperties.lauchGame">
        <countDown :countDown="game.waitLobbyProperties.countDown" @ready="lauchGame" />
      </div>
    </div>
    </div>
  </div>
  </div>
</template>

<script setup lang="ts">
import type { panelErrorInfoRoom } from '@/models/room.model'
import OptionSvg from '@/assets/SVG/OptionSvg.vue'
import { computed, reactive, ref, watch } from 'vue'
import { gameStore } from '@store/game'
import { userStore } from '@store/user'
import { appliStore } from '@store/appli'
import ActivePopUp from '../UI/ActivePopUp.vue'
import ArrowUndoSvg from '@/assets/SVG/ArrowUndoSvg.vue'
import { useSocketStore } from '@store/socket'
import BadgeOwner from '@/assets/SVG/BadgeOwner.vue'
import ConnexionStatut from '../UI/ConnexionStatut.vue'
import happyFace from '@/assets/SVG/happyFace.vue'
import countDown from '@/components/gameRoom/divers/CountDown.vue'
import OptionsLobby from '../WaitLobby/OptionsLobby.vue'

const panelError: panelErrorInfoRoom = reactive({
  error: false as boolean,
  message: '',
  event: null as null | number,
  setError(message: string, error: boolean): void {
    this.error = error
    this.message = message
    this.event = window.setTimeout(() => {
      this.error = false
    }, 3000)
  }
})
const appli = appliStore()
const game = gameStore()
const user = userStore()
const socket = useSocketStore()
const widthAppli = computed(() => appli.appliWidth)
const showPanelOption = ref(false)
const currentPlayer = computed(() => {
  const index = game.players.findIndex((player) => player.id === user.id)
  if (index !== -1) {
    return [...game.players.slice(index), ...game.players.slice(0, index)]
  } else return game.players
})
const gameIsReady = computed(() => game.players.every((player) => player.ready))
function isOwner(id: number) {
  return game.owner === id
}
watch(gameIsReady, (value) => {
  if (!value && game.waitLobbyProperties.lauchGame && isOwner(user.id)) {
    game.waitLobbyProperties.canceCount()
  }
})
function isPlayer(id: number) {
  return user.id === id
}
function isReady(id: number) {
  return game.players.find((player) => player.id === id)?.ready
}
function sendReady(id: number) {
  socket.socket?.emit('ready:player', !game.players.find((player) => player.id === id)?.ready)
}
function kickPlayer(id: number) {
  socket.socket?.emit('kick:player', id)
}
function handleStartGame() {
  if (panelError.event) {
    clearTimeout(panelError.event)
  }
  if (gameIsReady.value) {
    game.waitLobbyProperties.startCount()
  } else {
    panelError.setError('Tous les joueurs ne sont pas prêt', true)
  }
}
function lauchGame() {
  if(user.id===game.owner){
    socket.socket?.emit('lauchGame:room')
  }
}
</script>

<style scoped>
#panelOption{
  position: absolute;
  top: 0;
  right: 0;
  width: 100%;
  height: fit-content;
  background-color: var(--color-background);
  z-index: 10;
 padding: 10px;
 animation: popfromUp 0.5s;
 display: grid;
  grid-template: 30px 1fr / 1fr ;
}
.option{
  justify-self: end;
  cursor: pointer;
}
.panel-enter-active,
.panel-leave-active{
  transition: all 0.5s ease;
}
.panel-enter-from,
.panel-leave-to
{
  opacity: 0;
  transform: translateY(-10%);
}
.panel-enter-to{
  opacity: 1;
  transform: translateY(0);
}


.undo{
  justify-self: end;
  cursor: pointer;
}
.countDown{
  color: var(--normalTextColor);
}
.kick:hover {
  background-color: #ff00009c !important;
}
.action-div-wait {
  overflow: hidden;
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 10px;
  flex-direction: column;
  margin-top: 20px;
}

.v-enter-active,
.v-leave-active {
  transition: opacity 0.5s ease;
}

.v-enter-from {
  opacity: 0;
  transform: translateY(-100%);
}
.v-leave-to {
  opacity: 0;
}
.main-waitLobby {
  width: 100%;
  display: flex;
  gap: 10px;
  justify-content: center;
  align-items: center;
  flex-wrap: wrap;
  padding: 10px;
}
.wait-info {
  display: grid;
  grid-template: repeat(1, auto) /  12px 18px repeat(3, 1fr);
  background-color: rgba(0, 0, 0, 0.5);
  padding: 10px;
  justify-content: space-between;
  align-items: center;
  align-content: space-around;
  justify-items: center;
  border-radius: 5px;
  width: 320px;
  height: 80px;
  color: var(--normalTextColor);
  gap: 10px;
  transition: all 0.5s ease;
}
.name-player {
  grid-row: 1/span 2;
  grid-column: 3 / span 2;
}
.face {
  grid-row: 1;
  grid-column: 5;
  justify-self: end;
}
.wait-status {
  display: flex;
  justify-content: space-between;
  align-items: center;
  justify-self: start;
  gap: 5px;
  grid-column: 1;
  grid-row: 1/span 2;
}
button {
  width: 200px;
  height: 50px;
  background-color: #f1f1f156;
  border: none;
  border-radius: 10px;
  font-size: 20px;
  cursor: not-allowed;
  transition: all 0.5s ease;
}
.isActive {
  background-color: #4c9e4c;
  cursor: pointer;
}
.ready-container {
  width: 20px;
  height: 20px;
  border-radius: 50%;
  background-color: #797979;
}
.ready-button {
  width: 80px;
  height: 25px;
  background-color: #f1f1f14d;
  border: none;
  border-radius: 5px;
  font-size: 15px;
  cursor: pointer;
  grid-column: 5 / span 1;
  grid-row: 2;
}
.ready-button:hover {
  background-color: #f1f1f1;
}
.main-wait {
  display: grid;
  grid-template:30px 1fr / 1fr;
  padding: 0 5px;
  position: relative;
}
.flex-main {
  display: flex;
  flex-direction: row-reverse;
  justify-content: center;
  align-items: flex-start;
  gap: 20px;
}
.ready {
  background-color: white !important;
}
.isReady {
  box-shadow: 0 0 10px 0 rgb(21, 155, 72) !important;
}
.owner {
  grid-row: 1/span 2;
  grid-column: 2;
}
.panel-error-wait {
  background-color: #ff00009c;
  color: var(--normalTextColor);
  border-radius: 5px;
  padding: 5px;
  width: 200px;
  text-align: center;
  font-size: 15px;
  transition: all 0.5s ease;
  margin-top: 10px;
}
@media (min-width:630px){
  #panelOption{
    display: none;
  }
}
@keyframes popfromUp {
  0% {
    opacity: 0;
    transform: translateY(-50px);
  }
  50% {
    opacity: 0;
  }
  100% {
    opacity: 1;
    transform: translateY(0);
  }
  
}
</style>
