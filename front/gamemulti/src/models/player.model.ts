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
}
export type PlayerStatus = 'connect' | 'disconnect';