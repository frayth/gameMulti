import { Socket } from "socket.io";

import { generateKey } from "../modules/keyGenerator";
import Player from "./player";
import { generateToken } from "../modules/jwt";
import { waitingRoom } from "./waitingRoom";
class UsersList {
  private users: Player[];
  constructor() {
    this.users = [];
  }

  addUser(socket: Socket): string {
    const key = generateKey();
    const token = generateToken(key);
    const id = this.users[this.users.length - 1]
      ? this.users[this.users.length - 1].id + 1
      : 0;
    const newPlayer = new Player(id, socket, key);
    this.users.push(newPlayer);
    return token;
  }

  initUser(player: Player): void {
    if(!player.room.room){
      // player.socket.emit("joinRoom:user", { name: "waitingRoom", id: 0 });
      player.setRoom("waitingRoom", waitingRoom);
    }else{
      // player.socket.emit("joinRoom:user", { name: player.room.room.name, id: player.room.room.id });
      player.setRoom(player.room.room.name, player.room.room);
    }
  }
  removeUser(socket: Socket): void {
    console.log("user delete", socket.id);
    const player = this.users.find((user) => user.socket.id === socket.id);
    if (player) {
      player.room.room?.deletePlayer(player);
      this.users = this.users.filter((user) => user.socket.id !== socket.id);
      console.log("user disconnected", player.id, player.name);
    } else {
      console.log("user not found in usersList");
    }
  }
  getUserByKey(key: string): Player | null {
    const player = this.users.find((user) => user.key === key);
    if (!player) return null;
    return player;
  }

  getUserList(): Player[] {
    return this.users;
  }
  getUser(socket: Socket): Player | null {
    return this.users.find((user) => user.socket === socket) || null;
  }
  checkName(name: string): boolean {
    return this.users.some((user) => user.name.toLowerCase() === name.toLowerCase());
  }
  public bonjour(player: Player): void {
    if (!player) return;
    player.socket.emit("bonjour", this.getUserList());
  }
}

export const usersList = new UsersList();

// setInterval(() => {
//   usersList.getUserList().forEach((user) => {
//     if(!user.socket.connected){
//       timeOutListUser.add(user);
//     }
//   })
// },1000*60*10);
