<template>
  <svg :width="size" :height="size" :fill viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
    <path d="M6 2h10v2H6V2ZM4 6V4h2v2H4Zm0 12H2V6h2v12Zm2 2H4v-2h2v2Zm12 0H6v2h12v-2Zm2-2v2h-2v-2h2Zm0 0h2V8h-2v10ZM12 6H8v2H6v8h2v2h8v-2h2v-4h-2v4H8V8h4V6Zm2 8v-4h2V8h2V6h4V4h-2V2h-2v4h-2v2h-2v2h-4v4h4Z"></path>
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
      default: '#347456'
    }
  })
</script>

<style scoped>

</style>