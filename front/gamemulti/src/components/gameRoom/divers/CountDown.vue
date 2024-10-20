<template>
  <div class="main-countdown">
    <p>La partie va commencer dans</p>
    <p> {{currentCount}} <span>secondes</span></p>
  </div>
</template>

<script setup lang="ts">
import {defineProps,onMounted, onUnmounted, ref} from 'vue'
const props=defineProps<{
  countDown:number
}>()
const emit=defineEmits(['ready'])
const currentCount=ref<number>(props.countDown)
const  interval=ref<null | number>(null)
onMounted(()=>{
  interval.value=window.setInterval(()=>{
    currentCount.value--
    if(currentCount.value<=0){
      emitReady()
      clearInterval(interval.value as number)
    }
  },1000)
})
function emitReady(){
  emit('ready')
}
onUnmounted(()=>{
  clearInterval(interval.value as number)
})

</script>

<style scoped>
.main-countdown{
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  font-size: 1.5rem;
  color: var(--normalTextColor);
  margin-top: 2rem;
  text-align: center;
}
.main-countdown p{
  margin: 0;
}
.main-countdown span{
  font-size: 1.2rem;
}

</style>