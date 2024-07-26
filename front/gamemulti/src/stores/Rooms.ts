import { defineStore } from "pinia";
import {  ref } from "vue";
import type Room from '@/models/room.model'


export const listRooms= defineStore('listRooms', () => {
  const listRooms=ref<Room[]>([])
  function setListRooms(newListRooms:Room[]){
    listRooms.value=newListRooms
  }
  return {listRooms ,setListRooms}
})
