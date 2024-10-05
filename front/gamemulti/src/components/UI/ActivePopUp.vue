<template>
  <div  @mouseenter="startTimer" @mouseleave="cancelTimer" class="activePopUp">
    <slot></slot>
  </div>
</template>

<script setup lang="ts">
import { usePopup } from '@store/popUp';
const appli = usePopup()
const props=defineProps({
  message:{
    type:String,
    default:''
  }
})
  function startTimer(){
    appli.startPopUpTimer(props.message)
  }
  function cancelTimer(){
    appli.cancelPopUpTimer()
  }
</script>

<style scoped>
.activePopUp{
display:flex;
position:relative;
justify-content: center;
align-items: center;

}
</style>