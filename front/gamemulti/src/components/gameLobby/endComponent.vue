<template>
  <div class="end">
    <KeepAlive>
      <component :is="podium" class="podium" :height="200" ></component>
    </KeepAlive>
  </div>
</template>

<script setup lang="ts">
import podium from '@/components/gameLobby/endLobby/podiumComp.vue';


</script>

<style scoped>
.end{
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
}
.podium{
  width: 100%;
}
</style>