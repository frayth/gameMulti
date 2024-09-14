import { defineStore } from 'pinia'
import pop from '@/assets/Audio/pop.wav'
import type {Sound} from '@/models/audio.model'

export const audioStore = defineStore('audio', () => {
function playSound(sound:Sound){
    switch (sound) {
        case 'pop':
            new Audio(pop).play()
            break;
    
        default:
            break;
    }
}

  return {playSound }
})
