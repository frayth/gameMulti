<template>
  <div :class="{'option-element-container':true,'no-input':!editable}">
    <div class="message-element">{{ message }}:</div>
    <input type="range" :min :max :step v-model="model" @input="test" v-if="editable" :disabled="disable">
    <div class="value-element">{{model}}</div>
  </div>
</template>

<script setup lang="ts">
import type { PropType } from 'vue';
defineProps({
  min:{
    type:Number,
    required:true
  },
  max:{
    type:Number,
    required:true
  },
  step:{
    type:Number,
    required:true
  },
  message:{
    type:String,
    required:true
  },
  editable:{
    type:Boolean,
    default:true
  },
  disable:{
    type:Boolean,
    default:false
  }
  
})
const model=defineModel({
  type: [String] as PropType<String>
})
const emits=defineEmits(['update'])
function test(){
  emits('update')
}
</script>

<style scoped>
input[type="range"] {
  appearance: none;
  width: 150px;
  height: 8px;
  border: 1px solid #333333;
  border-radius: 9999px;
  background: white;
  cursor: pointer;
}

input[type="range"]::-webkit-slider-thumb {
  -webkit-appearance: none;
  appearance: none;
  width: 12px;
  height: 25px;
  border: 4px solid #333333;
  border-radius: 9999px;
  background: var(--main-green);
  box-shadow: none;
}

/* Thumb: for Firefox */
input[type="range"]::-moz-range-thumb {
  width: 115px;
  height: 31px;
  border: 4px solid #333333;
  border-radius: 9999px;
  background: #06b6d4;
  box-shadow: none;
}
.option-element-container{
  display:grid;
  width: fit-content;
  align-self: center;
  grid-template: auto auto / auto auto;
  align-items: center;
  column-gap: 5px;
}
.no-input{
  grid-template:auto /1fr auto auto !important;
  width: 100%;
  justify-content: end;
}

.message-element{
  grid-column: 1/span 2;
  grid-row: 1;
  justify-self: start;
}
.value-element{
  width: 50px;
  height: 30px;
  display: flex;
  justify-content: center;
  align-items: center;
  text-align: center;
  background-color: var(--main-green);
  font-size: 14px;
  border-radius: 5px;
  color: var(--normalTextColor);
}
</style>