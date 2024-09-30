import Player from "./player";
import questions from "../assets/question.json";
import type { QuestionModel,historyModel } from "../models/game.model";
import bonus from "../assets/bonus.json";
import prand from 'pure-rand';
import { GameRoom } from "./GameRoom";
import options from "../assets/options"
const offsetResponseTime = 2000;
export default class Game {
  parent:GameRoom;
  players: GamePlayer[];
  question: Question;
  history:historyModel[];
  skippedRulePlayers: Player[];
  event: NodeJS.Timeout | null;
  askedQuestion: number[];
  nextEvent: number;
  questionAskedAt: number|null;
  phaseGame: "intro" | "presentation" | "question" | "score" | 'end';
  optionsGame:{
    maxPoint:number
  }
  constructor(players: Player[],gameRoom:GameRoom) {
    this.parent=gameRoom;
    this.players = players.map((el) => new GamePlayer(el));
    this.question = new Question();
    this.event = null;
    this.skippedRulePlayers = [];
    this.nextEvent = Date.now();
    this.askedQuestion = [];
    this.phaseGame = "intro";
    this.questionAskedAt=null;
    this.history=[];
    this.optionsGame={
      maxPoint:bonus.defautScore
    }
  }

  clearEvent() {
    if (this.event) clearTimeout(this.event);
  }

  private async changePhaseGame(){
    switch (this.phaseGame) {
      case "intro":
      case "score":
        this.phaseGame = "presentation";
        await this.getQuestion();
        this.createEvent(() => {
            this.changePhaseGame();
        }, 5000);

        if(this.haveAWinner()){
          this.endGame();
        }else{
          this.sendPresentation();
        }
        
        break;
      case "presentation":
        this.phaseGame = "question";
        this.refreshPlayers();
        this.askQuestion();
        break;
      case "question":
        this.createEvent(() => {
          this.changePhaseGame();
        }, 5000);
        this.phaseGame = "score";
        this.calculateScore();
        break;
    }
  }

   async LauchIntro() {
    return new Promise((resolve) => {
      console.log("LauchIntro",options.timeForRule);
      this.createEvent(() => {
        this.changePhaseGame();
      }, options.timeForRule);
      resolve(null);
    });
  }
  private sendScore() {
    console.log(
      "sendScore",
      this.players.map((el) => el.player.score)
    );
    this.players.forEach((el) => {
      el.player.socket?.emit("score:game", {
        playersStats: this.players.map((el) => el.getStats()),
        correctAnswer: this.question.question.descriptionResponse,
      });
    });
  }
  private sendPresentation() {
    this.players.forEach((el) => {
      el.player.socket?.emit("presentation:game", {
        phaseGame: "presentation",
        category: this.question.question.category,
        difficulty: this.question.question.difficulty,
      });
    });
  }
  private refreshPlayers() {
    this.players.forEach((el) => {
      el.player.response = {
        response: null,
        time: null,
      };
    });
  }
  private saveHistory(){
    this.history.push({
      id:this.question.question.id,
      historyUser:this.players.map((el)=>({
        id:el.player.id!,
        bonus:el.player.bonus,
        response:el.player.response.response,
        timer:el.player.response.time?this.questionAskedAt!-el.player.response.time:null
      }))
    })
    console.log('history',this.history.map((el)=>el.historyUser))
  }
  private async calculateScore() {
    
    await new Promise((resolve) => {
      const playeSortedByResponseTime = this.players
        .filter((el) => el.player.response.time !== null)
        .sort((a, b) => a.player.response.time! - b.player.response.time!);
      console.log("playeSortedByResponseTime", playeSortedByResponseTime);
      this.players.forEach((el) => {
        el.refreshBonus();
        el.player.oldScore = el.player.score;
      });
      this.players.forEach((el) => {
        if (el.player.response.response === this.question.question.response) {
          
          if (playeSortedByResponseTime[0].player.id === el.player.id) {
            console.log("fasterResponse", el.player.name);
            el.addBonus("faster", bonus.fasterResponse);
          }
          el.addBonus("correct", bonus.goodResponse);
          el.addBonus("streak", Math.floor(el.player.streak / 3));
        } else if (el.player.response.response !== null) {
          el.addBonus("incorrect", bonus.badResponse);
        }else{
          el.addBonus("incorrect", bonus.noResponse);
        }
      });
      this.saveHistory();
      resolve(null);
    });
    this.sendScore();   
  }
  private sendUpdateResponse() {
    let data = this.players
      .filter((el) => el.player.response.time !== null)
      .map((el) => {
        return el.player.id;
      });
    this.players.forEach((el) => {
      el.player.socket?.emit("update:response", data);
    });
  }
  private askQuestion() {
    this.createEvent(async () => {
      this.changePhaseGame();
    }, 15000);

    this.players.forEach((el) => {
      el.player.socket?.emit("question:game", this.getInfoGame());
    });
    this.questionAskedAt=Date.now();
  }
  private endGame(){
    this.phaseGame='end';
    this.parent.changeStatus('end')
    this.clearEvent();
    this.players.forEach((el) => {
      el.player.socket?.emit("end:game", {
        score:this.players.map((el) => el.getStats())
      });
    });
  }
  skipRegle(player: Player) {
    if (this.phaseGame === "intro") {
      const playerHasAlreadySkipped = this.skippedRulePlayers.find( (el) => el.id === player.id);
      if (!playerHasAlreadySkipped) {
        this.skippedRulePlayers.push(player);

        if (this.skippedRulePlayers.length === this.players.length) {
          this.clearEvent();
          this.changePhaseGame();
        }
        this.parent.sendInfoGame();
      }
    }
  }
  savePlayerResponse(player: Player, response: { response: number | null }) {
    if (!this.canResponse(player)) return;
    console.log("ok pour sauvegarder");
    const user = this.players.find((el) => el.player.id === player.id);
    if (user) {
      user.player.response = { response: response.response, time: Date.now() };
      this.sendUpdateResponse();
      if(this.players.find((el)=>!el.hasResponded())===undefined){
        const nexteventinMillisecond = this.nextEvent - Date.now();
        this.createEvent(()=>{
          this.clearEvent();
          this.changePhaseGame();
        },nexteventinMillisecond<=2000?nexteventinMillisecond:2000)
      }
    }
  }
  private canResponse(player: Player) {
    const user = this.players.find((el) => el.player.id === player.id);
    if (user) {
      return (
        user.player.response.response === null &&
        user.player.response.time === null
      );
    }
    return false;
  }

