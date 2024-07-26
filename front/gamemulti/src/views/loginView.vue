<template>
  <div class="main-form" >
      <p>Veuillez choisir un speudo pour vous authentifier auprès des autres joueurs.</p>
        <div class="input-container">
            <label for="pseudo">Pseudo</label>
            <input type="text" id="pseudo" name="pseudo" v-model="speudo" @input="testLength">
            <button @click="userStorage.login(speudo,userStorage.token)">Valider</button>
        </div>  
  </div>
</template>

<script setup lang="ts">
import { userStore } from '@/stores/user';
import { ref } from 'vue';
const userStorage= userStore();
const speudo = ref('');
const maxSpeudoLength = 20;
function testLength(){
  if(speudo.value.length>maxSpeudoLength){
    speudo.value = speudo.value.slice(0,maxSpeudoLength)
  }
}

</script>

<style scoped>
.main-form{
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  margin-top: 100px;
  gap: 20px;
}
.input-container{
  display: flex;
  flex-direction: column;
  margin-bottom: 20px;
}
.input-container label{
  font-size: 20px;
  margin-bottom: 10px;
}
.input-container input{
  width: 100%;
  height: 30px;
  font-size: 20px;
  outline: none;
}
button{
  width: 100%;
  height: 30px;
  font-size: 20px;
  background-color: #4CAF50;
  color: white;
  border: none;
  cursor: pointer;
}
.errorMessage{
  color: red;
  display: none;
}
</style>