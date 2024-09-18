import { httpServer } from "./socket";
import { rooms } from "./rooms";
import dotenv from "dotenv";
import { usersList } from "./class/usersList";
export const dotenvConfig=dotenv.config();
console.log('index',process.env.SECRET_KEY)
httpServer.listen(process.env.PORT, ()=>process.env.URL);// 3000 ,'192.168.1.62'  4001 '127.0.0.1'


setInterval(() => {
 
   //console.log(usersList.getUserList().map((user) => `${user.name}  ${user.socket.connected} ${user.room.name}`))
  // console.log(rooms.listOfRooms)
  //console.log('userlist',usersList.getUserList().map((user) => `${user.name}  ${user.socket.id} ${user.room.room?.name}`))



},1000);