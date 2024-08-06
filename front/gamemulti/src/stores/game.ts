import { defineStore } from "pinia";
import { reactive, ref, type Ref } from "vue";
import type { GameStatus,InfoGameRoom  } from "@/models/room.model";
import { useSocketStore } from "./socket";
import type Player  from "@/models/player.model";
import { userStore } from "./user";
import type { listStatPlayer } from "@/models/player.model";

export const gameStore= defineStore('game', () => {
  const user = userStore()
  const status:Ref<GameStatus> = ref('waiting')
  const phaseGame=ref<'intro'|'presentation' | 'question' |'score'>('intro')
  const players=ref<Player[]>([])
  const socket=useSocketStore()
  const owner=ref<number>(0)
  const gameStat=reactive({
    players:[] as listStatPlayer[],
    initPlayers(players:Player[]){
      this.players=players.map(player=>({id:player.id,name:player.name,score:0,streak:0,bonus:[],response:{response:null,time:null}}))
    },
    sortedPlayerByScore(){
      console.log('sortedPlayerByScore',this.players)
      this.players=this.players.sort((a,b)=>b.score-a.score).map((player)=>player)
    }
  })
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
  const InfoCurrentQuestion=reactive({
    currentResponse: [] as number[],
    personnalResponse:null as number | null,
    userHaveRespond(){
      return this.currentResponse.includes(user.id)
    },
    refresh(){
      this.currentResponse=[]
      this.personnalResponse=null
    }

  })
  socket.socket?.on('infoGameRoom:room',(data:InfoGameRoom)=>{
    console.log('infoGameRoom:room',data)

    gameStat.players=data.game?.gameStats || []
    status.value=data.status
    players.value=data.players
    owner.value=data.owner
    gameQuestions.question=data.game?.question || ''
    gameQuestions.answers=data.game?.answers || []
    gameQuestions.difficulty=data.game?.difficulty || 0
    gameQuestions.category=data.game?.category || ''
    gameQuestions.nextEvent=data.game?.nextEvent || Date.now()
    phaseGame.value=data.game?.phaseGame || 'intro',
    InfoCurrentQuestion.currentResponse=data.game?.userResponse || []  
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
    InfoCurrentQuestion.refresh()
  })

  socket.socket?.on('score:game',(data:{
    playersStats:{
      id: number,
      name: string,
      score:number,
      streak: number,
      response:{
        response: number | null,
        time: number | null
      },
      bonus:{
        type:'faster' | 'correct' | 'incorrect' | 'streak',
        value:number
      }[]
    }[],
    correctAnswer:string     
  })=>{
    console.log('score:game',data)
    gameStat.players=data.playersStats
    gameStat.sortedPlayerByScore()
    phaseGame.value='score'
  })

  socket.socket?.on('update:response',(data:number[])=>{
    console.log('update:response',data)
   InfoCurrentQuestion.currentResponse=data
  })



  function getInfogame(){
    socket.socket?.emit('getInfoGame:room')
  }
  function sendResponse(response:number){
    if(InfoCurrentQuestion.userHaveRespond()) return
   
    InfoCurrentQuestion.personnalResponse=response
    socket.socket?.emit('response:game',{response:response===-1?null:response})
  }

  return {getInfogame,status,players,owner,waitLobbyProperties,gameQuestions,phaseGame,InfoCurrentQuestion,sendResponse,gameStat}
})
