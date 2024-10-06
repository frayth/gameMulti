<template>
  <div class="presentation">
      <div class="pres-description"><p>{{firstPart}}<span>{{correctSpan.value}}</span> {{secondPart}}</p></div>
      <div class="separator"></div>
      <div v-for="(game,i) in gameStat.players" :key="i" class="test" :style="{animationDelay:`${i*0.15}s`,opacity:0 }">
        <scorePresentation   :score="game.oldScore" :name="game.name" :bonus="game.bonus" :activeSound="game.id===user.id"
        ></scorePresentation>
      </div>
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
.test{
  animation: pop 0.5s ease;
  will-change: opacity, transform;
  animation-fill-mode: forwards;
  width: 100%;
  margin-top: 10px;
}
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
  width: 100%;
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
@keyframes pop {
  0% {
    transform: translateY(-10px);
    opacity: 0;
  }
  100% {
    transform: translateY(0);
    opacity: 1;
  }
}
.list-animation-enter-active {
  animation: fadeInUp 0.5s ease forwards;
}

.list-animation-leave-active {
  animation: fadeOut 0.5s ease forwards;
}

.list-animation-move {
  transition: transform 0.5s ease;
}
@keyframes fadeOut {
  from {
    opacity: 1;
  }
  to {
    opacity: 0;
  }
}
@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>