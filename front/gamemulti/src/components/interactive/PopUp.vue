<template>
  <div class="popup-info" ref="popUp">
      <p>{{appli.popUp.message}}</p>
  </div>
</template>

<script setup lang="ts">
  import { computed, useTemplateRef,nextTick } from 'vue';
  import {usePopup} from '../../stores/popUp'


  const appli = usePopup()
  const fontSize=computed(()=>appli.popUp.message.length>20?'12px':'14px')
 const test=useTemplateRef('popUp')
 nextTick(()=>{
   appli.popUp.html=test.value
 })
  const maxWidth=computed(()=>appli.popUpMaxWidth+'px')
  const mousePositionx=computed(()=>appli.mousePosition.x+'px')
  const mousePositiony=computed(()=>appli.mousePosition.y+'px')
</script>

<style scoped>
  .popup-info{
    border: 1px solid black;
    background-color: rgba(117, 117, 116, 0.767);

    text-align: center;
    padding: 5px;
    color:var(--normalTextColor);
    border-radius: 5px;
    position: absolute;
    top: calc(v-bind(mousePositiony) + 12px);
    left:calc(v-bind(mousePositionx) + 12px );
    font-size: v-bind(fontSize);
    width: v-bind(maxWidth);
    z-index: 1000;
    max-width:v-bind(maxWidth) ;
    animation: popIn 0.3s ease-in-out;
  }
  @keyframes popIn {
    0% {
      opacity: 0;
      top:calc(v-bind(mousePositiony) + 12px - 20px);
      left: calc(v-bind(mousePositionx) + 12px - 50px );
      transform: scale(0);
    }
    100% {
      transform: translateY(0);
      opacity: 1;
      transform: scale(1);
    }
  }
</style>