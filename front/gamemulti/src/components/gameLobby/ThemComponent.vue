<template>
  <div class=" theme-comp">
    <h1>Thème</h1>
    <p class="important">{{game.gameQuestions.category}}</p>
    <h1>Difficulté</h1>
    <difficulty :difficulty="game.gameQuestions.difficulty"></difficulty>

  </div>
</template>

<script setup lang="ts">
import {gameStore} from '@/stores/game'
import difficulty from '@/components/UI/difficultyBar.vue'
const game=gameStore()

</script>

<style scoped>
.theme-comp{
  width: 100%;
display:grid;
grid-template:repeat(4,1fr) /1fr ;
border-radius: 10px;
padding: 10px;
margin: 10px;
justify-content: center;
align-items: center;
user-select: none;
justify-items: center;
}
h1{
  text-align:center;
  color:var(--normalTextColor);

}
p{
  text-align:center;
  color:(--normalTextColor);
}
.important{
  font-size: 30px;
  color: #d6b810e3;
  text-shadow: rgba(255, 255, 255, 0.219) 1px 0px 2px, rgba(0, 0, 0, 0.219) -1px 0px 2px;
}
</style>