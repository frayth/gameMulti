import type Player from './player.model';


export default interface Room {
  name: string;
  id: number;
  type:TypeRoom,
  status:GameStatus | null,
  joinable:boolean | null,
  players:Player[]
}

export type GameStatus = 'waiting' | 'playing' | 'end';

export  type TypeRoom = 'waitingRoom' | 'gameRoom';

export interface InfoGameRoom {
  players:Player[],
  status:GameStatus,
  owner:number,
  game:{
    question:string,
    answers:{id:number,value:string}[],
    difficulty:number,
    category:string,
    nextEvent:number,
    phaseGame:'intro'|'presentation' | 'question' |'score'
  }|null
}

export interface panelErrorInfoRoom{
    error: boolean,
    message: string,
    event: null | number,
    setError: ( message: string,error: boolean) => void
}