  private async getQuestion() {
    if (!this.askedQuestion.includes(this.question.question.id))
      this.askedQuestion.push(this.question.question.id);
    if (this.askedQuestion.length === questions.length) this.askedQuestion = [];
    const instance = this;
    return new Promise((resolve, reject) => {
      instance.question = new Question(null, null, instance.askedQuestion);
      resolve(instance.question);
    });
  }
  changeSockectPlayer(player: Player) {
    const user = this.players.find((el) => el.player.id === player.id);
    if (user) {
      user.player.socket = player.socket;
    }
  }
  private haveAWinner() {
    return this.players.find((el) => el.player.score >= this.optionsGame.maxPoint);
  }
  getInfoGame() {
    return {
      skipRule: this.skippedRulePlayers.map((el) => el.id),
      question: this.question.question.question,
      answers: this.question.question.answers,
      difficulty: this.question.question.difficulty,
      category: this.question.question.category,
      nextEvent: this.nextEvent - offsetResponseTime,
      phaseGame: this.phaseGame,
      gameStats: this.players.map((el) => el.getStats()),
      userResponse: this.players
        .filter((el) => el.player.response.time !== null)
        .map((el) => {
          return el.player.id;
        }),
    };
  }

  createEvent(callback: () => void, time: number) {
    this.clearEvent();
    console.log("createEvent", time,Date.now(),time+Date.now(),new Date());
    this.nextEvent = Date.now() + time;
    this.event = setTimeout(callback, time);
  }
}

class GamePlayer {
  player: Partial<Player> & {
    response: {
      response: number | null;
      time: number | null;
    };
    score: number;
    streak: number;
    oldScore: number;
    bonus: {
      type: "faster" | "correct" | "incorrect" | "streak";
      value: number;
    }[];
  };

  constructor(player: Player) {
    this.player = {
      socket: player.socket,
      id: player.id,
      name: player.name,
      score: 0,
      streak: 0,
      bonus: [],
      oldScore: 0,
      response: {
        response: null,
        time: null,
      },
    };
  }
  getStats() {
    return {
      id: this.player.id,
      name: this.player.name,
      score: this.player.score,
      streak: this.player.streak,
      response: this.player.response,
      bonus: this.player.bonus,
      oldScore: this.player.oldScore,
    };
  }

  addBonus(type: "faster" | "correct" | "incorrect" | "streak", value: number) {
    this.player.bonus.push({ type, value });
    switch (type) {
      case "correct":
        this.player.streak++;
        this.player.score += value;
        break;
      case "incorrect":
        this.player.streak = 0;
        this.player.score += value;
        break;
      case "streak":
      case "faster":
        this.player.score += value;
        break;
    }
  }
  refreshBonus() {
    this.player.bonus = [];
  }
  hasResponded(){
    return this.player.response.time !== null
  }
}
class Question {
  question: QuestionModel;
  constructor(
    category: string | null = null,
    difficulty: number | null = null,
    alreadyUsed: number[] = [],
  ) {
    this.question = this.getQuestion(category, difficulty, alreadyUsed);
  }

  public getQuestion(
    category: string | null = null,
    difficulty: number | null = null,
    alreadyUsed: number[] = []
  ) {
    let questionsFiltered = questions
      .filter((el) => !alreadyUsed.includes(el.id))
      .filter((el) => (category ? el.category === category : true))
      .filter((el) => (difficulty ? el.difficulty === difficulty : true));
     const seed=Date.now() ^ (Math.random() * 0x100000000);
     const rng = prand.xoroshiro128plus(seed);
     const rand = (min:number, max:number) => {
      const out = (rng.unsafeNext() >>> 0) / 0x100000000;
      return min + Math.floor(out * (max - min + 1));
    };
     const randomIndex =rand(0,questionsFiltered.length-1);
     //let randomIndex = Math.floor(Math.random() * questionsFiltered.length);
      return questionsFiltered[randomIndex];
  }
}
