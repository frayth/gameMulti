<template>
  <div class="main-form" >
      <p>Veuillez choisir un pseudo pour vous authentifier auprès des autres joueurs.</p>
        <div class="input-container">
            <label for="pseudo">Pseudo</label>
            <input type="text" id="pseudo" name="pseudo" v-model="speudo" @input="testLength" @keypress.enter="login">
            <div :style="{position:'relative'}">
              <button @click="login" >Valider</button>
              <div v-if="error" class="error">
                <p>Il semble que ce speudo soit déja pris 🙁 </p>
              </div>
            </div>

        </div>  
  </div>
</template>

<script setup lang="ts">
import { userStore } from '@/stores/user';
import { ref } from 'vue';
import { gameStore } from '@store/game';
const game = gameStore();
game.resetGame();
const userStorage= userStore();
const speudo = ref('');
const error=ref(false)
const maxSpeudoLength = 20;
function testLength(){
  if(speudo.value.length>maxSpeudoLength){
    speudo.value = speudo.value.slice(0,maxSpeudoLength)
  }
  error.value=false
}
async function login(){
  const response= await userStorage.login(speudo.value,userStorage.token)
  if(!response){
    error.value=true
  }
}
</script>

<style scoped>
.error{
  color: var(--main-red);
  display: flex;
  justify-content: center;
  align-items: center;
  margin-top: 10px;
  animation: popUp 0.3s;
  position: absolute
}
.main-form{
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  margin-top: 100px;
  gap: 20px;
  text-align: center;
}
.input-container{
  display: flex;
  flex-direction: column;
  margin-bottom: 20px;
  gap: 10px;
}
.input-container label{
  font-size: 20px;
  margin-bottom: 10px;
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

#pseudo{
  width: 100%;
  font-size: 20px;
  outline: none;
  border: 1px solid grey;
  border-radius: 10px;
  background-color: var(--color-background);
  padding: 10px;
  color: var(--normalTextColor);
  text-align: center;
}
#pseudo:focus{
  border: 1px solid var(--main-green);
}
@keyframes popUp{
  0%{
    opacity: 0;
    transform: translateY(-50px)
  }
  50%{
    opacity: 0;

  }
  100%{
    opacity: 1;
    transform: translateY(0)
  }
}

</style>