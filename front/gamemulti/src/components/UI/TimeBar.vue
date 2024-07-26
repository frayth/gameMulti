<template>
  <div class="mainTimerBar">
      <div class="leftBar bar"></div>
      <div class="timer">{{Math.ceil(currenttimer)}}</div>
      <div class="rightBar bar"></div>
  </div>
</template>

<script setup lang="ts">
  import {computed, onUnmounted, ref} from 'vue'
  const props=defineProps<{
    timer:number
  }>()
  const currenttimer=ref(props.timer)
  const interval=setInterval(()=>{
    currenttimer.value-=0.1
    if(currenttimer.value<=0){
      clearInterval(interval)
    }
  },100)
  const timeInPercentage=computed(()=>{
    return ((currenttimer.value*100)/props.timer)
  })

  const barSize=computed (()=>{
    return `${timeInPercentage.value}%`
  })
  const colorBar=computed(()=>{
    switch (true) {
      case (timeInPercentage.value>95):
        return 'rgb(0, 255, 0)'
      case (timeInPercentage.value>90):
        return 'rgb(28, 255, 0)'
      case (timeInPercentage.value>85):
        return 'rgb(57, 255, 0)'
      case (timeInPercentage.value>80):
        return 'rgb(85, 255, 0)'
      case (timeInPercentage.value>75):
        return 'rgb(113, 255, 0)'
      case (timeInPercentage.value>70):
        return 'rgb(142, 255, 0)'
      case (timeInPercentage.value>65):
        return 'rgb(170, 255, 0)'
      case (timeInPercentage.value>60):
        return 'rgb(198, 255, 0)'
      case (timeInPercentage.value>55):
        return 'rgb(227, 255, 0)'
      case (timeInPercentage.value>50):
        return 'rgb(255, 255, 0)'
      case (timeInPercentage.value>45):
        return 'rgb(255, 227, 0)'
      case (timeInPercentage.value>40):
        return 'rgb(255, 198, 0)'
      case (timeInPercentage.value>35):
        return 'rgb(255, 170, 0)'
      case (timeInPercentage.value>30):
        return 'rgb(255, 142, 0)'
      case (timeInPercentage.value>25):
        return 'rgb(255, 113, 0)'
      case (timeInPercentage.value>20):
        return 'rgb(255, 85, 0)'
      case (timeInPercentage.value>15):
        return 'rgb(255, 57, 0)'
      case (timeInPercentage.value>10):
        return 'rgb(255, 28, 0)'
      case (timeInPercentage.value>5):
        return 'rgb(255, 0, 0)'
      default:
        return 'red'
      
    }
  })
  onUnmounted(()=>{
    clearInterval(interval)
  })
</script>

<style scoped>
.mainTimerBar{
  display: grid;
  grid-template: 1fr / 1fr 50px 1fr;
  width: 100%;
  height: 50px;
  color: black;
  padding: 0 10px;
}
.bar{
  width: v-bind(barSize);
  height: 10px;
  background-color: v-bind(colorBar);
  align-self: center;
  transition: all 0.2s linear;
  box-shadow: 0px 2px 1px 0px v-bind(colorBar), 0px -2px 1px 0px v-bind(colorBar);
}
.timer{
  align-self: center;
  justify-self: center;
  color: white;
  font-size: 20px;
  background-color: #000;
  border-radius: 5px;
  padding: 5px;
  width: 50px;
  text-align: center;
  transition: all 0.2s linear;
  box-shadow: 2px 0px 10px 0px v-bind(colorBar), -2px 0px 10px 0px v-bind(colorBar), 0px 2px 10px 0px v-bind(colorBar), 0px -2px 10px 0px v-bind(colorBar);
  user-select: none;

}
.leftBar{
  justify-self: end;
  border-radius: 10px 0 0 10px;
}
.rightBar{
  justify-self: start;
  border-radius: 0 10px 10px 0;
}
</style>