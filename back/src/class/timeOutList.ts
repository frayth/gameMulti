
import Player from "./player";
import { usersList } from "./usersList";
import { GameRoom } from "./GameRoom";
interface timeOutElement{
  player:Player;
  timeOut:number;
}
class timeOutList {
  private timeOutList: timeOutElement[];

  constructor() {
    this.timeOutList = [];
  }
  public add(player:Player) {
    if(player.room.room instanceof GameRoom){
      player.room.room?.sendInfoGame()
    }else{
      player.room.room?.sendInfo({status:'disconnect',name:player.name})
    }
    
    if(this.timeOutList.find((el) => el.player.id === player.id)){
      return;
    }
    this.timeOutList.push({
      player: player,
      timeOut: Date.now()
    })
  }
  public get():timeOutElement[] {
    return this.timeOutList;
  }
  public kick(player:Player) {
    this.timeOutList = this.timeOutList.filter((el) => el.player.id !== player.id);
    usersList.removeUser(player.socket);
  }
  public unkick(player:Player) {
    console.log('[timeOut]',"unkick",player.name)
    this.timeOutList = this.timeOutList.filter((el) => el.player.id !== player.id);
  }
  deleteIndex(index:number) {
    this.timeOutList.splice(index,1);
  }
}


export const timeOutListUser = new timeOutList();
const timeoutTimer=60000*5
setInterval(() => {
  let kickList:Player[] = [];
  let unkickList:timeOutElement[] = [];
  let indexTodelete:number[] = [];
  timeOutListUser.get().forEach((el,i) => {
    try{
      if(el.player.socket.connected){
        unkickList.push(el);
      }else{
        if(Date.now() - el.timeOut > (timeoutTimer)){
          kickList.push(el.player);
        }
      }
    }catch(e){
      indexTodelete.push(i);
      console.log("player not found for timeoutlist");
    } 
  })
  kickList.forEach((player) => {
    timeOutListUser.kick(player);
  })
  unkickList.forEach((el) => {
    timeOutListUser.unkick(el.player);
  })
  indexTodelete.forEach((index) => {
    timeOutListUser.deleteIndex(index);
  })

},10000);