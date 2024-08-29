<template>
  <div class="main-podium" :style="{ height: `${height}px` }">
    <div
      class="SecondName namePodium"
      :style="{ transform: `translateY(25%)` }"
      v-if="podium.second.showName "
    >
      <div v-for="player in getNameByRank(2)" :key="player.id">
        <span :class="{ isUser: isUser(player.id) }">{{ player.name }}</span>
      </div>
    </div>
    <div class="firstName namePodium" v-if="podium.first.showName">
      <div v-for="player in getNameByRank(1)" :key="player.id">
        <span :class="{ isUser: isUser(player.id) }">{{ player.name }}</span>
      </div>
    </div>
    <div
      class="thirdName namePodium"
      :style="{ transform: `translateY(50%)` }"
      v-if="podium.third.showName "
    >
      <div v-for="player in getNameByRank(3)" :key="player.id">
        <span :class="{ isUser: isUser(player.id) }">{{ player.name }}</span>
      </div>
    </div>
    <div class="second" :style="{ height: `${podium.second.height}%` }">
      <div class="bg bg2" v-if="podium.second.showMedal"></div>
    </div>
    <div class="first" :style="{ height: `${podium.first.height}%` }">
      <div class="bg bg1" v-if="podium.first.showMedal"></div>
    </div>
    <div class="third" :style="{ height: `${podium.third.height}%` }" >
      <div class="bg bg3" v-if="podium.third.showMedal"></div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { gameStore } from '@/stores/game'
import {defineProps, onActivated, ref } from 'vue'
import { userStore } from '@/stores/user'

const game = gameStore()
const user = userStore()


const podium = ref({
  first: {
    height: 0,
    maxHeight: 100,
    showName: false,
    showMedal: false
  },
  second: {
    height: 0,
    maxHeight: 75,
    showName: false,
    showMedal: false
  },
  third: {
    height: 0,
    maxHeight: 50,
    showName: false,
    showMedal: false
  }
})
defineProps({
  height: {
    type: Number,
    default: 300
  }
})
function getNameByRank(rank: number) {
  return game.gameStat.players.filter((el) => el.rank === rank)
}
function isUser(playerId: number) {
  return playerId === user.id
}
onActivated(() => {
  game.gameStat.affectRankForPlayer()
  setTimeout(() => {
    lauchPodium()
  }, 1000)
})
const lauchPodium = async () => {
  const interval = ref<null | NodeJS.Timeout>(null)
  await new Promise((resolve) => {
    interval.value = setInterval(() => {
      if (podium.value.first.height < podium.value.first.maxHeight) {
        podium.value.first.height += 1
      } else {
        clearInterval(interval.value as NodeJS.Timeout)
        podium.value.first.showMedal = true
        setTimeout(() => {
          podium.value.first.showName = true
          resolve(true)
        }, 500)
      }
    }, 10)
  })
  await new Promise((resolve) => {
    interval.value = setInterval(() => {
      if (podium.value.second.height < podium.value.second.maxHeight) {
        podium.value.second.height += 1
      } else {
        clearInterval(interval.value as NodeJS.Timeout)
        podium.value.second.showMedal = true
        setTimeout(() => {
          podium.value.second.showName = true
          resolve(true)
        }, 500)
      }
    }, 10)
  })
  await new Promise((resolve) => {
    interval.value = setInterval(() => {
      if (podium.value.third.height < podium.value.third.maxHeight) {
        podium.value.third.height += 1
      } else {
        clearInterval(interval.value as NodeJS.Timeout)
        podium.value.third.showMedal = true
        setTimeout(() => {
          podium.value.third.showName = true
          resolve(true)
        }, 500)
      }
    }, 10)
  })
}
</script>

<style scoped>
.main-podium {
  height: v-bind(height);
  display: grid;
  grid-template: repeat(2, 1fr) / repeat(3, 1fr);
  max-width: 700px
}

.second {
  height: 0;
  width: 100%;
  background-color: var(--main-green);
  border-radius: 10px 0px 0 0;
  grid-column: 1;
  grid-row: 2;
  align-self: end;
  position: relative;
  overflow: hidden;
}
.bg {
  position: absolute;
  width: 100%;
  height: 100%;
  animation: slideDowntoUp 0.5s linear;
}
.bg1 {
  background-image: url(../../../assets/Images/gold.png);
  background-position: center;
  background-repeat: no-repeat;
  background-size: contain;
}
.bg2 {
  background-image: url(../../../assets/Images/silver.png);
  background-position: center;
  background-repeat: no-repeat;
  background-size: contain;
}
.bg3 {
  background-image: url(../../../assets/Images/bronze.png);
  background-position: center;
  background-repeat: no-repeat;
  background-size: contain;
}
.first {
  height: 0;
  width: 100%;
  background-color: var(--main-green);
  border-radius: 10px 10px 0 0;
  grid-column: 2;
  grid-row: 2;
  align-self: end;
  position: relative;
  overflow: hidden;
}
.third {
  height: 0;
  width: 100%;
  background-color: var(--main-green);
  border-radius: 0px 10px 0 0;
  grid-column: 3;
  grid-row: 2;
  align-self: end;
  position: relative;
  overflow: hidden;
}
.namePodium {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  font-size:clamp(10px, 5vw, 15px);
  color: white;
  flex-shrink: 1;
  animation: name 0.5s linear;
  overflow: hidden;
  text-overflow: ellipsis;
  
}
.secondName {
  grid-column: 1;
  grid-row: 1;
}
.firstName {
  grid-column: 2;
  grid-row: 1;
}
.thirdName {
  grid-column: 3;
  grid-row: 1;
}
.isUser {
  color: var(--main-green);
  font-weight: bold;
  font-size: clamp(10px, 5vw, 15px);
}
@keyframes name {
  from {
    transform: translateY(-25%);
    opacity: 0;
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
@keyframes slideDowntoUp {
  from {
    transform: translateY(-100%);
    opacity: 0;
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
@media (max-width: 600px) {
  .namePodium {
    font-size: 10px;
  }
  .isUser {
    font-size: 10px;
  }
}
</style>
