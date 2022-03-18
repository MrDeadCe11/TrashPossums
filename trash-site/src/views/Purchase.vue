<template>
<div class="purchase mt-24">      
  <div class="w-4/6 m-auto bg-gray-light rounded p-2">
    <div class="title sm:w-3/6 w-4/6 mb-3  m-auto text-clip">
    <h1 class="font-bold content-evenly text-white-light sm:text-6xl text-xl"> 
     Get you Some Possums
     </h1>
     </div>
       <div
        @click="connect"
        
        class="flex flex-row w-4/6 m-auto justify-center cursor-pointer items-center p-2 border-2 text-white-light border-blue-dark bg-blue-dark font-bold hover:text-white hover:bg-blue-light sm:">
        <img
            src="https://upload.wikimedia.org/wikipedia/commons/3/36/MetaMask_Fox.svg" alt="MM"
            class="h-5 mr-2">
        Connect to Metamask
    </div>
    </div>
   
</div>
</template>

<script>

import BlockchainConnect from '../utils/getWeb3';

export default {
  name:  'Purchase',
  components: {},
  mounted() {
  },
  setup() {
  const connect = () => {
  const blockChain = new BlockchainConnect();
 
  blockChain.connect();
    }

  return {connect}
  }
}
</script>

<style>
h1{
  font-family: "Banco";  
}
</style>