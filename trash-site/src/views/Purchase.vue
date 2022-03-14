<template>
<div class="purchase mt-24">
   <h1 class="font-bold content-evenly text-white-light text-2xl"> 
     Purchase A Possum
      <div
        @click="connect"
        
        class="flex flex-row w-1/6 justify-center cursor-pointer items-center m-16 p-2 border-2 text-white-light border-blue-dark bg-blue-dark font-bold hover:text-white hover:bg-blue-light">
        <img
            src="https://upload.wikimedia.org/wikipedia/commons/3/36/MetaMask_Fox.svg" alt="MM"
            class="h-5 mr-2">
        Connect to Metamask
    </div>
   </h1>
</div>
</template>

<script>

import BlockchainConnect from '../utils/getWeb3';



export default {
  name:  'Purchase',
  components: {},
  setup() {
    const connect = () => {
  const blockChain = new BlockchainConnect();
  console.log("connect", blockChain)
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