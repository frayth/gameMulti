<template>
  <div>
    <timerBar :timer="timerLeftInSecond"></timerBar>
    <div>{{ game.gameQuestions.question }}</div>
      <div>
        <div v-for="answer in game.gameQuestions.answers" :key="`${answer}`">
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

</style>