<template>
  <div class="difficulty">
      <div class="container-difficulty">
          <div v-for="value in 10" :key="`difficulty${value}`" :class="` dif difficulty${value} ${value<= difficulty? 'glow':''}`">
              <div v-if="value===difficulty" class="number">
                  <p>{{value}}</p>
              </div>
              <carret v-if="value===difficulty" :size="50" />
          </div>
      </div>
  </div>
</template>

<script setup lang="ts">
import carret from '@/assets/SVG/caretSvg.vue'
  defineProps({
    difficulty:{
      type:Number,
      required:true
    },
  })
</script>

<style scoped>
.container-difficulty{
 width: 100%;
display:grid;
grid-template:1fr/repeat(10,1fr);
height: 25px;
}
.dif{
  display:flex;
  justify-content:center;
  align-items:center;
  position:relative;
  opacity: 0.5;
}
.difficulty1{
  background-color: #00FF00;
}
.difficulty2{
  background-color: #66FF00;
}
.difficulty3{
  background-color: #CCFF00;
}
.difficulty4{
  background-color: #FFFF00;
}
.difficulty5{
  background-color: #FFCC00;
}
.difficulty6{
  background-color: #FF9900;
}
.difficulty7{
  background-color: #FF6600;
}
.difficulty8{
  background-color: #FF3300;
}
.difficulty9{
  background-color: #FF0000;
}
.difficulty10{
  background-color: #410202;
}
.difficulty{
  width: 75%;
  border-radius: 20px;
  overflow: hidden;
  border: 2px solid rgba(255, 255, 255, 0.288);
}
.glow{
  opacity: 1;
}
.number {
  position: absolute;
  top:-2px;
  color: black;
  font-size: 14px;
  font-weight: bold;
  z-index: 1;
}
</style>