<template>
  <svg :width="size" :height="size" fill="none" :stroke="color" stroke-linecap="round" :stroke-width="strokeWidth" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
    <path d="M12 3.75a8.25 8.25 0 1 0 0 16.5 8.25 8.25 0 0 0 0-16.5Z"></path>
    <path d="M10.875 7.5a3.375 3.375 0 1 0 0 6.75 3.375 3.375 0 0 0 0-6.75v0Z"></path>
    <path d="m13.295 13.297 2.454 2.454"></path>
   </svg>
</template>

<script setup lang="ts">
  defineProps({
    fill:{
      type:String,
      default:'none'
    },
    size:{
      type:Number,
      default:24
    },
    color:{
      type:String,
      default:'#ffffff'
    },
    strokeWidth:{
      type:Number,
      default:1
    }
  })
</script>

<style scoped>

</style>