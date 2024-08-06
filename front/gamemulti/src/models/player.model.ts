export default interface Player {
  id: number;
  name: string;
  connected: boolean;
  ready?: boolean;
}

export interface listStatPlayer{
  id:number,
  name:string,
  score:number
  streak:number
  bonus:{
    type:'faster' | 'correct' | 'incorrect' | 'streak',
    value:number
  }[]
  response:{
    response:number | null,
    time:number | null
  }
}
export type PlayerStatus = 'connect' | 'disconnect';