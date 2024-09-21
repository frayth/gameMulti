<template>
  <div>
    <h1>Historique</h1>
    <div>
      <h2>Votre historique</h2>
      <div v-if="userList.length>0" >
        <div v-for="(user,i) in userList" :key="i">
          <h3>{{user?.name}}</h3>
          <div v-for="(question,j) in historyCurrentUser" :key="j">
            <div>
              <p>{{question.question}}</p>
            </div>
            <div>
              <p>{{question.response?.userResponse}}</p>
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
import type {History} from '@/models/room.model';
import { userStore } from '@store/user';
import {computed, defineProps,ref} from 'vue';

  const props=defineProps({
    history: {
      type:Object as ()=>History[],
      required:true
    }
  })
  const user=userStore()
  const userList=ref([user.room.userList.find(u=>u.id===user.id),...user.room.userList.filter(u=>u.id!==user.id)])
  const historyCurrentUser=computed(()=>{
    return props.history.map(question=>{
      return {
        question:question.question,
        response:question.usersInfo.find(u=>u.user===user.id),
      }
    })
  })
 const currentIndex=ref(0)
</script>

<style scoped>

</style>