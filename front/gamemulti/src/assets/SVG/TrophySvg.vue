<template>
  <svg :width="size" :height="size" :fill viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
    <path d="M19.5 5.25H18V4.5A1.502 1.502 0 0 0 16.5 3h-9A1.502 1.502 0 0 0 6 4.5v.75H4.5A1.502 1.502 0 0 0 3 6.75V9a3.003 3.003 0 0 0 3 3h.242a6.126 6.126 0 0 0 5.008 4.45v3.05H7.5V21h9v-1.5h-3.75v-3.052A5.975 5.975 0 0 0 17.805 12H18a3.003 3.003 0 0 0 3-3V6.75a1.502 1.502 0 0 0-1.5-1.5ZM6 10.5A1.502 1.502 0 0 1 4.5 9V6.75H6v3.75ZM19.5 9a1.502 1.502 0 0 1-1.5 1.5V6.75h1.5V9Z"></path>
   </svg>
</template>

<script setup lang="ts">
  import {defineProps} from 'vue'
  defineProps({
    fill:{
      type:String,
      default:'#347456'
    },
    size:{
      type:Number,
      default:24
    }
  })
</script>

<style scoped>

</style>