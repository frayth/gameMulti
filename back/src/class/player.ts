import { Socket } from "socket.io";
import { GameRoom } from "./GameRoom";
import { WaitingRoom } from "./waitingRoom";
import { rooms } from "../rooms";
import { io } from "../socket";
export default class Player {
  id: number;
  name: string;
  socket: Socket;
  game: {
    ready: boolean;
  };
  room: {
    name: string;
    room: GameRoom | null | WaitingRoom;
  };
  key: string | null;
  constructor(id: number, socket: Socket, key: string) {
    this.id = id;
    this.name = `Player_${id}`;
    this.socket = socket;
    this.room = {
      name: "",
      room: null,
    };
    this.game = {
      ready: false,
    };
    this.key = key;
  }
  public setRoom(name: string, room: GameRoom | WaitingRoom): void {
    const userAlreaydyInRoom =this.room.room !== null && this.room.room.id === room.id;
    if (userAlreaydyInRoom) {
      console.log('[setRoom]','same room')
      if (this.room.room instanceof GameRoom && this.room.room?.game !== null) {
        this.room.room?.game.changeSockectPlayer(this);
      }else{
        room.sendInfo({status:'connect',name:this.name});
      }
    }else if (this.room.room !== null) {
      console.log('[setRoom]','delete player')
        this.room.room.deletePlayer(this);
        this.socket.leave(this.room.name);
        room.addPlayer(this);
      }else{
        console.log('[setRoom]','add player')
        room.addPlayer(this);
      }
      this.room = {
        name,
        room,
      };
      io.emit("list:room", rooms.getAllParsedRooms());
      this.socket.join(name);
      this.sendInfo();
    }
  public sendInfo() {
    this.socket.emit("info:user", {
      id: this.id,
      name: this.name,
      room: {
        name: this.room.name,
        id: this.room.room?.id,
      },
    });
  }

  public canJoinRoom(): boolean {
    return this.room.name === "" || this.room.name === "waitingRoom";
  }
  public initGameProperties() {
    this.game.ready = false;
  }
  public leaveRoom(): void {
    if (this.room.room !== null && this.room.name !== "waitingRoom") {
      this.setRoom("waitingRoom", rooms.getRoom(0) as WaitingRoom);
      io.emit("list:room", rooms.getAllParsedRooms());
      this.initGameProperties();
    }
  }
}
