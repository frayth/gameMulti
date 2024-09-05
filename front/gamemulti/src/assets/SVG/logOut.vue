<template>
  <svg :width="size" :height="size" :fill="fillColor" stroke="#347456" stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
    <path d="M14.25 15.75v1.875a1.875 1.875 0 0 1-1.875 1.875h-7.5A1.875 1.875 0 0 1 3 17.625V6.375A1.875 1.875 0 0 1 4.875 4.5H12c1.036 0 2.25.84 2.25 1.875V8.25"></path>
    <path d="M17.25 15.75 21 12l-3.75-3.75"></path>
    <path d="M8.25 12h12"></path>
   </svg>
</template>

<script setup lang="ts">
  import { defineProps,computed,ref } from 'vue'
  const props=defineProps({
    size: {
      type: String,
      default: '24'
    },
    fill: {
      type: String,
      default: 'black'
    }

  })
  const fillColor=computed(()=>{
    const backgroundColor= ref(getComputedStyle(document.documentElement).getPropertyValue('--color-background'))
    if(backgroundColor.value===''){
      return props.fill
    }
    return  backgroundColor.value
  })


</script>

<style scoped>

</style>