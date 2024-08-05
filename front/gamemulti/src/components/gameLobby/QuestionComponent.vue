<template>
  <div>
    <timerBar :timer="timerLeftInSecond"></timerBar>
    <div class="question">{{ game.gameQuestions.question }}</div>
    <div class="question-container">
      <tempoButton
        :class="`pass-response ${game.InfoCurrentQuestion.personnalResponse === -1 && game.InfoCurrentQuestion.personnalResponse !== null ? 'select' : game.InfoCurrentQuestion.personnalResponse !== null ? 'notSelect' : ''}`"
        :timer="1000"
        @trigger="game.sendResponse(-1)"
        :disable="tempoButtonIsDisable"
      >
        <p>Passer</p>
      </tempoButton>
      <div class="response-container">
        <div
          v-for="answer in game.gameQuestions.answers"
          :key="`${answer}`"
          :class="`response ${game.InfoCurrentQuestion.personnalResponse === answer.id ? 'select' : game.InfoCurrentQuestion.personnalResponse !== null ? 'notSelect' : ''}`"
          @click="game.sendResponse(answer.id)"
        >
          <p>{{ answer.value }}</p>
        </div>
      </div>
    </div>
    <responseVision></responseVision>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { gameStore } from '@/stores/game'
import timerBar from '@/components/UI/TimeBar.vue'
import tempoButton from '@/components/UI/buttonTempo.vue'
import responseVision from '@/components/gameLobby/responseVision.vue'
const game = gameStore()

const timerLeftInSecond = computed(() => {
  const timeInMillisecond = game.gameQuestions.nextEvent - Date.now()
  return timeInMillisecond / 1000
})
const tempoButtonIsDisable = computed(() => game.InfoCurrentQuestion.personnalResponse !== null)
</script>

<style scoped>
.pass-response {
  width: fit-content;
  min-width: 45%;
  height: 50px;
  color: rgb(255, 247, 247);
  background-color: #ec141473;
  border: none;
  border-radius: 10px;
  font-size: 20px;
  cursor: pointer;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 5px;
  user-select: none;
}
.question-container {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}
.response-container {
  display: flex;
  justify-content: center;
  align-items: center;
  flex-wrap: wrap;
}
.response {
  width: fit-content;
  min-width: 45%;
  height: 50px;
  color: black;
  background-color: #f1f1f1;
  border: none;
  border-radius: 10px;
  font-size: 20px;
  cursor: pointer;
  margin: 10px;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 5px;
  user-select: none;
}
.select {
  background-color: blue !important;
  color: white !important;
}
.notSelect {
  background-color: black !important;
  color: white !important;
  opacity: 0.5;
  cursor: initial;
}
.question {
  text-align: center;
  font-size: 30px;
  margin: 20px;
  color: white;
  user-select: none;
}
@media (max-width: 600px) {
  .response {
    width: auto;
    font-size: 18px;
    min-width: 35%;
    height: 40px;
  }
  .question {
    font-size: 20px;
  }
  .pass-response {
    font-size: 18px;
    height: 40px;
  }
}
</style>
