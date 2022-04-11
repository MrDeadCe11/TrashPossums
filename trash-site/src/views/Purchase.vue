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
           <button v-if="!res" type="submit" :disabled="res" @click="submitPurchase" class=" bg-blue-dark mt-3 w-auto mx-auto text-white-light rounded-xl p-5"><h1 class="text-bold text-xl">RESERVE</h1></button>
           </div>
           <div class="">
          
          </div>
           <div class="flex text-white-light text-2xl justify-center">
      <p><h1>You have <span class="text-yellow-light text-4xl">{{reservedPossums}} </span> possums reserved</h1></p>

    </div>
    </form>   
    
    </div>
     <p class="text-white-light text-center font-extrabold text-xl mt-3">Max of 27 possums per wallet</p>
    </div>
    
    
   
</div>
</template>

<script>


import {useStore} from 'vuex'
import {computed, watchEffect, ref} from 'vue'
import ConnectWallet from '../components/ConnectWallet.vue';
// import {ethers} from 'ethers';
// import contractAbi from "../../../artifacts/contracts/TrashPossums.sol/TrashPossums.json"
import {reservePossums, reservedPossums} from "../utils/web3Helpers.js"



export default {
  name:  'Purchase',
  components: {ConnectWallet},
  watch: {
  },
  
  setup() {

  const store = useStore();
 
  let numberField = ref(0);
  let res = ref(false);

   const modifyable =  computed(()=>{
    if (numberField.value >= 0 && numberField.value <= 27){    
      return true
    } else {      
      return false
    }
  })

  

  const toggleRes = () => {   
    res.value ? res.value = false: res.value = true;
    return res.value
  }
  
  async function submitPurchase(e){
    if(numberField.value>0){
    console.log("submit clicked");    
    e.preventDefault();
    toggleRes();
    try{
    await reservePossums(numberField.value);
    await reservedPossums(); 
    } catch(error){
      console.error(error)
    }
    toggleRes();
       
  }
   else {
     console.log("need to reserve more than zero possums")
   }
  }
  
  const increment = () => {
    if(modifyable.value){    
    numberField.value++
    }else if(!modifyable.value && numberField.value >26){    
    numberField.value = 27
    }else if(!modifyable.value && numberField.value < 1){    
    numberField.value = 0
    }    
    }

  const decrement = () => {
    if(modifyable.value){
     numberField.value--
     } else if(!modifyable.value && numberField.value < 1){
      numberField.value= 0
    } else if(!modifyable.value && numberField.value > 26){
      numberField.value = 27
    }
  }

  return {
      connected: computed(()=>store.getters.getConnected),     
      reservedPossums: computed(()=>store.getters.getReservedPossums),
      numberField,
      increment,
      decrement,
      res,
      submitPurchase}
  }
}
</script>

<style>
h1{
  font-family: "Banco";  
}
</style>