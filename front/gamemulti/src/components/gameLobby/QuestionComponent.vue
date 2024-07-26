<template>
  <div>
    <timerBar :timer="timerLeftInSecond"></timerBar>
    <div class="question">{{ game.gameQuestions.question }}</div>
      <div class="response-container">
        <div v-for="answer in game.gameQuestions.answers" :key="`${answer}`" class="response">
          <p>{{answer.value}}</p>
        </div>
      </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import {gameStore} from '@/stores/game'
import timerBar from '@/components/UI/TimeBar.vue'
const game=gameStore()

const timerLeftInSecond=computed(()=>{
  const timeInMillisecond=game.gameQuestions.nextEvent-Date.now()
  return timeInMillisecond/1000

})


</script>

<style scoped>
.response-container{
  display: flex;
  justify-content: center;
  align-items: center;
  flex-wrap: wrap;
}
.response{
  width:fit-content;
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
.question{
  text-align: center;
  font-size: 30px;
  margin: 20px;
  color: white;
  user-select: none;
}
@media (max-width: 600px) {
  .response{
    width: auto;
    font-size: 18px;
    min-width: 35%;
    height: 40px;
  }
  .question{
    font-size: 20px;
  }
}
</style>