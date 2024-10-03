import { defineStore } from 'pinia'
import { ref ,computed} from 'vue'
import { appliStore } from './appli'

interface MousePosition {
  x: number
  y: number
}
interface PopUp {
  show: boolean
  message: string
  timer: NodeJS.Timeout | null,
  html:HTMLDivElement | null
}
export const usePopup = defineStore('popup', () => {
  const app=appliStore()
  const mousePosition = ref<MousePosition>({ x: 0, y: 0 })
  const body=computed(()=>app.body)
  const popUpMaxWidth=100

  const popUp=ref<PopUp>({
    show: false,
    message: 'salut',
    timer: null,
    html:null
  })
  window.addEventListener('mousemove', (e) => {
    if(body.value && e.pageX+popUpMaxWidth>body.value.clientWidth){
    mousePosition.value.x = e.pageX - popUpMaxWidth - 15
    }else{
      mousePosition.value.x = e.pageX
    }
    if (body.value && e.pageY> body.value.clientHeight/1.2) {
      mousePosition.value.y = e.pageY - 50
    } else {
      mousePosition.value.y = e.pageY
    }
  })


  function setPopUp(status: boolean, message: string = '') {
    popUp.value.show = status
    popUp.value.message = message
  }
  function startPopUpTimer(message: string) {
    popUp.value.timer = setTimeout(() => {
      setPopUp(true, message)
    }, 500)
  }
  function cancelPopUpTimer() {
    clearTimeout(popUp.value.timer as NodeJS.Timeout)
    setPopUp(false)
  }
  return { popUp, startPopUpTimer, cancelPopUpTimer,mousePosition,popUpMaxWidth}
})
