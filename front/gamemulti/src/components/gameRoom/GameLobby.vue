<template>
  <div class="gameLobby">
    <div v-if="game.phaseGame === 'intro'" class="container-lobby">
      <regle></regle>
    </div>
    <div v-else-if="game.phaseGame === 'presentation'" class="container-lobby">
      <Theme></Theme>
    </div>
    <question v-else-if="game.phaseGame === 'question'"></question>
    <div v-else-if="game.phaseGame === 'score'" :style="{ width: '100%' }" class="container-lobby">
      <ScorePresentation :style="{ width: '100%' }"></ScorePresentation>
    </div>
    <endComponent v-else class="container-lobby"></endComponent>
    <Teleport to="#screenNotif" v-if="game.phaseGame !== 'intro'">
      <Transition mode="out-in">
        <div id="scoreboard" v-if="scoreGameIsOpen">
          <close class="close" @click="scoreGameIsOpen = false" :size="50">Close</close>
          <div class="view-scoreboard">
            <div class="option-scoreboard">
              <trophy  :size="16" :class="{'selected-option':selectedOption==='score'}" @click="selectedOption='score'"></trophy>
              <GearSvg :size="16" :fill="'var(--main-green)'" :class="{'selected-option':selectedOption==='option'}"  @click="selectedOption='option'" ></GearSvg>
            </div>
            <div class="view-element">
              <scoreBoard v-show="selectedOption==='score'"></scoreBoard>
              <OptionsLobby v-show="selectedOption==='option'" :disabled="true"></OptionsLobby>
            </div>
            
          </div>
         
          
        </div>
        <div
          v-else
          @mousedown="activeDrag"
          :style="{ top: trophyPosition.top + 'px' }"
          :class="{
            openScore: true,
            normalPosition: game.phaseGame !== 'end',
            endPosition: game.phaseGame === 'end'
          }"
        >
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
import GearSvg from '@/assets/SVG/GearSvg.vue'
import OptionsLobby from '../WaitLobby/OptionsLobby.vue'
const trophyPosition = ref<{top:number|string}>({
  top: '50%'
})

function activeDrag() {
  console.log('drag')
  window.addEventListener('mousemove', dragElement)
  window.addEventListener('mouseup', () => {
    window.removeEventListener('mousemove', dragElement)
    window.removeEventListener('mouseup', () => {})
  })
}
function dragElement(e: MouseEvent) {
  trophyPosition.value = {
    top: e.clientY< 50 ? 50 : e.clientY> window.innerHeight - 50 ? window.innerHeight - 50 : e.clientY,
  }
}
const selectedOption= ref<'score' | 'option'>('score')
const game = gameStore()
const scoreGameIsOpen = ref(false)
</script>

<style scoped>
.view-element{
  display: flex;
  gap: 20px;
  justify-content: center;
  align-items: center;

}
.option-scoreboard {
  display: flex;
  justify-content: flex-start;
  align-items: center;
  gap: 20px;
  transition: all 0.5s;
  padding: 5px;
}
.option-scoreboard * {
  cursor: pointer;
}
.view-scoreboard {
  display: flex;
  flex-direction: column;
  gap: 20px;
}
.selected-option{
  transform: scale(2);
  box-shadow: 0px 0px 2px 0px inset var(--normalTextColor), 0px 0px 5px 1px var(--normalTextColor);
  border-radius: 10px;
  padding: 1px;
}
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
  border-left: 1px solid var(--normalTextColor);
  pointer-events: all;
}
.normalPosition {
  top: 50%;
  right: 5px;
}
.endPosition {
  top: 90px !important;
  right: 10px;
}
.container-lobby {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  gap: 30px;
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
.v-leave-active {
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
  #scoreboard .close {
    top: 20px;
    left: 25px;
    width: 20px;
    height: 20px;
  }
  .option-scoreboard {
    justify-content: flex-end;
  }
}
@media (max-width: 400px) {
  .container-lobby {
    padding: 0px;
  }
  .gameLobby {
    padding: 5px;
  }
}
</style>
//
