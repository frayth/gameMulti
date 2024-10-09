<template>
  <svg :width="size" :height="size" fill="none" :stroke="color" stroke-linecap="round" stroke-linejoin="round" :stroke-width="strokeWidth" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
    <path d="M5.25 15.375 12 8.625l6.75 6.75"></path>
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