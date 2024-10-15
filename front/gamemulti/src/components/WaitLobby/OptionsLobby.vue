<template>
  <div class="option-container">
    <h1>Options</h1>
    <div class="cat-container">
      <h2>Principales</h2>
      <OptionElement
        @update="updateOptions"
        v-model="options.defautScore"
        :editable="game.owner===user.id"
        :min="50"
        :max="150"
        :step="10"
        :disable="statusGame"
        message="Points pour victoire"
      ></OptionElement>
      <OptionElement
      :editable="game.owner===user.id"
         @update="updateOptions"
        v-model="options.responseTime"
        :min="10000"
        :max="25000"
        :step="1000"
        :disable="statusGame"
        message="Temps par question"
      ></OptionElement>
    </div>
    <div class="separator"></div>
    <div class="cat-container">
      <h2>Bonus</h2>
      <OptionElement
      :editable="game.owner===user.id"
       @update="updateOptions"
        v-model="options.goodResponse"
        :min="1"
        :max="10"
        :step="1"
        :disable="statusGame"
        message="Bonne réponse"
      ></OptionElement>
      <OptionElement
      :editable="game.owner===user.id"
       @update="updateOptions"
        v-model="options.numberOfStreakForBonus"
        :min="1"
        :max="5"
        :step="1"
        :disable="statusGame"
        message="Ajout bonus streak"
      ></OptionElement>
      <OptionElement
      :editable="game.owner===user.id"
       @update="updateOptions"
        v-model="options.fasterResponse"
        :min="0"
        :max="10"
        :step="1"
        :disable="statusGame"
        message="Bonus rapidité"
      ></OptionElement>
    </div>
    <div class="separator"></div>
    <div class="cat-container">
      <h2>Malus</h2>
      <OptionElement
      :editable="game.owner===user.id"
       @update="updateOptions"
        v-model="options.badResponse"
        :min="-10"
        :max="-1"
        :step="1"
        :disable="statusGame"
        message="Mauvaise réponse"
      ></OptionElement>
      <OptionElement
      :editable="game.owner===user.id"
       @update="updateOptions"
        v-model="options.fasterBadResponse"
        :min="-10"
        :max="0"
        :step="1"
        :disable="statusGame"
        message="Malus rapidité"
      ></OptionElement>
      <OptionElement
      :editable="game.owner===user.id"
       @update="updateOptions"
        v-model="options.noResponse"
        :min="-10"
        :max="0"
        :step="1"
        :disable="statusGame"
        message="Malus passe"
      ></OptionElement>
    </div>
    <button class="reset" @click="resetOptions" v-if="game.owner===user.id">Reset</button>
  </div>
</template>

<script setup lang="ts">
import { onMounted, onUnmounted, ref,watch,computed } from 'vue'
import useFecth from '@/modules/fetch'
import type { optionsGame } from '@/models/room.model'
import OptionElement from './optionsComp/OptionElement.vue'
import { convertNumberPropertiesToString,convertStringPropertiesToNumber } from '@/models/function'
import { useSocketStore } from '@store/socket'
import { userStore } from '@store/user'
import { gameStore } from '@store/game'
import { storeToRefs } from 'pinia'
const socket = useSocketStore()
const user= userStore()
const game= gameStore()
const options = ref<optionsGame>({
  badResponse: '0',
  goodResponse: '0',
  fasterBadResponse: '0',
  fasterResponse: '0',
  noResponse: '0',
  numberOfStreakForBonus: '0',
  responseTime: '0',
  defautScore: '0'
})
const {waitLobbyProperties}=storeToRefs(game)
const statusGame=computed(()=>waitLobbyProperties.value.lauchGame)
watch(statusGame,(value)=>{
  if(value){
    game.optionsGame=options.value
  }
})
async function resetOptions(){
  const data= await useFecth('/info/optionsGame?reset=true', { method: 'GET' }) as optionsGame
  options.value = convertNumberPropertiesToString(data)
  updateOptions()
}
function updateOptions(){
  useFecth('/game/settings', { 
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(convertStringPropertiesToNumber(options.value)) })
}

onMounted(async () => {
  const data = (await useFecth('/info/optionsGame', { method: 'GET' })) as optionsGame
  options.value = convertNumberPropertiesToString(data)

  socket.socket!.on('options:game',async (data: optionsGame) => {
    data=(await useFecth('/info/optionsGame', { method: 'GET' })) as optionsGame
    options.value = convertNumberPropertiesToString(data)
  })
})
onUnmounted(() => {
  socket.socket!.off('options:game')
})
</script>

<style scoped>
.reset{
  width: 200px;
  justify-self: center;
  align-self: center;
  padding: 5px 10px;
  height: fit-content;
  background-color: var(--main-green);
  margin: 20px 0;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  color: var(--normalTextColor);
}
.separator{
  width: 75%;
  height: 2px;
  background-color: var(--main-green);
  margin: 10px 0;
 align-self: center;
}
.option-container{
  display: flex;
  flex-direction: column;
  width: 100%;
  max-width: 500px;
  font-size: 14px;
}
.cat-container{
  width: fit-content;
  align-self: center;
  display:flex;
  flex-direction: column;
  gap: 5px;

}
h1{
  font-size: 20px;
  margin: 20px 0;
  text-align: center;
  margin: 0;
}
h2{
  font-size: 16px;
  margin: 10px 0;
  font-style: italic;
  color:var(--main-green);
  margin: 0;
}
</style>
