import Player from "./player";
import questions from "../assets/question.json";
import type { QuestionModel } from "../models/game.model";
import { response } from "express";
const offsetResponseTime=2000
export default class Game {
  players: GamePlayer[];
  question: Question;
  event: NodeJS.Timeout | null;
  askedQuestion: number[];
  nextEvent:number;
  phaseGame: 'intro'|'presentation' | 'question' |'score';
  constructor(players: Player[]) {
    this.players = players.map((el) => new GamePlayer(el));
    this.question = new Question();
    this.event = null;
    this.nextEvent=Date.now();
    this.askedQuestion = [];
    this.phaseGame = 'intro';
  }

 clearEvent() {
    if (this.event) clearTimeout(this.event);
  }

  private async changePhaseGame() {
    switch (this.phaseGame) {
      case "intro":
      case "score":
        this.phaseGame = "presentation";
        await this.getQuestion();
        this.createEvent(()=>{
          this.changePhaseGame()
        },5000)
        this.sendPresentation();
        break;
      case "presentation":
        this.phaseGame = "question";
        this.refreshPlayers();
        this.askQuestion();
        break;
      case "question":
        this.createEvent(()=>{
          this.changePhaseGame()
        },5000)
        this.phaseGame = "score";
        this.calculateScore(); 
        break;
    }
  }

  LauchIntro() {
    this.createEvent(()=>{
      this.changePhaseGame()
    },5000)
  }
  private sendScore(){
    console.log('sendScore',this.players.map(el=>el.player.score))
    this.players.forEach((el) => {
      el.player.socket?.emit("score:game",this.players.map(el=>el.getStats()));
  });
}
  private sendPresentation(){
    this.players.forEach((el) => {
      el.player.socket?.emit("presentation:game", {
        phaseGame: 'presentation',
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
  private async calculateScore() {
    await new Promise((resolve) => {
      this.players.forEach((el) => {
        if (el.player.response.response === this.question.question.response) {
          el.player.score += 10;
          el.player.streak += 1;
        } else {
          el.player.streak = 0;
        }
      });
      resolve(null);
    });
    this.sendScore();
  }
  private sendUpdateResponse(){
    let data=this.players.filter(el=>el.player.response.time!==null).map(el=>{
      return el.player.id
  })
    this.players.forEach((el) => {
      el.player.socket?.emit("update:response",data);
  });
  }
  private askQuestion() {
    this.createEvent(async () => {
      this.changePhaseGame();
    }, 15000);

    this.players.forEach((el) => {
      el.player.socket?.emit("question:game", this.getInfoGame());
    });
  }
  savePlayerResponse(player: Player, response:{response:number | null}) {
    if(!this.canResponse(player)) return

    console.log('ok pour sauvegarder')
    const user = this.players.find((el) => el.player.id === player.id);
    if (user) {
      user.player.response = {response:response.response,time:Date.now()};
      this.sendUpdateResponse()
    }
  }
 private canResponse(player: Player) {
    const user = this.players.find((el) => el.player.id === player.id);
    if (user) {
      return user.player.response.response === null && user.player.response.time === null;
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
  changeSockectPlayer(player:Player){
    const user=this.players.find((el) => el.player.id === player.id)
    if(user){
      user.player.socket=player.socket
    }
  }
  getInfoGame() {
    return {
      question: this.question.question.question,
      answers: this.question.question.answers,
      difficulty: this.question.question.difficulty,
      category: this.question.question.category,
      nextEvent:this.nextEvent-offsetResponseTime,
      phaseGame: this.phaseGame,
      gameStats: this.players.map((el) => el.getStats()),
      userResponse:this.players.filter(el=>el.player.response.time!==null).map(el=>{
        return el.player.id
    })
    };
  }

  createEvent(callback: () => void, time: number) {
    this.clearEvent();
    console.log('createEvent',this.nextEvent)
    this.nextEvent=Date.now()+time
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
  };

  constructor(player: Player) {
    this.player = {
      socket: player.socket,
      id: player.id,
      name: player.name,
      score: 0,
      streak: 0,
      response: {
        response: null,
        time:null
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
    };
  }
}

class Question {
  question: QuestionModel;
  constructor(
    category: string | null = null,
    difficulty: number | null = null,
    alreadyUsed: number[] = []
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
    let randomIndex = Math.floor(Math.random() * questionsFiltered.length);
    return questionsFiltered[randomIndex];
  }
}
