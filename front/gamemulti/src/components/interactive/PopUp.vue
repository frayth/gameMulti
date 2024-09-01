<template>
  <div class="popup-info">
      <p>{{appli.popUp.message}}</p>
  </div>
</template>

<script setup lang="ts">
  import { computed } from 'vue';
  import {appliStore} from '../../stores/appli'
  const appli = appliStore()
  const mousePositionx=computed(()=>appli.mousePosition.x+'px')
  const mousePositiony=computed(()=>appli.mousePosition.y+'px')
</script>

<style scoped>
  .popup-info{
    border: 1px solid black;
    background-color: rgba(117, 117, 116, 0.767);
    text-align: center;
    padding: 2px;
    color:var(--normalTextColor);
    position: absolute;
    top: calc(v-bind(mousePositiony) + 12px);
    left:calc(v-bind(mousePositionx) + 12px );
    font-size: 10px;
    width: fit-content;
    z-index: 1000;
  }
</style>