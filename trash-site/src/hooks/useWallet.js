import {
  ref, reactive, getCurrentInstance, toRefs,
} from 'vue';
import Web3, {utils} from 'web3';
import {ethers} from 'ethers'
import Web3Modal from 'web3modal';
import { getChainData } from '../web3/tools';
import { providerOptions } from '../web3/config';
import {useStore} from 'vuex'
import {reservedPossums, claimedPossums} from "../utils/web3Helpers.js"

const INITIAL_STATE = {
  web3: null, 
  provider: null,
  userAddress: '',
  connected: false,
  chainId: 1,
  networkId: 1, 
  ethersProvider: null,
  signer: null,
};


export default function UseWallet() {
  const { ctx: _this } = getCurrentInstance();

  const store = useStore();
  
  const walletObj = reactive({ ...INITIAL_STATE });
 
  const fetching = ref(false);
  const assets = ref(0);
  //https://github.com/Web3Modal/web3modal#web3modal

  const web3Modal = new Web3Modal({
    theme: 'dark',
    network: getChainData(walletObj.chainId).network,
    cacheProvider: true,
    providerOptions,
    show:true
  });

  
  // methods wallte.js
  const resetApp = async () => {
    const { web3, provider, ethersProvider} = walletObj;
   
    if (provider && ethersProvider && provider.disconnect) {
      await web3.currentProvider.disconnect();
    }

    web3Modal.clearCachedProvider();
    assets.value = 0;
    Object.keys(INITIAL_STATE).forEach((e) => {
      walletObj[e] = INITIAL_STATE[e];
    });
    _this.$forceUpdate();
    store.commit("clearCache");
  };

  async function getUserBalance () {    
    const ethersProvider = new ethers.providers.Web3Provider(walletObj.provider);
    const res = await ethersProvider.getBalance(walletObj.userAddress)
    const balance = (res ? ethers.utils.formatUnits(res) : 0);
    return balance
  }

  const getAccountAssets = async () => {
    fetching.value = true;
    // get account balances
    const balance = await getUserBalance();
    assets.value = balance;
    reservedPossums();
    claimedPossums();    
  };

  const subscribeProvider = async (provider) => {
    if (!provider.on) {
      return;
    }
    provider.on('close', () => resetApp());
    provider.on('accountsChanged', async (accounts) => {
      // eslint-disable-next-line prefer-destructuring
      walletObj.userAddress = accounts[0];
      await getAccountAssets();
    });
    provider.on('chainChanged', async (chainId) => {
      console.log('333', chainId);
      const networkId = await walletObj?.web3?.eth?.net.getId();
      walletObj.chainId = chainId;
      walletObj.networkId = networkId;
      await getAccountAssets();
      store.commit("updateWallet", walletObj);
    });
  };

  const onConnect = async () => {
  
    const provider = await web3Modal.connect();
    
    await subscribeProvider(provider);
    
    const web3 = new Web3(provider);
    
    const accounts = await web3.eth.getAccounts();

    const address = accounts[0];

    const networkId = await web3.eth.net.getId();

    const chainId = await web3.eth.getChainId(); // 坑逼 注意版本 chainId

    const ethersProvider = new ethers.providers.Web3Provider(provider);

    const ethersSigner = ethersProvider.getSigner()
  
    walletObj.web3 = web3;
    walletObj.provider = provider;    
    walletObj.connected = true;
    walletObj.userAddress = address;
    walletObj.chainId = chainId;
    walletObj.networkId = networkId;
    walletObj.ethersProvider = ethersProvider;
    walletObj.signer = ethersSigner;
    await getAccountAssets();
    
    store.commit("updateWallet", walletObj);

  };

  return {
    ...toRefs(walletObj),
    fetching,
    assets,
    resetApp,
    getAccountAssets,
    //
    web3Modal,
    // methods
    onConnect,
    walletObj,
  };
}
