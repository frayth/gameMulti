import { defineStore } from 'pinia'
import { ref, watch, type Ref } from 'vue'
//const URL = 'http://109.24.163.36:5003' //http://109.24.163.36:5003 https://quizz.api.laurisceresoli.fr
const URL = 'https://quizz.api.laurisceresoli.fr'
import { Socket, io } from 'socket.io-client'
import type { DefaultEventsMap } from 'node_modules/socket.io/dist/typed-events'
import { gameStore } from './game'
import type Room from '@/models/room.model'
import { userStore } from './user'
import { listRooms } from './Rooms'
import type { InfoGameRoom } from '@/models/room.model'
import router from '@/router'
export const useSocketStore = defineStore('socket', () => {
  const connected = ref(false)
  const firstConnectDone = ref(false)
  const user = userStore()
  const game = gameStore()
  const rooms = listRooms()
  const socket: Ref<Socket<DefaultEventsMap, DefaultEventsMap> | null> = ref(null)
  watch(firstConnectDone, (newValue) => {
    if (newValue) {
      //console.log('connect')
      socket.value?.disconnect()
      connect()
      router.push({ name: 'waitingRoom' })
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
        // console.log('token', token)
        user.setToken(token)
        // console.log('token user after save', user.token)
        firstConnectDone.value = true
      })

      socket.value?.on('error', (error: { message: string }): void => {
        console.error(error.message)
        user.logout()
      })
      // socket.value?.on('newPlayer', (data) => console.log('bonjour', data))
      socket.value?.on('disconnect', (reason): void => {
        if (!(reason === 'ping timeout') && !(reason === 'io client disconnect')) {
          user.logout()
        }
        connected.value = false
        //console.log(`disconnected:${reason}`)
      })
    })
  }
  async function connect() {
    //console.log('connect2', user.token)
    socket.value = io(URL, {
      auth: {
        token: user.token
      }
    })
    socket.value.on('connect', () => {
      //console.log('connect io ')
      connected.value = true
      socket.value?.emit('create:user', { username: user.username })
      socket.value?.on(
        'info:user',
        (data: { id: number; name: string; room: { id: number; name: string } }): void => {
          user.setRoom(data.room)
          user.setID(data.id)
        }
      )
      socket.value?.on(
        'list:user',
        (userList: { id: number; name: string; connected: boolean }[]) => {
          //console.log('list user', userList)
          user.room.userList = userList
        }
      )

      socket.value?.on('list:room', (roomList: Room[]) => {
        rooms.setListRooms(roomList)
      })

      socket.value?.on('error', (error: { message: string }): void => {
        //console.error(error.message)
        user.logout()
        socket.value?.disconnect()
      })

      socket.value?.on('infoGameRoom:room', (data: InfoGameRoom) => {
        game.setInfoRoom(data)
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
          user.room.userList = data.users
        }
      )
      socket.value?.on(
        'question:game',
        (data: {
          question: string
          answers: { id: number; value: string }[]
          nextEvent: number
        }) => {
          //console.log('question:game', data)
          game.setQuestion(data)
        }
      )
      socket.value?.on(
        'presentation:game',
        (data: {
          phaseGame: 'intro' | 'presentation' | 'question' | 'score'
          category: string
          difficulty: number
        }) => {
          //console.log('presentation:game', data)
          game.setPresentation(data)
        }
      )
      socket.value?.on(
        'score:game',
        (data: {
          playersStats: {
            rank: null | number
            id: number
            name: string
            score: number
            streak: number
            oldScore: number
            response: {
              response: number | null
              time: number | null
            }
            bonus: {
              type: 'faster' | 'correct' | 'incorrect' | 'streak'
              value: number
            }[]
          }[]
          correctAnswer: string
        }) => {
         // console.log('score:game', data)
          game.setScore(data)
        }
      )
      socket.value?.on('cancelCount:timer', () => {
        game.lauchGame(false)
      })
      socket.value?.on('startCount:timer', () => {
        game.lauchGame(true)
      })
      socket.value?.on('update:response', (data: number[]) => {
        //console.log('update:response', data)
        game.updateResponse(data)
      })
      socket.value?.on('disconnect', (reason): void => {
        if (!(reason === 'ping timeout') && !(reason === 'io client disconnect')) {
          //console.log('disconnect', reason)
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
    socket.value?.emit(event, JSON.stringify(args))
  }
  return { firstconnect, disconnect, emit, connected, connect, firstConnectDone, socket }
})
