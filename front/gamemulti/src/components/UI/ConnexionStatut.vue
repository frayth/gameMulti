<template>
  <div class="status-container" @mouseenter="startTimer" @mouseleave="cancelTimer">

  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { usePopup } from '@/stores/popUp';
const appli = usePopup()
 const props= defineProps({
    statusConnection:{
      type:Boolean,
      default:false
    
    },
    size:{
      type:Number,
      default:12
    }
  })
  function startTimer(){
    appli.startPopUpTimer(props.statusConnection?'En ligne':'Hors ligne')
  }
  function cancelTimer(){
    appli.cancelPopUpTimer()
  }
  const statusColor=computed(()=>{
    return props.statusConnection?'#4c9e4c':'grey'
  })
  const formatedSize=computed(()=>{
    return `${props.size}px`
  })
</script>

<style scoped>
  .status-container{
    display: flex;
    justify-content: center;
    position: relative;
    align-items: center;
    height:v-bind(formatedSize);
    width:v-bind(formatedSize);
    background-color: v-bind(statusColor);
    border-radius: 100%;
    box-shadow: 1px 1px 2px rgba(0, 0, 0, 0.521) inset;
  }
  .popup-statut{
    top: 0;
    left: 200px;

    background-color: white;
    color: black;
    padding: 10px;
    border-radius: 5px;
    box-shadow: 0 0 5px rgba(0, 0, 0, 0.521);
    width: 100px;
    height: 100px;
    z-index: 50;
  }
</style>