<template>
  <div class="option-modal">
    <div>
      <p>Options</p>
    </div>
    <div class="option-chat-container">
      <input type="checkbox" id="server" name="server" v-model="optionsChat.server"/>
      <ActivePopUp :message="'active ou supprime les messages d\'état du serveur'">
        <label for="server">Afficher les messages serveur</label>
      </ActivePopUp>
    </div>
  </div>
</template>

<script setup lang="ts">
import ActivePopUp from '../UI/ActivePopUp.vue';
import type { OptionChat } from './ChatComponent.vue'
import { defineModel, nextTick, onBeforeUnmount } from 'vue'
const optionsChat=defineModel<OptionChat>() as unknown as OptionChat
const emit=defineEmits({
  close:null
})
nextTick(()=>{
  window.addEventListener('click', (e):void => {
    if (!(e.target as HTMLElement).closest('.option-modal') && !(e.target as HTMLElement).closest('.option-chat') ){
      emit('close')
    }
  })
})


onBeforeUnmount(() => {
  window.addEventListener('click', (e):void => {
    if (!(e.target as HTMLElement).closest('.optionModal') && !(e.target as HTMLElement).closest('.option-chat') ){
      emit('close')
    }
  })
})

</script>

<style scoped>
.option-modal{

  padding: 5px 20px;

  display: grid;
  grid-template:  50px auto/1fr;
  width: fit-content;
  height: fit-content;
  background-color: grey;
  box-shadow: 1px 1px 2px rgba(0, 0, 0, 0.521) inset;
  label{
    color: var(--normalTextColor);
    user-select: none;
  }
}
.option-chat-container{
  display: flex;
  gap: 10px;
}
.option-modal div:nth-child(1){
  grid-row: 1/span 1;
  grid-column: 1/span 1;
  align-self: center;
  justify-self: center;
}
</style>