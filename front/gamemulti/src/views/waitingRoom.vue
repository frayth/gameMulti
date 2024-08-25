<template>
  <div>
    <div ref="chatRef" class="test">
      <chat   :user="user.username" @focus-input="handleCenterChat" @focus-out-input="handleChatScrollTop"></chat>
    </div>
    <listRooms></listRooms>
    <div class="creation-container">
      <button @click="joinRoom">Créé une partie</button>
    </div>
  </div>
</template>

<script setup lang="ts">
import chat from '../components/interactive/ChatComponent.vue'
import { ref,onMounted } from 'vue'
import { userStore } from '@/stores/user';
import listRooms from '../components/interactive/ListRoom.vue';
import { useSocketStore } from '@/stores/socket';
const user = userStore()
const socket = useSocketStore()
const chatRef=ref<HTMLElement|null>(null)


onMounted(()=>{
  handleCenterChat()
})
function handleCenterChat(){
  window.scrollTo(0, chatRef.value?.offsetTop as number)
}
function joinRoom(){
  socket.socket?.emit('create:room')
}
function handleChatScrollTop(){
  if(chatRef.value){
    chatRef.value.scrollIntoView(true)
  }
}
</script>

<style scoped>
.creation-container{
  width: 100%;
  display: flex;
  justify-content: center;
}
.creation-container button{
  width: 200px;
  height: 50px;
  background-color: #f1f1f1;
  border: none;
  border-radius: 10px;
  font-size: 20px;
  cursor: pointer;
}
</style>