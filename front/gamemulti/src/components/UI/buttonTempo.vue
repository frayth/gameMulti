<template>
  <div class="mainTempoButton" @mousedown="app.isMobile?'':lauchCount()" @mouseup="app.isMobile?'':cancelCount()" @touchstart="app.isMobile?lauchCount():null" @touchend="app.isMobile?cancelCount():null">
    <div class="backgroundButton" v-if="showMovingBackground"></div>
    <div class="slotTempo"><slot ></slot></div>

  </div>
</template>

<script setup lang="ts">
import { appliStore } from '@store/appli';
import { ref, defineProps, computed } from 'vue'
const emit=defineEmits(['trigger'])
const showMovingBackground=ref(true)
const app=appliStore()
let interval=ref<NodeJS.Timeout|null>(null)
const props=defineProps({
  primaryColor:{
    type: String,
    default: "#f1f1f1"
  },
  secondaryColor:{
    type: String,
    default: "#ec141473"
  },
  timer:{
    type: Number,
    default: 1000
  },disable:{
    type: Boolean,
    default: false
  }
})
const currentTimer= ref(props.timer)
function lauchCount(){
  if(props.disable) return
  currentTimer.value=props.timer
  interval.value=setInterval(()=>{
    currentTimer.value-=10
    if(currentTimer.value<=0){
      emit('trigger')
      clearInterval(interval.value as NodeJS.Timeout)
      showMovingBackground.value=false
    }
  },10)
}
function cancelCount(){
  if(props.disable) return
  clearInterval(interval.value as NodeJS.Timeout)
  currentTimer.value=props.timer
}
const widthBackground=computed(()=>(1-(currentTimer.value/props.timer))*100+'%')

</script>

<style scoped>
  .mainTempoButton{
    display: flex;
    justify-content: center;
    align-items: center;
    width: 100%;
    height: 100%;
    background-color: #f1f1f1;
    border: none;
    border-radius: 10px;
    font-size: 20px;
    cursor: pointer;
    display: flex;
    justify-content: center;
    align-items: center;
    padding: 5px;
    user-select: none;
    position: relative;
  }
  .backgroundButton{
    position: absolute;
    width: v-bind(widthBackground);
    height: 100%;
    background-color: #ec141473;
    border: none;
    border-radius: 10px;
    transition:all 0.2s
  }
  .slotTempo{
    z-index: 10;
    width: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    height: 100%;
  }
</style>