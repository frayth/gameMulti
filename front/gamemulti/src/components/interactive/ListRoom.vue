<template>
  <div class="mainRoomList">
    <table>
      <thead>
      <tr>
        <th>Nom de la partie</th>
        <th>Nombre de joueurs</th>
        <th>Statut</th>
        <th>Rejoindre</th>
      </tr>
    </thead>
      <tbody v-if="list.length!==0">
        <tr v-for="room in list" :key="room.name">
          <td>{{room.name}}</td>
          <td><div class="player-room-number">
            <p>{{room.players.length}}</p>
            <peopleSvg :size="18" color="white" />
          </div></td>
          <td>{{ShowStatus(room.status)}}</td>
          <td ><button @click="joinRoom(room.id)" v-if="room.joinable">Rejoindre</button></td>
        </tr>
      </tbody>
      <tbody v-else>
        <tr>
          <td colspan="4">Aucune partie en cours</td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script setup lang="ts">
import { onMounted,computed} from 'vue'
import type {GameStatus} from '@/models/room.model'
import peopleSvg from '../../assets/SVG/peopleSvg.vue'
  import {useSocketStore} from '../../stores/socket'
  import { listRooms } from '@/stores/Rooms'; 
  const socket=useSocketStore()
  const rooms=listRooms()
  const list=computed(()=>rooms.listRooms)
  function ShowStatus(status:GameStatus | null){
    switch(status){
      case 'waiting':
        return 'En Attente'
      case 'playing':
        return 'En jeu'
      case 'end':
        return 'Terminé'
      default:
        return 'Inconnue'
    }
  }
  onMounted(()=>{
    console.log('getRooms')
    socket.socket?.emit('getRooms:rooms')
  })
  function joinRoom(id:number){
    if(list.value.find(room=>room.id===id)?.joinable===false)return
    socket.socket?.emit('join:room',{id})
  }
</script>

<style scoped>
.mainRoomList{
  display: flex;
  justify-content: center;
  align-items: center;
  flex-wrap: wrap;
}
.listRooms{
  display: flex;
  justify-content: space-between;
  flex-direction: column;
  align-items: center;
  width: 200px;
  border: 1px solid black;
  margin: 5px;
  background-color: white;
  color: black;
  border-radius: 20px;
  overflow: hidden;
}
.name-user-container{
  display: flex;
  flex-direction: column;
  gap: 5px;
}
button{
width: 100%;
height: 100%;
background-color: rgb(65, 65, 66);
color: var(--normalTextColor);
border: none;
cursor: pointer;
padding: 10px;

}
.player-room-number{
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 5px;
}
table {
  width: 100%;
  border-collapse: collapse;
  margin-top: 10px;
}
td{
  border: 1px solid black;
  padding: 5px;
  text-align: center;
}
th{
  border: 1px solid black;
  padding: 5px;
  text-align: center;
  background-color: var(--main-green);
  color: var(--normalTextColor);
}

</style>