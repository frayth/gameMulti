import  Player  from "./player";
import { Info } from "../models/player.model";
import Game from "./game";

export class WaitingRoom{
  type: 'gameRoom' | 'waitingRoom' | null;
  id: number;
  name: string;
  players: Player[];
  game: null | Game
  constructor(id:number,name:string,players:Player[]){
    this.id=id;
    this.name=name;
    this.players=players;
    this.game=null;
    this.type="waitingRoom";
  }

  deletePlayer(player: Player): void {
    this.players = this.players.filter((el) => el.id !== player.id);
    this.sendInfo({status:'disconnect',name:player.name})
  }


sendInfo(info:{
    status:'connect'|'disconnect',
    name:string
  }): void {
    console.log('[waitingRoom] sendInfo',info)
    this.emitToAll('info:room',{
      users:this.players.map((el) => {
        return {
          id: el.id,
          name: el.name,
          connected:el.socket.connected
        }
      }) as {id:number,name:string,connected:boolean}[],
      info:{
        status:info.status,
        name:info.name
      } as Info
    })
  }

  
  emitToAll(event: string, data: any): void {
    this.players.forEach((el) => {
      el.socket.emit(event, data);
    });
  }
  addPlayer(player: Player): void {
    this.players.push(player);
    this.sendInfo({status:'connect',name:player.name})
  }
}

export const waitingRoom = new WaitingRoom(0,"waitingRoom",[]);
