import { defineStore } from "pinia";
import { reactive, ref, type Ref } from "vue";
import type { GameStatus,InfoGameRoom  } from "@/models/room.model";
import { useSocketStore } from "./socket";
import type Player from "@/models/player.model";


export const gameStore= defineStore('game', () => {
  const status:Ref<GameStatus> = ref('waiting')
  const phaseGame=ref<'intro'|'presentation' | 'question' |'score'>('intro')
  const players=ref<Player[]>([])
  const socket=useSocketStore()
  const owner=ref<number>(0)
  const gameQuestions=reactive({
    question: '' as string,
    answers: [] as {id:number,value:string}[],
    difficulty: 0 as number,
    category: '' as string,
    nextEvent: 0 as number
  })
  const waitLobbyProperties = reactive({
    lauchGame: false as boolean,
    countDown: 5 as number,
    startCount() {
      this.lauchGame = true
      socket.socket?.emit('startCount:timer')
    },
    canceCount(){
      this.lauchGame = false
      socket.socket?.emit('cancelCount:timer')
    },
    init() {
      this.lauchGame = false
    }
  })
  socket.socket?.on('infoGameRoom:room',(data:InfoGameRoom)=>{
    status.value=data.status
    players.value=data.players
    owner.value=data.owner
    gameQuestions.question=data.game?.question || ''
    gameQuestions.answers=data.game?.answers || []
    gameQuestions.difficulty=data.game?.difficulty || 0
    gameQuestions.category=data.game?.category || ''
    gameQuestions.nextEvent=data.game?.nextEvent || Date.now()
    phaseGame.value=data.game?.phaseGame || 'intro'
  })

  socket.socket?.on('startCount:timer',()=>{
    waitLobbyProperties.lauchGame=true 
  })
  socket.socket?.on('cancelCount:timer',()=>{
    waitLobbyProperties.lauchGame=false
  })
  socket.socket?.on('question:game',(data:{question:string,answers:{id:number,value:string}[],nextEvent:number} )=>{
    console.log('question:game',data)
    phaseGame.value='question'
    gameQuestions.question=data.question
    gameQuestions.answers=data.answers
    gameQuestions.nextEvent=data.nextEvent
  })
  socket.socket?.on('presentation:game',(data:{phaseGame:'intro'|'presentation' | 'question' |'score',category:string,difficulty:number} )=>{
    console.log('presentation:game',data)
    phaseGame.value=data.phaseGame
    gameQuestions.category=data.category
    gameQuestions.difficulty=data.difficulty
  })

  socket.socket?.on('score:game',(data:InfoGameRoom )=>{
    console.log('score:game',data)
    phaseGame.value='score'
  })
  function getInfogame(){
    socket.socket?.emit('getInfoGame:room')
  }

  return {getInfogame,status,players,owner,waitLobbyProperties,gameQuestions,phaseGame}
})
