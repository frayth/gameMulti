import Player from "./player";
import { Info } from "../models/player.model";
import { rooms } from "../rooms";

export default class Room {
  type: 'gameRoom' | 'waitingRoom' | null;
  constructor(public id: number, public name: string, public players: Player[] = []) {
    this.id = id;
    this.name = name;
    this.players = players;
    this.type=null
  }
  addPlayer(player: Player): void {
    this.players.push(player);
    this.sendInfo({status:'connect',name:player.name})
  }
  deletePlayer(player: Player): void {
    console.log('player delete!!!!', this.players, player.name);
    this.players = this.players.filter((el) => el.id !== player.id);
    this.sendInfo({status:'disconnect',name:player.name})
    if (this.players.length === 0 && player.room.room ) {
      this.deleteRoom();
    }
  }

  emitToAll(event: string, data: any): void {
    this.players.forEach((el) => {
      el.socket.emit(event, data);
    });
  }
  deleteRoom(): void {
    rooms.deleteRoom(this.id);
  }

  sendInfo(info:{
    status:'connect'|'disconnect',
    name:string
  }): void {
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
}