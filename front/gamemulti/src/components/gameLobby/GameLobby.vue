<template>
  <div>
    <div v-if="game.phaseGame==='intro'" >
      <div>Salut le questionnaire va bientot commencer</div>
    </div>
    <div v-else-if="game.phaseGame==='presentation'">
      <div>
        <p>{{game.gameQuestions.category}}</p>
        <p>{{game.gameQuestions.difficulty}}</p>
      </div>
    </div>
    <question v-else-if="game.phaseGame==='question'" ></question>
    <div v-else > Ceci est le score de la partie</div>
  </div>
</template>

<script setup lang="ts">
import Question from './QuestionComponent.vue';
import {gameStore} from '@/stores/game'
const game=gameStore()

</script>

<style scoped>

</style>