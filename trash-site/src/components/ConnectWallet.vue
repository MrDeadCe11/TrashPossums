<template>
 <div
        @click="handleWalletConnect"
        
        class="flex flex-row w-3/6 h-16 m-auto mb-3 justify-center cursor-pointer items-center p-2 border-2 text-white-light border-blue-dark bg-blue-dark font-bold hover:text-white hover:bg-blue-light sm:">
        <img
            src="https://upload.wikimedia.org/wikipedia/commons/3/36/MetaMask_Fox.svg" alt="MM"
            class="h-5 mr-2">
       <h1 class="text-xl"> Connect to Wallet </h1>
    </div>
  <div>  
    <button @click="resetApp">resetApp</button>
    <button @click="getAccountAssets">getBalance</button>
    <button @click="approve">approveUSDTContract</button>
    <p>
      Address:
      {{ userAddress }}
    </p>
    <p>balance:{{ assets }}</p>
    <p>networkId: {{ networkId }}</p>
    <p>chainId: {{ chainId }}</p>
  </div>
</template>

<script setup>

import { computed } from 'vue';
import { utils } from 'web3';
import {ethers} from 'ethers';
import useWallet from '../hooks/useWallet';
// import { USDT_API } from '../web3/abis';
// import { USDT_ADDRESS } from '../web3/config';

const {
  onConnect,
  connected,
  web3,
  userAddress,
  chainId,
  networkId,
  resetApp,
  assets,
  getAccountAssets,
} = useWallet();

const handleWalletConnect = async () => {
  await onConnect();
  if (connected) {
    console.log('afterConnectdWallet', connected);
  }
};

const contract = computed(
  () => new web3.value.eth.Contract(USDT_API, USDT_ADDRESS),
);

function approve() {
  return contract.value.methods
    .approve(USDT_ADDRESS, utils.toHex(utils.toWei('1000000000000000000000000000', 'gwei')))
    .send({ from: userAddress.value });
}
// .....
</script>