<template>
  <div class="wrapper-skip">
    <buttonTempo
      id="tempo"
      @trigger="game.skipRegle()"
      :timer="1000"
      :primary-color="'var(--main-green)'"
      :secondary-color="'#153124'"
      :text-color="'white'"
      :trigger-color="'transparent'"
      :trigger-text-color="'var(--main-red)'"
      >Passer la règle</buttonTempo
    >
    <div :style="{display:'flex', alignItems:'center'}">
      <span>{{game.playersHasSkipRule.length}}/{{ game.players.length }}</span>
      <peopleSvg></peopleSvg>
    </div>
  </div>
</template>

<script setup lang="ts">
import peopleSvg from '@/assets/SVG/peopleSvg.vue'
import { gameStore } from '@store/game'
import buttonTempo from '@/components/UI/buttonTempo.vue'
const game = gameStore()

</script>

<style scoped>
.wrapper-skip {
  display: flex;
  align-items: center;
  padding: 10px;
  background-color: var(--color-background);
  border-radius: 10px;
  margin: 10px 0;
  gap: 10px;
}
#tempo {
  width: fit-content;
  height: fit-content;
  font-size: 14px;
  cursor: pointer;
}
</style>
