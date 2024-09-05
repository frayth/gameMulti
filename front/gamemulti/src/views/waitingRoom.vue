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
@media (prefers-color-scheme: dark) {
  .creation-container button{
    background-color: var(--backgroundWhite);
    border-bottom: 4px solid var(--main-green);
  }
  .creation-container button:hover{
    background-color: var(--main-green);
    color: white;
    border-bottom: 4px solid var(--backgroundWhite);
  }
}
.creation-container{
  width: 100%;
  display: flex;
  justify-content: center;
 
}

.creation-container button{
  margin: 20px 0 ;
  width: 200px;
  height: 50px;
  background-color: var(--main-green);
  border: none;
  border-radius: 10px;
  font-size: 20px;
  cursor: pointer;
  border-bottom: 4px solid black;
  transition: 0.3s;
}
.creation-container button:hover{
  background-color: white;
  box-shadow: 0 0 5px rgba(0, 0, 0, 0.521);
  border-bottom: 4px solid black;
  color: black;
}
</style>