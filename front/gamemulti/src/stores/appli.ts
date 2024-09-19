import { defineStore } from 'pinia'
import {ref } from 'vue'



export const appliStore = defineStore('appli', () => {
  const isOnline = ref(true)
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



  window.addEventListener('offline', () => {
    isOnline.value = false
  })
  window.addEventListener('online', () => {
    isOnline.value = true
  })

  return { isOnline,  isMobile,checkIfMobile }
})
