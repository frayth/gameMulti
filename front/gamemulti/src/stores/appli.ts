import { defineStore } from 'pinia'
import { reactive, ref } from 'vue'

interface MousePosition {
  x: number
  y: number
}
interface PopUp {
  show: boolean
  message: string
  timer: NodeJS.Timeout | null
}

export const appliStore = defineStore('appli', () => {
  const isOnline = ref(true)
  const mousePosition: MousePosition = reactive({ x: 0, y: 0 })
  const isMobile = ref()

  function checkIfMobile() {
    const userAgent = navigator.userAgent || navigator.vendor

    // Liste des appareils mobiles courants à vérifier
    const mobileDevices = [
      /Android/i,
      /webOS/i,
      /iPhone/i,
      /iPad/i,
      /iPod/i,
      /BlackBerry/i,
      /Windows Phone/i
    ]

    // Vérifiez si l'User-Agent correspond à l'un des appareils mobiles
    isMobile.value= mobileDevices.some((device) => userAgent.match(device))
  }

  const popUp: PopUp = reactive({
    show: false,
    message: 'salut',
    timer: null
  })
  window.addEventListener('mousemove', (e) => {
    mousePosition.x = e.pageX
    mousePosition.y = e.pageY
  })
  window.addEventListener('offline', () => {
    isOnline.value = false
  })
  window.addEventListener('online', () => {
    isOnline.value = true
  })
  function setPopUp(status: boolean, message: string = '') {
    popUp.show = status
    popUp.message = message
  }
  function startPopUpTimer(message: string) {
    popUp.timer = setTimeout(() => {
      setPopUp(true, message)
    }, 1000)
  }
  function cancelPopUpTimer() {
    clearTimeout(popUp.timer as NodeJS.Timeout)
    setPopUp(false)
  }
  return { isOnline, mousePosition, popUp, startPopUpTimer, cancelPopUpTimer, isMobile,checkIfMobile }
})
