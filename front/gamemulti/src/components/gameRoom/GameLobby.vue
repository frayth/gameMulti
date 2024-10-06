<template>
  <div class="gameLobby">
    <div v-if="game.phaseGame === 'intro'" class="container-lobby">
      <regle></regle>
    </div>
    <div v-else-if="game.phaseGame === 'presentation'" class="container-lobby">
      <Theme></Theme>
    </div>
    <question v-else-if="game.phaseGame === 'question'"></question>
    <div v-else-if="game.phaseGame === 'score'" :style="{width:'100%'}" class="container-lobby">
      <ScorePresentation :style="{width:'100%'}"></ScorePresentation>
    </div>
      <endComponent v-else class="container-lobby"></endComponent>
    <Teleport to="#screenNotif" v-if="game.phaseGame !== 'intro'">
    <Transition mode="out-in">
      <div id="scoreboard" v-if="scoreGameIsOpen">
        <close class="close" @click="scoreGameIsOpen = false" :size="50">Close</close>
        <scoreBoard></scoreBoard>
      </div>
      <div v-else 
      :class="{
        openScore:true,
        normalPosition:game.phaseGame!=='end',
        endPosition:game.phaseGame==='end'
      }" >
        <trophy @click="scoreGameIsOpen = true" :size="50"></trophy>
      </div>
    </Transition>
    </Teleport>


  </div>
</template>

<script setup lang="ts">
import endComponent from '@/components/gameLobby/endComponent.vue'
import Question from '@/components/gameLobby/QuestionComponent.vue'
import Theme from '@/components/gameLobby/ThemComponent.vue'
import { gameStore } from '@/stores/game'
import scoreBoard from '@/components/gameLobby/TableScore.vue'
import { ref } from 'vue'
import trophy from '@/assets/SVG/TrophySvg.vue'
import close from '@/assets/SVG/CloseSvg.vue'
import ScorePresentation from '@/components/gameLobby/ScorePresentation.vue'
import regle from '@/components/gameLobby/RegleComp.vue'

const game = gameStore()
const scoreGameIsOpen = ref(false)
</script>

<style scoped>
#scoreboard {
  position: absolute;
  height: 100%;
  width: 50%;
  top: -10px;
  right: 0;
  background-color: var(--color-background);
  z-index: 50;
  padding: 20px;
  animation: slideInFromRight 0.5s ease-in-out;
  border-left:1px solid var(--normalTextColor);
  pointer-events: all;
}
.normalPosition{
  top: 50%;
  right: 5px;
}
.endPosition{
  top: 90px;
  right: 10px;
}
.container-lobby{
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  gap:30px
}
#scoreboard .close {
  position: absolute;
  top: 50%;
  left: 0;
  transform: translateX(-50%);
  z-index: 20;
  border: none;
  color: var(--normalTextColor);
  text-align: center;
  text-decoration: none;
  display: inline-block;
  font-size: 16px;
  cursor: pointer;
  border-radius: 50%;
  box-shadow: 0px 0px 5px 1px var(--normalTextColor);
  background-color: var(--color-background);
  pointer-events: all;
}
.gameLobby {
  position: relative;
  overflow-x: hidden;
  width: 100%;
  padding: 10px;
}
.openScore {
  position: absolute;
  cursor: pointer;
  border-radius: 50%;
  box-shadow: 0px 0px 5px 1px var(--normalTextColor);
  width: 50px;
  height: 50px;
  pointer-events: all;
}
.v-enter-active {
  transition: all ease 1s;
}
.v-leave-active{
  transition: all ease 0.3s;
}
.v-enter-from {
  transform: translateX(110%);
}
.v-enter-to {
  transform: translateX(0);
}
.v-leave-from {
  transform: translateX(0);
}
.v-leave-to {
  transform: translateX(110%);
}
@media (max-width: 1000px) {
  #scoreboard {
    width: 100%;
  }
  .normalPosition {
    top: auto;
    bottom: 25px !important;
  }
  #scoreboard .close{
    top:20px;
    left: 25px;
    width: 20px;
    height: 20px;
  }
}
</style>
//
