import { ref, reactive, getCurrentInstance, toRefs, markRaw } from "vue";
import Web3, { utils } from "web3";
import { ethers } from "ethers";
import Web3Modal from "web3modal";
import { getChainData } from "../web3/tools";
import { providerOptions } from "../web3/config";
import { useStore } from "vuex";
import {
  reservedPossums,
  claimedPossums,
  getClaimDate,
  getCurrentStamp,
  getClaimedPossumsIds,
  getOffset,
  getPossumPrice,
  getBaseUri,
} from "../utils/web3Helpers.js";
import contractAbi from "../../../artifacts/contracts/TrashPossums.sol/TrashPossums.json";
import randomAbi from "../../../artifacts/contracts/Randomness.sol/Randomness.json";

const INITIAL_STATE = {
  web3: null,
  provider: null,
  userAddress: "",
  connected: false,
  chainId: 1,
  networkId: 1,
  ethersProvider: null,
  signer: null,
  trashpossums: null,
  randomness: null,
};

export default function UseWallet() {
  const { ctx: _this } = getCurrentInstance();

  const store = useStore();

  const walletObj = reactive({ ...INITIAL_STATE });

  const fetching = ref(false);
  const assets = ref(0);
  //https://github.com/Web3Modal/web3modal#web3modal

  const web3Modal = new Web3Modal({
    theme: "dark",
    network: getChainData(walletObj.chainId).network,
    cacheProvider: true,
    providerOptions,
    show: true,
  });

  // methods wallte.js
  const resetApp = async () => {
    const { web3, provider, ethersProvider } = walletObj;

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

  async function getUserBalance() {
    const ethersProvider = new ethers.providers.Web3Provider(window.ethereum);
    const res = await ethersProvider.getBalance(walletObj.userAddress);
    const balance = res ? ethers.utils.formatUnits(res) : 0;
    return balance;
  }

  const getAccountAssets = async () => {
    fetching.value = true;
    const balance = await getUserBalance();
    assets.value = balance;

    await getBaseUri(walletObj.trashpossums);
    await getClaimDate(walletObj.randomness);
    await getCurrentStamp(walletObj.ethersProvider);
    await getPossumPrice(walletObj.trashpossums, walletObj.userAddress);
    try {
      await getOffset(walletObj.randomness);
    } catch (err) {
      console.log(err);
    }
    try {
      await reservedPossums(walletObj.trashpossums, walletObj.userAddress);
    } catch (error) {
      console.log(error);
    }

    try {
      await claimedPossums(walletObj.trashpossums, walletObj.userAddress);
    } catch (error) {
      console.log(error);
    }

    try {
      await getClaimedPossumsIds(walletObj.trashpossums, walletObj.userAddress);
    } catch (error) {
      console.log(error);
    }
  };

  const subscribeProvider = async (provider) => {
    if (!provider.on) {
      return;
    }
    provider.on("close", () => resetApp());
    provider.on("accountsChanged", async (accounts) => {
      // eslint-disable-next-line prefer-destructuring
      walletObj.userAddress = accounts[0];
      await getAccountAssets();
    });
    provider.on("chainChanged", async (chainId) => {
      console.log("333", chainId);
      const networkId = await walletObj?.web3?.eth?.net.getId();
      walletObj.chainId = chainId;
      walletObj.networkId = networkId;
      await getAccountAssets();
      store.commit("updateWallet", walletObj);
    });
  };

  // targets mumbai chain, id 80001
  const targetNetworkId = "0x13881";

  // checks if current chain matches with the one we need
  // and returns true/false
  const checkNetwork = async () => {
    if (window.ethereum) {
      const currentChainId = await window.ethereum.request({
        method: "eth_chainId",
      });
      console.log("network check", currentChainId, targetNetworkId);
      // return true if network id is the same
      if (currentChainId == targetNetworkId) return true;
      // return false is network id is different
      switchNetwork();
      return false;
    }
  };

  // switches network to the one provided
  const switchNetwork = async () => {
    await window.ethereum.request({
      method: "wallet_switchEthereumChain",
      params: [{ chainId: targetNetworkId }],
    });
    // refresh
    window.location.reload();
  };

  const subscribeContract = async (contract) => {
    if (!contract.on) {
      return;
    }
    contract.on("Reserved", () => {
      console.log("POSSUM RESERVED");
      reservedPossums(walletObj.trashpossums, walletObj.userAddress);
    });
    contract.on("Transfer", () => {
      console.log("possum claimed");
      try {
        claimedPossums(walletObj.trashpossums, walletObj.userAddress);
      } catch (err) {
        console.error(err);
      }
      try {
        reservedPossums(walletObj.trashpossums, walletObj.userAddress);
      } catch (err) {
        console.error(err);
      }
      try {
        getClaimedPossumsIds(walletObj.trashpossums, walletObj.userAddress);
      } catch (error) {
        console.log(error);
      }
    });
  };

  const onConnect = async () => {
    const provider = await web3Modal.connect();

    await subscribeProvider(provider);

    const web3 = new Web3(provider);

    const accounts = await web3.eth.getAccounts();

    const address = accounts[0];

    const networkId = await web3.eth.net.getId();

    const chainId = await web3.eth.getChainId();

    const ethersProvider = new ethers.providers.Web3Provider(window.ethereum);
    await ethersProvider.ready;

    const ethersSigner = ethersProvider.getSigner();

    const trashAddress = import.meta.env.VITE_TRASHPOSSUMS_ADDRESS
    
    const trashPossumsContract = new ethers.Contract(
      trashAddress,
      contractAbi.abi,
      ethersSigner
    );

    const randomnessAddress = import.meta.env.VITE_RANDOMNESS_ADDRESS

    const randomnessContract = new ethers.Contract(
      randomnessAddress,
      randomAbi.abi,
      ethersSigner
    );

    await subscribeContract(trashPossumsContract);

    walletObj.web3 = web3;
    walletObj.provider = provider;
    walletObj.connected = true;
    walletObj.userAddress = address;
    walletObj.chainId = chainId;
    walletObj.networkId = networkId;
    walletObj.ethersProvider = markRaw(ethersProvider);
    walletObj.signer = markRaw(ethersSigner);
    walletObj.trashpossums = markRaw(trashPossumsContract);
    walletObj.randomness = markRaw(randomnessContract);
    store.commit("updateWallet", walletObj);
    await checkNetwork();
    await getAccountAssets();
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
