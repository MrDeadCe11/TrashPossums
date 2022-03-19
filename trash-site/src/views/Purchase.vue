<template>
<div class="purchase mt-24">      
  <div class="w-4/6 m-auto bg-gray-light rounded p-2">
    <div class="title sm:w-3/6 w-4/6 mb-3  m-auto text-clip">
    <h1 class="font-bold content-evenly ml-10 text-white-light sm:text-6xl text-xl"> 
           Get you Some Possums
     </h1>
     </div>
       <div
        @click="connect"
        
        class="flex flex-row w-3/6 h-16 m-auto mb-3 justify-center cursor-pointer items-center p-2 border-2 text-white-light border-blue-dark bg-blue-dark font-bold hover:text-white hover:bg-blue-light sm:">
        <img
            src="https://upload.wikimedia.org/wikipedia/commons/3/36/MetaMask_Fox.svg" alt="MM"
            class="h-5 mr-2">
       <h1 class="text-xl"> Connect to Wallet </h1>
    </div>
    <div class="flex w-full h-auto">
     
      <span class="mb-3 h-24 w-full align-middle">
        <form class="m-auto h-auto w-1/2">
          <button class="bg-blue-light ml-20 w-1/6"><h1 class="text-4xl text-white-light">-</h1></button>
          <span>{{numberField}}</span>
          <input type="text" v-model.number="numberField" class="text-right w-1/4 text-4xl"/>
          <button class="bg-blue-light w-1/6"><h1 class="text-align-middle text-4xl text-white-light">+</h1></button>
          <button class="bg-blue-dark w-1/6 h-10 ml-5 text-white-light text-"><h1 class="text-bold text-xl">SUBMIT</h1></button>
        </form>
      </span>
    
    </div>
    </div>
   
</div>
</template>

<script>

import BlockchainConnect from '../utils/getWeb3';
import store from '../store';

export default {
  name:  'Purchase',
  components: {},
  mounted() {
  },
  setup() {
  let numberField = ""
  const connect = () => {
      const blockChain = new BlockchainConnect(); 
      blockChain.connect();
      if(blockChain.provider){
        store.commit("setProvider", blockChain.provider);
        console.log("PROVIDER",store.provider)
        
      }
    }
  const submit = () =>{

    }

  return {connect, numberField}
  }
}
</script>

<style>
h1{
  font-family: "Banco";  
}
</style>