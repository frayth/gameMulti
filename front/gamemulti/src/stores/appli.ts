
import { defineStore } from 'pinia'
import {onMounted, onUnmounted, ref } from 'vue'



export const appliStore = defineStore('appli', () => {
  const isOnline = ref(true)
  const isMobile = ref()
  const body=ref(document.querySelector('body'))
  const appliWidth=ref(0)
  onMounted(()=>{
    appliWidth.value=getBodyWidth()
    window.addEventListener('resize',()=>{
      appliWidth.value=getBodyWidth()
    })
  })
  onUnmounted(()=>{
    window.removeEventListener('resize',()=>{
      appliWidth.value=getBodyWidth()
    })
  })
  function getBodyWidth(){
    if(body.value)return body.value.clientWidth
    else return 0
  }
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
  window.addEventListener('resize', () => {
    body.value=document.querySelector('body')
  })


  return { isOnline,  isMobile,checkIfMobile,body,getBodyWidth,appliWidth }
})
