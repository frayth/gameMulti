<template>
  <div class="mainRoomList">
    <div class="input-Room">
      <input type="text" v-model="filterName" placeholder="Rechercher une partie" />
      <SearchComp :size="30" color="black" :stroke-width="2" class="search-svg" />
    </div>
    <div @click="setJoinableFilter" :style="{width:'40px',justifySelf:'end',alignSelf:'center'}" >
      <ActivePopUp :message="'Filtrer par parties accessibles'">
      <div :class="{
        'select-container':true,
        'non-active-select':!showFilter,
        'active-select':showFilter
      }">
        <div :class="{ 
          'ball-container': true,
          'ball-non-active': !showFilter,
          'ball-active': showFilter
         }">
         <eyeCloseSvg v-if="showFilter" :size="15" color="black" :stroke-width="2" />
         <EyeOpenSvg v-else :size="15" color="black" />
        </div>
      </div>
    </ActivePopUp>
    </div>
    <table>
      <thead>
        <tr>
          <th @click="selectFilter(0, 'th')">
            Nom de la partie
            <ActivePopUp :message="'trier par nom de partie'" class="chevron-container">
              <ChevronSvg
                :size="18"
                color="white"
                @click="selectFilter(0, 'svg')"
                :class="{
                  chevron: true,
                  'active-chevron-incr':
                    filterActive.index === 0 && filterActive.increment === true,
                  'active-chevron': filterActive.index === 0 && filterActive.increment === false
                }"
              />
            </ActivePopUp>
          </th>
          <th @click="selectFilter(1, 'th')">
            Nombre de joueurs
            <ActivePopUp :message="'trier par nombre de joueurs'" class="chevron-container">
              <ChevronSvg
                :size="18"
                color="white"
                @click="selectFilter(1, 'svg')"
                :class="{
                  chevron: true,
                  'active-chevron-incr':
                    filterActive.index === 1 && filterActive.increment === true,
                  'active-chevron': filterActive.index === 1 && filterActive.increment === false
                }"
              />
            </ActivePopUp>
          </th>
          <th @click="selectFilter(0, 'th')">
            Statut
            <ActivePopUp :message="'trier par statut'" class="chevron-container">
              <ChevronSvg
                :size="18"
                color="white"
                @click="selectFilter(2, 'svg')"
                :class="{
                  chevron: true,
                  'active-chevron-incr':
                    filterActive.index === 2 && filterActive.increment === true,
                  'active-chevron': filterActive.index === 2 && filterActive.increment === false
                }"
              />
            </ActivePopUp>
          </th>
          <th>Rejoindre</th>
        </tr>
      </thead>
      <tbody v-if="filteredRooms.length !== 0">
        <tr v-for="room in filteredRooms" :key="room.name">
          <td>{{ room.name }}</td>
          <td>
            <div class="player-room-number">
              <p>{{ room.players.length }}</p>
              <peopleSvg :size="18" color="white" />
            </div>
          </td>
          <td>{{ ShowStatus(room.status) }}</td>
          <td><button @click="joinRoom(room.id)" v-if="room.joinable">Rejoindre</button></td>
        </tr>
      </tbody>
      <tbody v-else-if="filterName !== '' && listRooms.length !== 0">
        <tr>
          <td colspan="4">Aucune partie ne correspond à votre recherche</td>
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
import { computed, onMounted, ref } from 'vue'
import type { GameStatus } from '@/models/room.model'
import { appliStore } from '@store/appli'
import peopleSvg from '../../assets/SVG/peopleSvg.vue'
import { useSocketStore } from '../../stores/socket'
import { listRooms as roomStore } from '@/stores/Rooms'
import SearchComp from '@/assets/SVG/SearchComp.vue'
import ChevronSvg from '@/assets/SVG/ChevronSvg.vue'
import ActivePopUp from '../UI/ActivePopUp.vue'
import { storeToRefs } from 'pinia'
import eyeCloseSvg from '@/assets/SVG/eyeCloseSvg.vue'
import EyeOpenSvg from '@/assets/SVG/EyeOpenSvg.vue'
const appli = appliStore()
const socket = useSocketStore()
const rooms = roomStore()
const filterName = ref('')
const showFilter=ref(false)
const { listRooms } = storeToRefs(rooms)
const filteredRooms = computed(() => {
  return rooms.listRooms
    .filter((room) => {
      return filterName.value === ''
        ? true
        : room.name.toLowerCase().includes(filterName.value.toLowerCase())
    })
    .filter((room) => {
      return showFilter.value ? room.joinable : true
    })
    .sort((a, b) => {
      switch (filterActive.value.index) {
        case 0:
          return filterActive.value.increment
            ? a.name.localeCompare(b.name)
            : b.name.localeCompare(a.name)
        case 1:
          return filterActive.value.increment
            ? a.players.length - b.players.length
            : b.players.length - a.players.length
        case 2:
          return filterActive.value.increment
            ? a.status!.localeCompare(b.status!)
            : b.status!.localeCompare(a.status!)
        default:
          return 0
      }
    })
})

