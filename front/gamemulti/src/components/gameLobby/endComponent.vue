<template>
  <div class="end">
    <div class="cont-podium">
      <p>Résultat</p>
      <div>
        <podium  class="podium" :height="200" ></podium>
      </div>
  </div>
  <history-comp :history="historyToShow"></history-comp>
  </div>
</template>

<script setup lang="ts">
import podium from '@/components/gameLobby/endLobby/podiumComp.vue';
import { gameStore } from '@/stores/game'
import { computed, onMounted } from 'vue';
import HistoryComp from './endLobby/HistoryComp.vue';
const historyToShow=computed(()=>game.gameHistory.value)
const game = gameStore()
onMounted(async()=>{
  await game.gameHistory.getHistory()
})

</script>

<style scoped>
.end{
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 5px;
  flex-direction: column;
}
.podium{
  width: fit-content;
}
.cont-podium{
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  box-shadow: 0px 0px 10px 0px var(--colorNormalText);
  animation: blinkShadow 2s infinite ease-in-out;
  border-radius: 10px;
}
.cont-podium>p{
  font-size: 2em;
  color: goldenrod;
  text-shadow: 0px 0px 5px rgb(0, 0, 0);
  margin: 10px;
  animation:slide 1s ease-in-out;
}
@keyframes blinkShadow {
  0% {
    box-shadow: 0px 0px 10px 0px var(--colorNormalText);
  }
  50% {
    box-shadow: 0px 0px 10px 0px transparent;
  }
  100% {
    box-shadow:0px 0px 10px 0px var(--colorNormalText);
  }
}
@keyframes slide {
  from {
    transform: translateY(-25%);
    opacity: 0;
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
@media (max-width: 600px){
  .cont-podium{
    overflow: hidden;
  }
}
</style>