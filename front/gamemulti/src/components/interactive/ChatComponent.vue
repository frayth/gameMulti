<template>
  <div class="chat">
    <optionModal
      ref="optionChat"
      v-if="optionPanelIsOpen"
      v-model="optionsChat"
      @close="optionPanelIsOpen = false"
      id="optionModal"
    ></optionModal>
    <div class="main-panel" ref="chatPanel">
      <div v-for="(message, i) in messagesToShow" :key="`message${i}`" class="message">
        <div
          :style="{ textTransform: 'capitalize' }"
          :class="`${message.user === user ? 'ownerMessage' : message.user === 'Serveur' ? 'adminMessage' : 'otherMessage'}`"
        >
          <p>{{ message.user }}:</p>
        </div>
        <div
          :style="{ textAlign: 'justify' }"
          :class="message.user === 'Serveur' ? 'adminText' : ''"
        >
         <p :style="{whiteSpace:'pre-line'}"> {{ message.message }}</p>
        </div>
      </div>
    </div>
    <div class="main-user-panel">
      <div class="title-user-panel">
        <p>Utilisateurs en ligne</p>
      </div>
      <div class="list-user">
        <div
          v-for="(currentUser, i) in users"
          :key="`user${i}`"
          :class="`${currentUser.name === user ? 'ownerMessage' : ''} user-div`"
        >
          <statut :status-connection="currentUser.connected"></statut>
          <p>{{ currentUser.name }}</p>
        </div>
      </div>
    </div>
    <div class="main-input-panel">
      <input
        type="text"
        @focusin="emit('focusInput')"
        v-model="currentMessage"
        @keyup.enter="sendMessage"
        placeholder="type your message here..."
      />
      <ActivePopUp :message="'Chat options'">
        <gear
        class="option-chat"
        @click.prevent="optionPanelIsOpen = !optionPanelIsOpen"
      ></gear>
      </ActivePopUp>
      <button @click="sendMessage" :class="`${!sendIsPossible ? 'disabled' : ''}`">Send</button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, nextTick, computed, watch} from 'vue'
import {RoomStore} from '@/stores/user'
import { useSocketStore } from '../../stores/socket'
import statut from '../UI/ConnexionStatut.vue'
import gear from '../../assets/SVG/GearSvg.vue'
import ActivePopUp from '../UI/ActivePopUp.vue'
import optionModal from '../interactive/OptionChat.vue'
import {userStore} from '@/stores/user'
const roomStore=RoomStore()
const currentUser=userStore()
export interface OptionChat {
  server: boolean
}
defineProps({
  user: {
    type: String,
    required: true
  }
})
const emit = defineEmits(['focusInput', 'focusOutInput'])
const socket = useSocketStore()
const chatPanel = ref<HTMLElement | null>(null)
const users=computed(()=>{
  const test=[...currentUser.room.userList]
  return test.sort((a, b) => a.name.localeCompare(b.name))
})
const currentMessage = ref('')

const messagesToShow = computed(() => {
  if (!optionsChat.value.server) return roomStore.messages.filter((message) => message.user !== 'Serveur')
  return roomStore.messages
})
const sendIsPossible = computed(() => currentMessage.value.length > 0)

const optionPanelIsOpen = ref(false)

const optionsChat = ref({
  server: true
})
watch(messagesToShow,()=>{
  scrollDown()
},
{
  deep:true
}
)


function scrollDown() {
  nextTick(() => {
    chatPanel.value?.scrollTo(0, chatPanel.value.scrollHeight)
  })
}
function emitScroll() {
  emit('focusOutInput')
}
function sendMessage() {
  if (currentMessage.value.length === 0) return
  socket.emit('message:user', currentMessage.value)
  currentMessage.value = ''
  emitScroll()
}

</script>

<style scoped>
#optionModal {
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  z-index: 10;
}
.user-div {
  display: flex;
  align-items: center;
  gap: 5px;
}
.title-user-panel {
  text-align: center;
  margin: 10px;
}
.chat {
  display: grid;
  grid-template: auto 40px/ 1fr auto;
  min-width: 500px;
  height: 700px;
  position: relative;
  width: 100%;
  font-size:12px;
  border-radius: 10px;

}

.option-chat {
  cursor: pointer;
  background-color: transparent;
}
.message::after {
  content: '';
  display: block;
  position: absolute;
  left: 0%;
  transform: translateX(-50%);
  width: 20%;
  height: 1px;
  background-color: rgba(0, 0, 0, 0.315);
}
.ownerMessage {
  color: rgb(56, 56, 241);
}
.otherMessage {
  color: grey;
}
.main-panel {
  background-color: var(--backgroundWhite);
  position: relative;
  color: black;
  height: 100%;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  padding: 10px;
  border-radius: 10px 0 0 0;
  gap: 10px;
  box-shadow: 0px -2px 1px rgba(0, 0, 0, 0.3) inset;
}
.main-user-panel {
  padding: 0 10px;
  width: auto;
  overflow-y: auto;
  background-color: var(--backgroundWhite);
  color: black;
  display: flex;
  flex-direction: column;
  box-shadow: 0 0 4px rgba(0, 0, 0, 0.521) inset;
  justify-content: flex-start;
  grid-row: 1 / span 2;
  grid-column: 2 / span 1;
}
.main-input-panel {
  width: 100%;
  height: 100%;
  display: flex;
  background-color: var(--backgroundWhite);
  justify-content: center;
  align-items: center;
  min-height: 40px;
  gap: 5px;
}
.main-input-panel input {
  width: 100%;
  outline: none;
  height: 100%;
  background-color: var(--backgroundWhite);
  border: none;
  padding: 0 5px;
}
.main-input-panel button {
  width: 100px;
  cursor: pointer;
  background-color: blue;
  color: var(--normalTextColor);
  border: none;
  outline: none;
  height: 100%;
}
.list-user {
  display: flex;
  flex-direction: column;
  gap: 5px;
}
.disabled {
  background-color: grey !important;
  cursor: not-allowed !important;
}
.adminMessage {
  display: none;
}
.adminText {
  color: rgba(32, 32, 32, 0.322);
  font-style: italic;
  text-align: center !important;
}
@media (max-width: 800px){
  .chat{
    grid-template:auto 40px auto /auto;
    height:100%;
    min-width: 350px;
  }
  .main-user-panel{
    grid-row: 3 / span 1;
    grid-column: 1 / span 1;
  }
  #optionModal {
    position: absolute;
    left: 50%;
    top: 5%;
    transform: translateX(-50%);
    z-index: 10;
  }
  .main-panel {
    height: calc(100vh - 100px);
  }
}
</style>
