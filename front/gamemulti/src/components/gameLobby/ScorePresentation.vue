<template>
  <div class="presentation">
      <div class="pres-description"><p>{{firstPart}}<span>{{correctSpan.value}}</span> {{secondPart}}</p></div>
      <div class="separator"></div>
      <scorePresentation v-for="(game,i) in gameStat.players" :key="i" :score="game.oldScore" :name="game.name" :bonus="game.bonus" :activeSound="game.id===user.id"></scorePresentation>
  </div>
</template>

<script setup lang="ts">
  import {gameStore} from '@/stores/game'
  import { userStore } from '@store/user';
  import {computed} from 'vue'
  import scorePresentation from '@/components/ScorePresentation/skeletonPresentation.vue'
  const user=userStore()
  const game = gameStore()
  const gameStat=computed(()=>game.gameStat)
  const correctSpan=  computed(()=>{
    const word=game.gameQuestions.answers.filter((el)=>game.gameQuestions.correctAnswer.toLowerCase().includes(el.value.toLowerCase()))[0]?.value
    if(!word) return {value:'',start:0,end:0}
    const {start,end}=game.gameQuestions.correctAnswer.toLowerCase().indexOf(word.toLowerCase())===0?{start:0,end:word.length}:{start:game.gameQuestions.correctAnswer.toLowerCase().indexOf(word.toLowerCase()),end:game.gameQuestions.correctAnswer.toLowerCase().indexOf(word.toLowerCase())+word.length}
    return {
      value:word,
      start,
      end
    }
  })
  const {firstPart,secondPart}= game.gameQuestions.correctAnswer.split('').reduce((acc,el,i)=>{
      if(i < correctSpan.value.start){
        acc.firstPart+=el
      }else if(i>=correctSpan.value.end){
        acc.secondPart+=el
      }
      return acc
    },{firstPart:'',secondPart:''})
  


</script>

<style scoped>
.pres-description{
  font-size: 1.5em;
  color: var(--normalTextColor);
  text-align: center;
  margin-bottom: 10px;
  width: 100%;
  height: fit-content;
}
.pres-description span{
  color:#347456;
  font-weight: bold;
  animation: rotate 1s linear infinite;
}
.separator{
  width: 75%;
  height: 1px;
  background-color: var(--separatorColor);
  margin-bottom: 10px;
}
.presentation{
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}
@media (max-width: 600px) {
  .pres-description{
    font-size: 1em;
  }
}

@keyframes rotate {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}
</style>