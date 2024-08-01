<template>
  <div class="difficulty">
    <div class="container-difficulty">
      <div
        v-for="value in 10"
        :key="`difficulty${value}`"
        :class="` dif difficulty${value} ${value <= currentDifficulty ? 'glow' : ''}`"
      >
        <div v-if="value === currentDifficulty" class="number">
          <p>{{ value }}</p>
        </div>
        <carret v-if="value === currentDifficulty" :size="50" />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import carret from '@/assets/SVG/caretSvg.vue'
import { ref, defineProps } from 'vue'
type Timeout = ReturnType<typeof setInterval>
const props = defineProps({
  difficulty: {
    type: Number,
    required: true
  }
})
const currentDifficulty = ref(1)
let event: Timeout | null = null
setTimeout(() => {
  event = setInterval(() => {
    if (currentDifficulty.value == props.difficulty) {
      if (event) {
        clearInterval(event)
      }
    }else{
      currentDifficulty.value++
    }
    

  }, 100)
}, 300)
</script>

<style scoped>
.container-difficulty {
  width: 100%;
  display: grid;
  grid-template: 1fr / repeat(10, 1fr);
  height: 25px;
  transition: all 0.1s;
}
.dif {
  display: flex;
  justify-content: center;
  align-items: center;
  position: relative;
  opacity: 0.5;
}
.difficulty1 {
  background-color: #00ff00;
}
.difficulty2 {
  background-color: #66ff00;
}
.difficulty3 {
  background-color: #ccff00;
}
.difficulty4 {
  background-color: #ffff00;
}
.difficulty5 {
  background-color: #ffcc00;
}
.difficulty6 {
  background-color: #ff9900;
}
.difficulty7 {
  background-color: #ff6600;
}
.difficulty8 {
  background-color: #ff3300;
}
.difficulty9 {
  background-color: #ff0000;
}
.difficulty10 {
  background-color: #410202;
}
.difficulty {
  width: 75%;
  border-radius: 20px;
  overflow: hidden;
  border: 2px solid rgba(255, 255, 255, 0.288);
}
.glow {
  opacity: 1;
  transition: opacity 0.5s;
  box-shadow: 1px 0 10px 2px rgba(255, 255, 255, 0.5);
}
.number {
  position: absolute;
  top: -2px;
  color: black;
  font-size: 14px;
  font-weight: bold;
  z-index: 1;
}
</style>
