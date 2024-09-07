<template>
  <div class="vision">
    <div
      v-for="element in elementsPresent"
      :key="element.id"
      :style="{
        position: 'absolute',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        gap: '5px',
        opacity: element.opacity,
        bottom: `${element.y}%`,
        left: `${element.x}%`,
        transform: 'translate(-50%, -50%)',
      }"
    > 
      <Cognitive />
      <p class="name-vision">{{ element.name }}</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { gameStore } from '@/stores/game'
import { computed, watch, ref, onUnmounted } from 'vue'
import Cognitive from '@/assets/SVG/CognitiveSvg.vue'
const responseVision = computed(() => gameStore().InfoCurrentQuestion.currentResponse)
const elementsPresent = ref<FloatingName[]>([])
watch(responseVision, (newVal, oldValue) => {
  newVal.forEach((element) => {
    oldValue.includes(element)
      ? null
      : elementsPresent.value.push(
          new FloatingName(
            gameStore().players.find((el) => el.id === element)?.name,
            (Math.random() * 60)+20,
            0,
            element
          )
        )
  })
})
class FloatingName {
  name: string | undefined
  x: number
  y: number
  id: number
  opacity: number
  constructor(name: string | undefined, x: number, y: number, id: number) {
    this.opacity = 1
    this.name = name
    this.x = x
    this.y = y
    this.id = id
  }
  incrementer() {
    this.y += 2
    if (this.y > 50) {
      this.opacity -= 0.04
    }
  }
}
const event = setInterval(() => {
  elementsPresent.value.forEach((element) => {
    element.incrementer()
  })
  elementsPresent.value=elementsPresent.value.filter((element)=>element.y<100)

}, 30)
onUnmounted(() => {
  clearInterval(event)
})
</script>

<style scoped>
.vision {
  width: 100%;
  height: 100px;
  min-width: 100px;
  background-color: transparent;
  position: relative;
}
.name-vision {
  color: #347456;
  font-size: 20px;
  text-shadow: 1px 1px 2px black;
}
</style>
