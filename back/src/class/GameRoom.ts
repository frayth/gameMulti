import Player from "./player";
import Room from "./room";
import {
  GameStatus,
  TypeRoom,
} from "../models/player.model";

import { rooms } from "../rooms";
import Game from "./game";
import { waitingRoom } from "./waitingRoom";
export class GameRoom extends Room {
  public type: TypeRoom;
  public status: GameStatus;
  public joinable: boolean;
  public game: Game | null;
  constructor(id: number, name: string, players: Player[] = []) {
    super(id, name, players);
    this.type = "gameRoom";
    this.status = "waiting";
    this.joinable = true;
    this.game = null;
  }
  initRoom() {
    this.status = "waiting";
    this.players.forEach((el) => {
      el.game.ready = false;
    });
    this.joinable = true;
    this.sendInfoGame();
  }
  closeEntry() {
    this.joinable = false;
    rooms.getRoom(0)?.emitToAll("list:room", rooms.getAllParsedRooms());
  }
  openEntry() {
    this.joinable = true;
    rooms.getRoom(0)?.emitToAll("list:room", rooms.getAllParsedRooms());
  }
  getOwner() {
    return this.players[0].id;
  }
  addPlayer(player: Player): void {
    this.players.push(player);
    this.sendInfoGame();
  }

  deletePlayer(player: Player): void {
    const changeName = player.id === this.getOwner();
    console.log("player delete",this.players, player.name);
    this.players = this.players.filter((el) => el.id !== player.id);

    if (this.players.length === 0 && player.room.room) {
      this.deleteRoom();
    } else {
      if (changeName) {
        this.name = `room de ${this.players[0].name}`;
      }
      this.sendInfoGame();
    }
  }

  getPlayer(id: number) {
    return this.players.find((el) => el.id === id);
  }

  sendInfoGame() {
    console.log('[GameRoom.ts]',"sendInfoGame");
    this.emitToAll("infoGameRoom:room", {
      status: this.status,
      owner: this.getOwner(),
      players: this.players.map((el) => {
        return {
          id: el.id,
          name: el.name,
          connected: el.socket.connected,
          ready: el.game.ready,
        };
      }),
      game: this.game ? this.game.getInfoGame() : null,
    });
  }
  startGame() {
    try {
      this.game = new Game(this.players,this);
      this.changeStatus("playing");
      this.game.LauchIntro();
      setTimeout(() => {    
      this.sendInfoGame();
      }, 10);
    } catch (e) {
      console.log(e);
    }
  }
  deleteRoom(): void {
    rooms.deleteRoom(this.id);
    if (this.game !== null && this.game.event !== null) {
      this.game.clearEvent();
    }
  }
  changeStatus(status: GameStatus) {
    this.status = status;
    waitingRoom.emitToAll("list:room", rooms.getAllParsedRooms());
    this.sendInfoGame();
  }
}
