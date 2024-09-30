import { defineStore } from 'pinia'
import { ref, type Ref } from 'vue'
import type { GameStatus, InfoGameRoom } from '@/models/room.model'
import { useSocketStore } from './socket'
import type Player from '@/models/player.model'
import { userStore } from './user'
import type { listStatPlayer } from '@/models/player.model'
import useFecth from '@/modules/fetch'
import shuffle from '@/modules/shuffle'

export const gameStore = defineStore('game', () => {
  const user = userStore()
  const status: Ref<GameStatus> = ref('waiting')
  const phaseGame = ref<'intro' | 'presentation' | 'question' | 'score' | 'end'>('intro')
  const players = ref<Player[]>([])
  const socket = useSocketStore()
  const owner = ref<number>(0)
  const playersHasSkipRule = ref<number[]>([])
  const gameHistory = ref({
    value: [],
    async getHistory() {
      const data = await useFecth(`/user/history?room=${user.room.id}`, {
        method: 'GET' 
      })
      this.value = data.response
    }
  })
  const gameStat = ref({
    players: [] as listStatPlayer[],
    initPlayers(players: Player[]): void {
      this.players = players.map((player) => ({
        rank: null,
        oldScore: 0,
        id: player.id,
        name: player.name,
        score: 0,
        streak: 0,
        bonus: [],
        response: { response: null, time: null }
      }))
    },
    sortedPlayerByScore(): void {
      this.players = this.players.sort((a, b) => b.score - a.score).map((player) => player)
    },
    affectRankForPlayer(): void {
      let rank = 1
      this.sortedPlayerByScore()
      this.players.forEach((player) => {
        const otherPlayerWithSameScore = this.players
          .filter((el) => el.id !== player.id)
          .filter((el) => el.score === player.score)
        player.rank = rank
        if (otherPlayerWithSameScore.length === 0) rank++
      })
    }
  })

  const gameQuestions = ref({
    question: '' as string,
    answers: [] as { id: number; value: string }[],
    difficulty: 0 as number,
    category: '' as string,
    nextEvent: 0 as number,
    correctAnswer: '' as string
  })
  const waitLobbyProperties = ref({
    lauchGame: false as boolean,
    countDown: 5 as number,
    startCount() {
      this.lauchGame = true
      socket.socket?.emit('startCount:timer')
    },
    canceCount() {
      this.lauchGame = false
      socket.socket?.emit('cancelCount:timer')
    },
    init() {
      this.lauchGame = false
    }
  })
  const InfoCurrentQuestion = ref({
    currentResponse: [] as number[],
    personnalResponse: null as number | null,
    userHaveRespond() {
      return this.currentResponse.includes(user.id)
    },
    refresh() {
      this.currentResponse = []
      this.personnalResponse = null
    }
  })

  function setInfoRoom (data: InfoGameRoom){
    setTimeout(() => {
      console.log(data)
      status.value = data.status
    }, 10)
    phaseGame.value = data.game?.phaseGame || 'intro'
    gameStat.value.players = data.game?.gameStats || []
    playersHasSkipRule.value = data.game?.skipRule || []
    players.value = data.players
    owner.value = data.owner
    gameQuestions.value.question = data.game?.question || ''
    gameQuestions.value.answers = data.game?.answers || []
    gameQuestions.value.difficulty = data.game?.difficulty || 0
    gameQuestions.value.category = data.game?.category || '',
    gameQuestions.value.nextEvent = data.game?.nextEvent || 0
    InfoCurrentQuestion.value.currentResponse = data.game?.userResponse || []
    gameStat.value.affectRankForPlayer()
  }
  function setQuestion(data: { question: string; answers: { id: number; value: string }[]; nextEvent: number }){
    phaseGame.value = 'question'
    gameQuestions.value.question = data.question
    gameQuestions.value.answers = shuffle(data.answers)
    gameQuestions.value.nextEvent = data.nextEvent
  }
  function setPresentation(data: {
    phaseGame: 'intro' | 'presentation' | 'question' | 'score'
    category: string
    difficulty: number
  }){
    phaseGame.value = data.phaseGame
    gameQuestions.value.category = data.category
    gameQuestions.value.difficulty = data.difficulty
    InfoCurrentQuestion.value.refresh()
  }
  function setScore(data: {
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
  }){
    gameQuestions.value.correctAnswer = data.correctAnswer
    gameStat.value.players = data.playersStats
    gameStat.value.sortedPlayerByScore()
    phaseGame.value = 'score'
  }
  function updateResponse(data: number[]){
    InfoCurrentQuestion.value.currentResponse = data
  }
  function lauchGame(status: boolean) {
    waitLobbyProperties.value.lauchGame = status
  }
  function resetGame() {
    status.value = 'waiting'
    gameQuestions.value.question = ''
    gameQuestions.value.answers = []
    gameQuestions.value.difficulty = 0
    gameQuestions.value.category = ''
    gameQuestions.value.nextEvent = 0
    gameQuestions.value.correctAnswer = ''
    phaseGame.value = 'intro'
    InfoCurrentQuestion.value.refresh()
    waitLobbyProperties.value.init()
  }
  // socket.socket?.on('startCount:timer', () => {
  //   waitLobbyProperties.value.lauchGame = true
  // })
  // socket.socket?.on('cancelCount:timer', () => {
  //   waitLobbyProperties.value.lauchGame = false
  // })
  // socket.socket?.on(
  //   'question:game',
  //   (data: { question: string; answers: { id: number; value: string }[]; nextEvent: number }) => {
  //     console.log('question:game', data)
  //     phaseGame.value = 'question'
  //     gameQuestions.value.question = data.question
  //     gameQuestions.value.answers = shuffle(data.answers)
  //     gameQuestions.value.nextEvent = data.nextEvent
  //   }
  // )
  // socket.socket?.on(
  //   'presentation:game',
  //   (data: {
  //     phaseGame: 'intro' | 'presentation' | 'question' | 'score'
  //     category: string
  //     difficulty: number
  //   }) => {
  //     console.log('presentation:game', data)
  //     phaseGame.value = data.phaseGame
  //     gameQuestions.value.category = data.category
  //     gameQuestions.value.difficulty = data.difficulty
  //     InfoCurrentQuestion.value.refresh()
  //   }
  // )
  // socket.socket?.on('end:game', () => {
  //   console.log('end:game')
  //   phaseGame.value = 'end'
  //   gameStat.value.affectRankForPlayer()
  // })

  // socket.socket?.on(
  //   'score:game',
  //   (data: {
  //     playersStats: {
  //       rank: null | number
  //       id: number
  //       name: string
  //       score: number
  //       streak: number
  //       oldScore: number
  //       response: {
  //         response: number | null
  //         time: number | null
  //       }
  //       bonus: {
  //         type: 'faster' | 'correct' | 'incorrect' | 'streak'
  //         value: number
  //       }[]
  //     }[]
  //     correctAnswer: string
  //   }) => {
  //     console.log('score:game', data)
  //     gameQuestions.value.correctAnswer = data.correctAnswer
  //     gameStat.value.players = data.playersStats
  //     gameStat.value.sortedPlayerByScore()
  //     phaseGame.value = 'score'
  //   }
  // )

  // socket.socket?.on('update:response', (data: number[]) => {
  //   console.log('update:response', data)
  //   InfoCurrentQuestion.value.currentResponse = data
  // })
  function skipRegle() {
    socket.socket?.emit('skipRegle:game')
  }
  function getInfogame() {
    socket.socket?.emit('getInfoGame:room')
  }
  function sendResponse(response: number) {
    if (InfoCurrentQuestion.value.userHaveRespond()) return

    InfoCurrentQuestion.value.personnalResponse = response
    socket.socket?.emit('response:game', { response: response === -1 ? null : response })
  }

  return {
    getInfogame,
    status,
    players,
    owner,
    waitLobbyProperties,
    gameQuestions,
    phaseGame,
    InfoCurrentQuestion,
    sendResponse,
    gameStat,
    skipRegle,
    playersHasSkipRule,
    gameHistory,
    setInfoRoom,
    resetGame,
    setQuestion,
    setPresentation,
    setScore,
    updateResponse,
    lauchGame
  }
})
