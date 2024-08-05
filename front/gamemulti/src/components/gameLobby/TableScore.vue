<template>
  <div>
      <div>
        <table>
          <tr>
            <th>Player</th>
            <th>Streak</th>
            <th>Score</th>
          </tr>
          <tr  v-for="player in score" :key="player.id" :class="userId===player.id?'user':'' ">
            <td >{{player.name}}</td>
            <td>{{player.streak}}</td>
            <td>{{player.score}}</td>
          </tr>

        </table>
      </div>
  </div>
</template>

<script setup lang="ts">
  import {gameStore} from '@/stores/game'
  import {computed} from 'vue'
  import {userStore} from '@/stores/user'
  const userId=userStore().id;
  const game=gameStore();

  const score=computed(()=>game.gameStat.sortedPlayerByScore())

</script>

<style scoped>
table{
  width: 100%;
  border-collapse: collapse;
}
th, td {
  border: 1px solid black;
  padding: 8px;
  text-align: center;
  color: white;
}
.user{
  background-color: #4CAF50;
}
</style>