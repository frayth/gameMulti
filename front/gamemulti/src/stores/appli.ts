import { defineStore } from "pinia";
import { reactive, ref } from "vue";

interface MousePosition{
  x:number,
  y:number
}
interface PopUp{
  show:boolean,
  message:string,
  timer:NodeJS.Timeout | null,
}


export const appliStore= defineStore('appli', () => {

  const  isOnline=ref(true)
  const mousePosition:MousePosition=reactive({x:0,y:0})

  const popUp:PopUp=reactive({
    show:false,
    message:'salut',
    timer:null,
  })
  window.addEventListener('mousemove',(e)=>{
    mousePosition.x=e.pageX
    mousePosition.y=e.pageY
  })
  window.addEventListener('offline',()=>{
    isOnline.value=false
    
  })
  window.addEventListener('online',()=>{
    isOnline.value=true
    
  })
  function setPopUp(status:boolean,message:string=''){
    popUp.show=status
    popUp.message=message
  }
  function startPopUpTimer(message:string){
      popUp.timer = setTimeout(()=>{
       setPopUp(true,message)
      },1000)
  }
  function cancelPopUpTimer(){
    clearTimeout(popUp.timer as NodeJS.Timeout)
    setPopUp(false)
  }
  return {isOnline,mousePosition,popUp ,startPopUpTimer,cancelPopUpTimer}
})
