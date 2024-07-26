import { Socket } from "socket.io";
import Room from "../class/room";
import {WaitingRoom} from "../class/waitingRoom";

export type PlayerStatus = 'connect' | 'disconnect';
export type GameStatus = 'waiting' | 'playing' | 'end';

export  type TypeRoom = 'waitingRoom' | 'gameRoom';

export interface Player {
  id: number;
  name: string;
  socket: Socket;
  room:{
    name:string,
    room:Room | null | WaitingRoom
  }
}
export interface Info{
  status:'connect'|'disconnect',
  name:string
}

export interface InfoGameRoom extends Info{
  type:TypeRoom,
  gameStatus:GameStatus
}
export interface UserInfoGame{
  id:number,
  name:string,
  connected:boolean,
  ready:boolean
}