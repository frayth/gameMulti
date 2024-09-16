<template>
  <div class="wrapper-skip">
    <buttonTempo 
      id="tempo"
      :class="classButton"
      @trigger="game.skipRegle()"
      :timer="1000"
      :primary-color="'var(--main-green)'"
      :secondary-color="'#153124'"
      :text-color="'white'"
      :trigger-color="'transparent'"
      :trigger-text-color="'var(--main-red)'"
      >Passer la règle</buttonTempo
    >
    <Transition>
    <div :style="{display:'flex', alignItems:'center'}" v-if="playershasSkipRule.length!==0" class='wrapper-player' >
      <span>{{game.playersHasSkipRule.length}}/{{ game.players.length }}</span>
        <peopleSvg :color="'var(--main-green)'"></peopleSvg>
    </div>
    </Transition>
  </div>
</template>

<script setup lang="ts">
import peopleSvg from '@/assets/SVG/peopleSvg.vue'
import {computed,ref,watch} from 'vue'
import { gameStore } from '@store/game'
import buttonTempo from '@/components/UI/buttonTempo.vue'


const game = gameStore()
const playershasSkipRule =computed(()=>game.playersHasSkipRule)
const classButton = ref({
  'g2':true
})
watch(playershasSkipRule,(value)=>{
  if(value.length!==0){
    classButton.value['g2']=false
  }else{
    classButton.value['g2']=true
  }
},{deep:true})


</script>

<style scoped>

.wrapper-skip {
  display:grid;
  grid-template: 1fr / auto 50px;
  background-color: var(--color-background);
  border-radius: 10px;
  gap: 10px;
}
#tempo {
  width: fit-content;
  height: fit-content;
  font-size: 14px;
  cursor: pointer;
  padding: 5px;
  z-index:5;
}
.v-enter-from{
  opacity: 0;
  transform: translateX(-100%);
}
.v-enter-to{
  opacity: 1;
  transform: translateX(0);
}
.v-enter-active{
  transition: all 1s;
}
.g2{
  grid-column: 1/span 2;
}
@media (max-width: 700px){
  div{
    padding: 0 !important;
  }
}
</style>
