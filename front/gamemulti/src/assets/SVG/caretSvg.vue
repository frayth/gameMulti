<template>
  <svg :width="size" :height="size" :fill="color" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
    <path d="m6 15 6-7.5 6 7.5H6Z"></path>
   </svg>
</template>

<script setup lang="ts">
defineProps({
 size:{
   type:Number,
   default: 50
 },
  color:{
    type:String,
    default: 'black'
  }
})
</script>

<style scoped>

</style>