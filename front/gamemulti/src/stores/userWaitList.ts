import { defineStore } from "pinia";
import { ref } from "vue";




export const userWaitStore= defineStore('userWaitList', () => {
  const userWaitList=ref([])
  
  return {userWaitList }
})
