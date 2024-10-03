<template>
  <div class="wrapper-history">
    <h1>Historique</h1>
    <div :style="{width:'100%'}">
      <div v-if="userList.length>0" >
        <div class="wrapper-content">
          <div class="wrapper-interface">
            <button @click="changeIndex(false)" :class="{disabled:currentIndex===0 || userList.length===1}">Précédent</button>
            <div class="wrapper-name">
                <h3 ref="title">{{userList[currentIndex]?.name}}</h3>
              </div>
            <button @click="changeIndex()" :class="{disabled:currentIndex===userList.length-1 || userList.length===1}">Suivant</button>
          </div>
          <div v-for="(question,j) in historyCurrentUser" :key="`question${j}`" class="wrapper-question" >
            <div>
              <p>{{question.question}}</p>
            </div>
            <div :style="{alignSelf:'center',justifySelf:'end',minWidth:'calc(33%)',textAlign:'right'}" :class="{response:true,good:question.response?.answerIsCorrect,bad:!question.response?.answerIsCorrect}">
                <div>
                  {{question.response?.userResponse}}
                </div>
          </div>
          <div class="wrapper-bonus">
            <div class="bonus-element" v-for="(bonus,k) in question.response?.bonus.filter(el=>el.value!==0)" :key="`bon${k}`">
              <div>
                <div v-if="bonus.type==='faster'">
                  <Fast fill="var(--main-green)" :size="30" />
                </div>
                <div v-else-if="bonus.type==='fasterBad'">
                  <Fast fill="var(--main-red)" :size="30" />
                </div>
                <div v-else-if="bonus.type==='correct'">
                  <Happy fill="var(--main-green)" :size="30" />
                </div>
                <div v-else-if="bonus.type==='incorrect'">
                  <Sad fill="var(--main-red)" :size="30" />
                </div>
                <div v-else-if="bonus.type==='streak'">
                  <BullEyes fill="var(--main-green)" :size="30"/>
                </div>
                <div v-else>unknow</div>
            
              </div>
              <p class="bonus-value">{{bonus.value}}</p>
            </div>
          </div>
          </div>
        </div>
      </div>
      <div v-else>
        <p>Aucun historique à afficher</p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import BullEyes from '@/assets/SVG/BullEyes.vue'
import Fast from '@/assets/SVG/FastSvg.vue'
import Sad from '@/assets/SVG/SadSvg.vue'
import Happy from '@/assets/SVG/HappySvg.vue'
import type {History} from '@/models/room.model';
import { userStore } from '@store/user';
import {computed, defineProps,ref, useTemplateRef} from 'vue';

  const props=defineProps({
    history: {
      type:Object as ()=>History[],
      required:true
    }
  })

  const title=useTemplateRef('title')
  const user=userStore()
  const userList=ref([user.room.userList.find(u=>u.id===user.id),...user.room.userList.filter(u=>u.id!==user.id)])
  const historyCurrentUser=computed(()=>{
    const index=currentIndex.value
    return props.history.map(question=>{
      return {
        question:question.question,
        response:question.usersInfo.find(u=>u.user===userList.value[index]?.id),
      }
    })
  })
 const currentIndex=ref(0)
 function changeIndex(value=true){
    if(value){
      if(currentIndex.value===userList.value.length-1) return
      title.value?.classList.remove('animateRight')
      title.value?.classList.add('animateleft')
      currentIndex.value+=1
    }else{
      if(currentIndex.value===0) return
      title.value?.classList.remove('animateleft')
      title.value?.classList.add('animateRight')
      currentIndex.value-=1
    }
 }
</script>

<style scoped>
.list-enter-active,
.list-leave-active {
  transition: all 0.5s ease;
}
.list-enter-from,
.list-leave-to {
  opacity: 0;
  transform: translateX(30px);
}
.good{
  color: var(--main-green);
}
.bad{
  color: var(--main-red);
}
.wrapper-bonus{
  width: 100%;
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  align-items: center;
  gap: 3px;
}
.bonus-element{
  padding: 10px;
  position: relative;
}
.wrapper-history{
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 5px;
  flex-direction: column;
}
.wrapper-content{
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  gap: 10px;
}
.disabled{
  background-color: grey !important;
  cursor: default !important;
}
.wrapper-interface{
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 10px;
  transition: all 0.5s;
}
.wrapper-interface button{
  padding: 5px;
  width: 100px;
  border-radius: 5px;
  background-color: goldenrod;
  color: white;
  border: none;
  cursor: pointer;
}
.wrapper-name{
  width: 30%;
  display: flex;
  justify-content: center;
  align-items: center;
  border: 1px solid var(--main-green);
  border-radius: 5px;
  padding: 5px;
  color: white;
  font-size: 20px;
  text-align: center;
  overflow: hidden;

}
.response{
  grid-row: 1/span2;
  grid-column: 2;
}
.wrapper-question{
  width: 100%;
  display: grid;
  grid-template: auto auto / auto auto;
  box-shadow: 0px 0px 5px 0px white;
  padding: 10px;
}
.bonus-value{
  position: absolute;
  right: 7px;
  top: 5px;
  color: white;
  font-size: 16px;
}
.animateleft{
  animation: slideLeft 0.5s;
}
.animateRight{
  animation: slideRight 0.5s;
}
@keyframes slideLeft {
  from {
    transform: translateX(100%);
  }
  to {
    transform: translateX(0);
  }
}
@keyframes slideRight {
  from {
    transform: translateX(-100%);
  }
  to {
    transform: translateX(0);
  }
}
@media  (max-width: 768px) {
  .wrapper-question{
    grid-template: auto auto / auto;
  }
  .wrapper-history{
    font-size: 12px;
  }
  .wrapper-bonus{
    gap: 0;
  }
  .wrapper-question{
    padding: 5px;
  }
  .bonus-element{
    padding: 5px;
  }
  .bonus-value{
    top:0;
    right: 2px;
  }
  .wrapper-name{
    font-size: 16px;
  }
}
</style>