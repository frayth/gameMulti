<template>
  <div :style="{width:'100%'}">
    <div class="presentation-container">
      <div class="name-pres">{{name}}</div>
      <div class="score-pres">Score: <span :style="{color:tempScore.color}">{{tempScore.value}}</span></div>
      <div class="bonus-pres">
        <div class="bonus" v-for="el in bonusToShow" :key="el.name">
          <div class="bonus-cont">
            <div>
              <HAPPY :size="40" v-if="el.name==='correct'" @mouseenter="startTimer('Bonne réponse')" @mouseleave="cancelTimer" />
              <SAD :size="40" v-else-if="el.name==='incorrect'" @mouseenter="startTimer('Mauvaise réponse')" @mouseleave="cancelTimer"/>
              <FAST :size="40" v-else-if="el.name==='faster'" @mouseenter="startTimer('Le plus rapide')" @mouseleave="cancelTimer"/>
              <bulleye :size="40" v-else-if="el.name==='streak'" @mouseenter="startTimer('Streak')" @mouseleave="cancelTimer"/>
              <div v-else>{{el.name}}</div>
            </div>
            <div :class="{value:true,positif:el.value>0,negatif:el.value<0}" v-if="el.posY>= 0" :style="{top:`${el.posY}%`,opacity:`${el.posY>=30?'100':el.posY}%`}">
              {{ el.value>0 ? '+' : '' }}{{ el.value }}
            </div>
          </div>
          
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref,reactive, onUnmounted } from 'vue'
import SAD from '@/assets/SVG/SadSvg.vue'
import HAPPY from '@/assets/SVG/HappySvg.vue'
import FAST from '@/assets/SVG/FastSvg.vue'
import bulleye from '@/assets/SVG/BullEyes.vue'
import { usePopup } from '@store/popUp'
import {audioStore} from '@/stores/audio'
const audio=audioStore()
onUnmounted(() => {
  cancelTimer()
})
const popup=usePopup()
interface Bonus{
  type: string;
  value: number;
}
const props = defineProps({
  activeSound: {
    type: Boolean,
    default:false
  },
  score:{
    type: Number,
    required: true
  },
  bonus:{
    type:Array as ()=>Bonus[],
    required: true
  },
  name:{
    type: String,
    required: true
  }
  
})
function startTimer(value:string){
  popup.startPopUpTimer(value)
}
function cancelTimer(){
  popup.cancelPopUpTimer()
}
const tempBonus =ref( props.bonus.map((el) => {
  return {
    name: el.type,
    value: el.value,
    posY: 100,
  }
}))
const tempScore= reactive({
  value: props.score,
  color: 'var(--normalTextColor)',
  changeValue(value:number){
    this.value+=value
    if(value>0){
      this.color='green'
    }else if(value<0){
      this.color='red'
    }else{
      this.color='var(--normalTextColor)'
    }
  }  
})

const bonusToShow= ref<{
  name: string;
  value: number;
  posY: number;
}[]>([])
setTimeout(() => {
  startShowBonus()
}, 1000);

const startShowBonus=async ()=>{
  const event=ref<null|NodeJS.Timeout>(null)
  for(let i in tempBonus.value){
    if(tempBonus.value[i].value===0){
      continue
    }
    bonusToShow.value.push(tempBonus.value[i])
    await animateScore(bonusToShow.value[i].value)
    await new Promise((resolve) => {
      event.value=setInterval(() => {
        bonusToShow.value[i].posY-=2
        if(bonusToShow.value[i].posY<=-1){
          clearInterval(event.value as NodeJS.Timeout)
          resolve(null)
        }
      }, 16);
    });
  }
}
const animateScore=async (value:number)=>{
  const event=ref<null|NodeJS.Timeout>(null)

  await new Promise((resolve) => {
    event.value=setInterval(() => {
      if(props.activeSound) audio.playSound('pop')
     if(value>0){
      tempScore.changeValue(1)
      value-=1
     }else{
      tempScore.changeValue(-1)
      value+=1
     }
      if(value===0){
        tempScore.changeValue(0)
        clearInterval(event.value as NodeJS.Timeout)
        resolve(null)
      }
    }, 100);
  });
}
</script>

<style scoped>
.presentation-container {
  display: grid;
  grid-template-columns: auto 1fr auto;
  grid-template-rows: 40px auto;
  width: 100%;
  height: 100px;
  padding: 10px;
  border: 1px solid var(--normalTextColor);
}
.name-pres {
  font-size: 20px;
  color: var(--normalTextColor);
  text-align: center;
  grid-column: 1;
  grid-row: 1;
}
.score-pres {
  font-size: 20px;
  color:var(--normalTextColor);
  text-align: center;
  grid-column: 3;
  grid-row: 1;
}

.bonus-pres {
  font-size: 20px;
  justify-self: start;
  text-align: center;
  grid-column: 1 / span 3;
  grid-row: 2;
  display: flex;
  gap: 20px;

}
.bonus{
  width: auto;
  height: 30px;
}
.value{
  position: absolute;
  right: 0;
  top: 50%;
  transform: translateY(-100%);
  font-size: 20px;
  color: var(--normalTextColor);
  font-weight: bold;
  z-index: 10;
  animation: slideDowntoUp 0.5s ease-in-out;

}
.bonus-cont{
  position: relative;
}
.positif{
  color: green;
}
.negatif{
  color: red;
}

</style>
