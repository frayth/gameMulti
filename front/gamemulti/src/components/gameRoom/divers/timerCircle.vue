<template>
 <div class="timer-container">
  <svg viewBox="0 0 300 300" :width="size" :height="size" >
    <circle cx="150" cy="150" fill="none" class="circle"
    r="100" stroke-width="3" stroke="#41424145" stroke-linecap="round" />
    <g transform="translate(150,150)">
      <text
        text-anchor="middle"
        transform="rotate(90)"
        font-size="3rem"
        dominant-baseline="middle"
        fill="white">
      {{timerInSecond}}
      </text>
    </g>
    <circle cx="150" cy="150" fill="none"
      r="100" :stroke-width="strokeWidth" :stroke="color" :stroke-dasharray="`${currentStrokeDashArray} ${strokeDashArray}`"
      stroke-linecap="round" />

  </svg>
  <!-- <div class="timer-display">{{timerInSecond}}</div> -->
  </div>
</template>

<script setup lang="ts">

import { computed, onMounted, ref ,onUnmounted} from 'vue';
const strokeDashArray=2*3.1416*100
const currentStrokeDashArray=ref(strokeDashArray)
const refreshRate=ref(10)
const props = defineProps({
  counter: {
    type: Number,
    required: true
  },
  size:{
    type: Number,
    default: 100
  },
  strokeWidth:{
    type: Number,
    default: 5
  },
  color:{
    type: String,
    default: 'red'
  },
  //continue le decompte du timer meme apres 0 
  continueTimer:{
    type: Boolean,
    default: false
  }
  
})
const currentTimer=ref(props.counter)
const event=ref<null |number>(null)
onMounted(()=>{
  event.value=window.setInterval(()=>{
    currentTimer.value-refreshRate.value>=0 || props.continueTimer? currentTimer.value-=refreshRate.value:0
    currentStrokeDashArray.value-=(refreshRate.value*strokeDashArray)/(props.counter-1000)
    if(currentStrokeDashArray.value<=0){
     props.continueTimer?currentStrokeDashArray.value=strokeDashArray:currentStrokeDashArray.value=0
    }
  },refreshRate.value)
})
onUnmounted(()=>{
  clearInterval(event.value as number)
})
const timerInSecond=computed(()=>{
  return Math.floor(currentTimer.value/1000)
})

</script>

<style scoped>
.timer-container{
  width: fit-content;
  height: fit-content;
  position: relative;
  
}
svg{
  transform: rotate(-90deg);
}
.timer-display{
  font-size: 1rem;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%,-50%);
  z-index: 100;
}
</style>