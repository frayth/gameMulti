<template>
  <div>
    <div v-if="bonus==='faster'">
      <Fast fill="var(--main-green)" :size />
    </div>
    <div v-else-if="bonus==='correct'">
      <Happy fill="var(--main-green)" :size />
    </div>
    <div v-else-if="bonus==='incorrect'">
      <Sad fill="var(--main-red)" :size />
    </div>
    <div v-else-if="bonus==='streak'">
      <BullEyes fill="var(--main-green)" :size/>
    </div>
    <div v-else>unknow</div>

  </div>
</template>

<script setup lang="ts">
import BullEyes from '@/assets/SVG/BullEyes.vue'
import Fast from '@/assets/SVG/FastSvg.vue'
import Sad from '@/assets/SVG/SadSvg.vue'
import Happy from '@/assets/SVG/HappySvg.vue'
import { onMounted } from 'vue';
const props=defineProps({
    bonus: {
      type:String as ()=>'faster' | 'correct' | 'incorrect' | 'streak',
      required:true
    },
    size:{
      type:Number,
      default:30
    }
  })
onMounted(()=>{
  console.log(props.bonus)
})
</script>

<style scoped>

</style>