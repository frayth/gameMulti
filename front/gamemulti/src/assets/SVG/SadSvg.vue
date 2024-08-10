<template>
  <svg :width="size" :height="size" :fill viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
    <path d="M5 3h14v2H5V3Zm0 16H3V5h2v14Zm14 0v2H5v-2h14Zm0 0h2V5h-2v14ZM10 8H8v2h2V8Zm4 0h2v2h-2V8Zm-5 8v-2h6v2h2v-2h-2v-2H9v2H7v2h2Z"></path>
   </svg>
</template>

<script setup lang="ts">
defineProps({
  size:{
    type: Number,
    default: 24
  },
  fill:{
    type: String,
    default: 'red'
  }
})
</script>

<style scoped>

</style>