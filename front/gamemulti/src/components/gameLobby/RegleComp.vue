<template>
  <div class="main-rule">
    <div class="skip">
      <skipRegle></skipRegle>
      <timerCircle class="timer" :counter="Math.floor(nextEvent-Date.now())" :size="60"></timerCircle>
    </div>
   
    <div>
      <h1>Présentation du Jeu de Questions-Réponses</h1>

      <p>Bienvenue dans ce <span class="highlight">jeu de questions-réponses</span> captivant ! L'objectif est simple : être le premier à atteindre <span class="good">100 points</span> pour remporter la partie.</p>
  
      <h2 class="section-title">Règles du Jeu</h2>
      
      <p>Chaque question est accompagnée de <span class="highlight">6 propositions</span>, mais attention, une seule est correcte !</p>
      
      <ul>
          <li><span class="good">Bonne réponse</span> : rapporte <span class="good">5 points</span>.</li>
          <li><span class="bad">Mauvaise réponse</span> : retire <span class="bad">2 points</span>.</li>
          <li>Il est possible de <span class="highlight">passer une question</span> pour ne pas perdre de points, mais cela met fin à toute série de bonnes réponses.</li>
      </ul>
  
      <h2 class="section-title">Streak et Points Bonus</h2>
  
      <p>Chaque série de <span class="good">3 bonnes réponses consécutives</span> vous offre <span class="good">1 point supplémentaire</span>, donc attention à bien enchaîner vos bonnes réponses pour maximiser vos points !</p>
  
      <h2 class="section-title">Thèmes et Difficulté</h2>
  
      <p>Les questions couvrent une variété de thèmes, et chaque question est notée selon un niveau de difficulté allant de <span class="highlight">1 à 10</span>. Plus la difficulté est élevée, plus la question pourra être stratégique !</p>
  
      <h2 class="section-title">Temps Imparti</h2>
  
      <p>Vous disposez d'un certain temps pour répondre à chaque question. Dès que <span class="highlight">tous les joueurs</span> ont répondu ou passé, la question prend fin et on passe à la suivante.</p>
  
      <h2 class="section-title">Condition de Victoire</h2>
  
      <p>Le premier joueur à atteindre ou dépasser <span class="good">100 points</span> met fin à la partie et remporte la victoire.</p>
  
      <p>Bonne chance à tous et que le meilleur gagne !</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { gameStore } from '@store/game';
import { computed, onMounted,ref } from 'vue';
import timerCircle from '@/components/gameRoom/divers/timerCircle.vue';
import skipRegle from './regle/skipRegle.vue';
const game=gameStore()
const nextEvent=computed(()=>game.gameQuestions.nextEvent)
onMounted(()=>{
  console.log('nextEvent,reglecomp',nextEvent,Math.floor(Date.now()-nextEvent.value))
})

</script>

<style scoped>
div{
  color: var(--normalTextColor);
  line-height: 1.6;
  max-width: 700px;
  max-height: calc(100vh - 100px);
  overflow-y: auto;
}
.main-rule{
  display: grid;
  grid-template: auto 1fr / auto;
  justify-items: center;
  margin: auto;
}
.timer{
  justify-self: end;
}
.highlight {
  color: #798605; /* Mettre en évidence avec une couleur distinctive */
  font-weight: bold;
}
.good {
  color: #32cd32; /* Couleur verte pour les bonnes réponses */
}
.bad {
  color: #ff0000; /* Couleur rouge pour les mauvaises réponses */
}
.section-title {
  font-size: 1.4em;
  margin-top: 20px;
  color: #696868;
  text-decoration: underline;
}
h1{
  font-size: 2em;
  margin-bottom: 20px;
  color: var(--main-green);
  text-align: center;
  
}
.skip{
  display: flex;
  justify-content: center;
  width: fit-content;
  align-items: center;
  gap: 10px;
  margin-top: 10px;
  justify-self: end;
}
@media (max-width: 700px){
  div{
    padding: 0 10px;
  }
  h1{
    font-size: 1.5em;
  }
  .section-title{
    font-size: 1.2em;
  }
  .skip{
    gap: 2px;
    padding: 0;
  }
  .timer{
    padding: 0;
  }
  
}

</style>