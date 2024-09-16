import { defineStore } from 'pinia'
import { ref, watch, type Ref } from 'vue'
const URL = 'quizz.api.laurisceresoli.fr' //http://109.24.163.36:5003
import { Socket, io } from 'socket.io-client'
import type { DefaultEventsMap } from 'node_modules/socket.io/dist/typed-events'
import type Room from '@/models/room.model'
import { userStore } from './user'
import { listRooms } from './Rooms'
import router from '@/router'
export const useSocketStore = defineStore('socket', () => {
  const connected = ref(false)
  const firstConnectDone = ref(false)
  const user = userStore()
  const rooms = listRooms()
  const socket: Ref<Socket<DefaultEventsMap, DefaultEventsMap> | null> = ref(null)
  watch(firstConnectDone, (newValue) => {
    if (newValue) {
      console.log('connect')
      socket.value?.disconnect()
      connect()
      router.push('/')
    }
  })

  async function firstconnect(token: string) {
    socket.value = io(URL, {
      auth: {
        token: token
      }
    })

    socket.value.on('connect', () => {
      connected.value = true
      socket.value?.on('token', (token): void => {
        console.log('token', token)
        user.setToken(token)
        console.log('token user after save', user.token)
        firstConnectDone.value = true
      })

      socket.value?.on('error', (error: { message: string }): void => {
        console.error(error.message)
        user.logout()
      })
      socket.value?.on('newPlayer', (data) => console.log('bonjour', data))
      socket.value?.on('disconnect', (reason): void => {
        if (!(reason === 'ping timeout') && !(reason === 'io client disconnect')) {
          user.logout()
        }
        connected.value = false
        console.log(`disconnected:${reason}`)
      })
    })
  }
  async function connect() {
    console.log('connect2', user.token)
    socket.value = io(URL, {
      auth: {
        token: user.token
      }
    })
    socket.value.on('connect', () => {
      console.log('connect io ')
      connected.value = true
      socket.value?.emit('create:user', { username: user.username })
      socket.value?.on(
        'info:user',
        (data: { id: number; name: string; room: { id: number; name: string } }): void => {
          console.log('info user', data)
          user.setRoom(data.room)
          user.setID(data.id)
        }
      )
      socket.value?.on(
        'list:user',
        (userList: { id: number; name: string; connected: boolean }[]) => {
          console.log('list user', userList)
        }
      )

      socket.value?.on('list:room', (roomList: Room[]) => {
        rooms.setListRooms(roomList)
      })

      socket.value?.on('error', (error: { message: string }): void => {
        console.error(error.message)
        console.log('logout')
        user.logout()
        socket.value?.disconnect()
      })

      socket.value?.on(
        'info:room',
        (data: {
          info: {
            status: 'connect' | 'disconnect'
            name: string
            type: 'waitingRoom' | 'gameRoom'
            gameStatus?: 'waiting' | 'playing' | 'end'
          }
          users: { id: number; name: string; connected: boolean }[]
        }) => {
          console.log('info room', data)
          user.room.userList = data.users
        }
      )

      socket.value?.on('disconnect', (reason): void => {
        if (!(reason === 'ping timeout') && !(reason === 'io client disconnect')) {
          console.log('disconnect', reason)
          user.logout()
        }
        connected.value = false
        console.error(`disconnected:${reason}`)
      })
    })
  }

  function disconnect() {
    socket.value?.emit('logout:user')
    socket.value?.disconnect()
    connected.value = false
  }

  function emit(event: string, args: Object) {
    console.log('emit')
    socket.value?.emit(event, JSON.stringify(args))
  }
  return { firstconnect, disconnect, emit, connected, connect, firstConnectDone, socket }
})
