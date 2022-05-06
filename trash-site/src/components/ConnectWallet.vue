<template>
 <div
        @click="handleWalletConnect"
        
        class="flex flex-row w-3/6 h-16 m-auto mb-3 justify-center cursor-pointer items-center p-2 border-2 text-white-light border-blue-dark bg-blue-dark font-bold hover:text-white hover:bg-blue-light sm:">
        <!-- <img
            src="https://upload.wikimedia.org/wikipedia/commons/3/36/MetaMask_Fox.svg" alt="MM"
            class="h-5 mr-2"> -->
       <h1 class="text-xl"> Connect your Wallet </h1>
    </div>
  <!-- <div>  
    <button class="text-white-light bg-gray-dark m-2 rounded-md p-5" @click="reset"><h1>Reset App</h1></button><br>
    <button class="text-white-light bg-gray-dark m-2 rounded-md p-5" @click="getAccountAssets"><h1>get Balance</h1></button>    
  </div> -->
</template>

<script>

import { computed, ref } from 'vue';
import { utils } from 'web3';
import {ethers} from 'ethers';
import useWallet from '../hooks/useWallet';
import { useStore } from 'vuex';
import { reservedPossums } from '../utils/web3Helpers';

export default {
  setup() {
const store = useStore();

const {
  onConnect,
  connected,
  resetApp,
  assets,
  getAccountAssets,
  walletObj
} = useWallet();

const handleWalletConnect = async () => {
console.log("clicked handlewallet")
  await onConnect();
  
  if (connected) {
    console.log('afterConnectedWallet', connected);
     }
};

const reset = () => {
resetApp();
}


return {
  connect : computed(()=>store.getters.getConnected),
  web3: computed(()=> store.getters.getWeb3),
  userAddress: computed(()=> store.getters.getAddress),
  chainId: computed(()=> store.getters.getChainId),
  networkId: computed(()=> store.getters.getNetworkId),
  resetApp: resetApp,
  assets: assets,
  getAccountAssets,
  handleWalletConnect,
  reset
  }
 }
}
// function approve() {
//   return contract.value.methods
//     .approve(USDT_ADDRESS, utils.toHex(utils.toWei('1000000000000000000000000000', 'gwei')))
//     .send({ from: userAddress.value });
// }

// .....
</script>