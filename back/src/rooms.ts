 import { WaitingRoom,waitingRoom } from "./class/waitingRoom";
 import { GameRoom } from "./class/GameRoom";
interface Room{
  listOfRooms:(WaitingRoom | GameRoom)[],
  addRoom:(room: WaitingRoom | GameRoom) => void,
  getRoom:(id: number) => WaitingRoom | GameRoom | null,
  getAllParsedRooms:() => {id:number,name:string,players:{id:number,name:string}[]}[],
  deleteRoom:(id: number) => void

}
 export const rooms:Room = {
   listOfRooms: [waitingRoom],
    addRoom(room: WaitingRoom | GameRoom) {
      this.listOfRooms.push(room);
    },
    deleteRoom(id: number) {
     if(id===0)return
      const room = this.listOfRooms.find((room) => room.id === id);
      if (room) {
        this.listOfRooms = this.listOfRooms.filter((room) => room.id !== id );
      }
    },
    getRoom(id: number) {
      const room = this.listOfRooms.find((room) => room.id === id);
      return room ? room : null;
    },
    getAllParsedRooms() {
      return this.listOfRooms.map((room)=>{
        return {
          id:room.id,
          name:room.name,
          type:room.type,
          status:room.type === 'gameRoom' ? (room as GameRoom).status : null,
          joinable:room.type === 'gameRoom' ? (room as GameRoom).joinable : null,
          players:room.players.map((player)=>{
            return {
              id:player.id,
              name:player.name
            }
          })
        }
      })
      .filter((room) => room.name !== 'waitingRoom');
    }
 }