const filterActive = ref({
  index: -1,
  increment: true
})
function ShowStatus(status: GameStatus | null) {
  switch (status) {
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

onMounted(() => {
  socket.socket?.emit('getRooms:rooms')
})
function joinRoom(id: number) {
  if (listRooms.value.find((room) => room.id === id)?.joinable === false) return
  socket.socket?.emit('join:room', { id })
}
function selectFilter(index: number, element: 'th' | 'svg') {
  if (appli.getBodyWidth() >= 780 && element === 'th') return
  if (listRooms.value.length <= 1) return
  if (filterActive.value.index === index) {
    filterActive.value.increment = !filterActive.value.increment
  } else {
    filterActive.value.increment = true
    filterActive.value.index = index
  }
}
function setJoinableFilter() {
  showFilter.value = !showFilter.value
}
</script>

<style scoped>
.select-container {
position: relative;
  width: 40px;
  height: 20px;
  border-radius: 5px;

}
.non-active-select {
  background-color: grey;

}
.ball-container{
  position: absolute;
  width: 20px;
  height: 20px;
  border-radius: 50%;
  background-color: white;
  display: flex;
  justify-content: center;
  align-items: center;
}
.ball-active{
  animation: forwards 0.3s ease moveRight;
}
.ball-non-active{
  animation: forwards 0.3s ease moveLeft;
}
.active-select {
  background-color: var(--main-green);
}
.chevron-container {
  position: absolute;
  right: 20px;
  top: 50%;
}
.input-Room {
  width: 100%;
  height: 32px;
  border: 1px solid black;
  border-radius: 5px;
  position: relative;
  max-width: 200px;
  justify-self: start;
}
.search-svg {
  position: absolute;
  right: 2px;
  top: 0px;
  opacity: 0.5;
}
.test2 {
  width: 30px;
  height: 30px;
}
.input-Room input {
  width: 100%;
  height: 100%;
  border: none;
  outline: none;
  padding-right: 30px;
  border-radius: 5px;
}
.mainRoomList {
  display: grid;
  grid-template:auto auto / auto auto;
  margin-top: 20px;
}
.listRooms {
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
.name-user-container {
  display: flex;
  flex-direction: column;
  gap: 5px;
}
button {
  width: 100%;
  height: 100%;
  background-color: rgb(65, 65, 66);
  color: var(--normalTextColor);
  border: none;
  cursor: pointer;
  padding: 10px;
}
.player-room-number {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 5px;
}
table {
  width: 100%;
  border-collapse: collapse;
  margin-top: 10px;
  grid-column: 1 /span 2;
}
td {
  border: 1px solid black;
  padding: 5px;
  text-align: center;
}
th {
  border: 1px solid black;
  padding: 5px;
  text-align: center;
  background-color: var(--main-green);
  color: var(--normalTextColor);
  position: relative;
}
.chevron {
  transition: transform 0.3s ease;
  transform: translateY(-50%) rotate(90deg);
  cursor: pointer;
}
.active-chevron-incr {
  transform: translateY(-50%) rotate(180deg) !important;
}
.active-chevron {
  transform: translateY(-50%) rotate(0deg) !important;
}
@media (max-width: 780px) {
  .chevron-container {
    display: none;
  }
  th {
    cursor: pointer;
  }
}
@media (max-width: 1000px) {
  .chevron-container {
    right: 5px;
  }
  .mainRoomList {
    padding: 0 5px;
  }
}
@keyframes moveRight{
  0%{
    left: 0px;
  }
  100%{
    left : calc(100% - 22px);
  }
}
@keyframes moveLeft{
  0%{
    left : calc(100% - 22px);
  }
  100%{
    left :0
  }
}
</style>
