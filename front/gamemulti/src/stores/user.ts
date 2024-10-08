import { defineStore } from 'pinia'
import { reactive, ref, type Ref } from 'vue'
import { useSocketStore } from './socket'
import { useRouter } from 'vue-router'
import { usePopup } from './popUp'
import useFecth from '@/modules/fetch'
interface User {
  id: number
  name: string
  connected: boolean
}

export const userStore = defineStore('user', () => {
  const socketStore = useSocketStore()
  const popupStore = usePopup()
  const router = useRouter()
  const isConnect = ref(false)
  const username = ref('')
  const id = ref(0)
  const token = ref('notToken')
  const room = reactive({
    name: '',
    id: 0,
    userList: ref<User[]>([])
  })
  async function setToken(newToken: string): Promise<void> {
    token.value = newToken
    localStorage.setItem('token', newToken)
  }
  async function login(speudo: string, userToken: string) {
    const data = await useFecth('/user/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: userToken
      },
      body: JSON.stringify({ username: speudo })
    })

    isConnect.value = data.response
    if (data.response) {
      username.value = speudo
      localStorage.setItem('username', speudo)
      socketStore.firstconnect(userToken)
      return true
    } else {
      return false
    }
  }
  function init() {
    const localToken = localStorage.getItem('token')
    const localUsername = localStorage.getItem('username')
    if (localToken && localUsername) {
      isConnect.value = true
      username.value = localUsername
      token.value = localToken
      socketStore.firstConnectDone = true
      socketStore.firstconnect(localToken)
    }
  }

  function setID(newId: number) {
    id.value = newId
  }

  function logout() {
    isConnect.value = false
    username.value = ''
    token.value = 'notToken'
    socketStore.firstConnectDone = false
    socketStore.disconnect()
    localStorage.removeItem('token')
    localStorage.removeItem('username')
    router.push('/login')
    popupStore.cancelPopUpTimer()
  }

  function setRoom(newRoom: { id: number; name: string }): void {
    console.log('setRoom', newRoom)
    room.id = newRoom.id
    room.name = newRoom.name
    if (room.name === 'waitingRoom' || room.name === '') {
      router.push({ name: 'waitingRoom' })
    } else {
      router.push({ name: 'room', params: { room: newRoom.name } })
    }
  }
  return { isConnect, username, login, logout, token, setToken, init, room, setRoom, id, setID }
})

interface Message {
  user: string
  message: string
}

export const RoomStore = defineStore('room', () => {
  const socket = useSocketStore()
  const messages: Ref<Message[]> = ref([])

  socket.socket?.on(
    'info:room',
    (data: {
      info: { status: 'connect' | 'disconnect'; name: string }
      users: { id: number; name: string; connected: boolean }[]
    }) => {
      messages.value.push({
        user: 'Serveur',
        message: `${data.info?.name} s'est ${data.info?.status === 'connect' ? 'connecté(e)' : 'déconnecté(e)'}`
      })
    }
  )
  socket.socket?.on('message:room', (data: { user: string; message: string }) => {
    data.message = JSON.parse(data.message)
    if (data.user === messages.value[messages.value.length - 1]?.user) {
      messages.value[messages.value.length - 1].message += `\n${data.message}`
    } else {
      messages.value.push(data)
    }
  })
  return { messages }
})
