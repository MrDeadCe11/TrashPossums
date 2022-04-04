<template>
<div class="purchase mt-40 container items-center flex mx-auto">      
  <div class="w-4/5 mb-10 p-5 mx-auto bg-gray-light rounded-xl">
    <div class="title mb-3">      
    <h1 class="font-bold w-auto text-white-light text-center sm:text-5xl text-xl"> 
           Get you some possums
     </h1>  
     </div>
     <div v-if="!connected">
      <connect-wallet/>
    </div>
    
    <div v-else class="flex h-auto w-auto justify-center">     
       <form @submit.prevent="submit">
         <div class="mx-auto inline-flex justify-center">
          <button class="bg-blue-light w-1/6 h-14 rounded-l-xl" @click="decrement"><h1 class="text-4xl text-white-light">-</h1></button>                    
          <input type="number"  v-model="numberField" min="1" max="27" id="numberField" class="text-center w-1/4 h-14 text-4xl"/>          
          <button class="bg-blue-light w-1/6 h-14 rounded-r-xl" @click="increment"><h1 class="text-align-middle text-4xl text-white-light">+</h1></button>  
          </div>
          <div class="flex mx-auto justify-center">
           <button type="submit" class="bg-blue-dark mt-3 w-auto mx-auto text-white-light rounded-xl p-5"><h1 class="text-bold text-xl">SUBMIT</h1></button>
           </div>
           <div class="">
           <p class="text-white-light text-center font-extrabold text-xl mt-3">Max of 27 possums per wallet</p>
          </div>
    
    </form>
    </div>
    </div>
    
   
</div>
</template>

<script>


import {useStore} from 'vuex'
import {computed, watchEffect, ref} from 'vue'
import ConnectWallet from '../components/ConnectWallet.vue';


export default {
  name:  'Purchase',
  components: {ConnectWallet},
  watch: {
  },
  setup() {

  const store = useStore();
 
  let numberField = ref(0)

   const modifyable =  watchEffect(()=>{
    if (numberField.value >=0 && numberField.value <= 27){
      console.log("true")
      return true
    } else {
      console.log("false")
      return false
    }
  })
  
  const increment = () => {
    if(modifyable){
    console.log("++", numberField.value)
    numberField.value++}
    else{
    numberField.value = 27
    }}

  const decrement = () => {
    if(modifyable){
    console.log("--", numberField.value)
    numberField.value--}
    
    else {
      numberField.value= 0
    }
  }

  return {
      connected: computed(()=>store.getters.getConnected),
      numberField,
      increment,
      decrement}
  }
}
</script>

<style>
h1{
  font-family: "Banco";  
}
</style>