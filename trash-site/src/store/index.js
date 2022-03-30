import { createStore } from 'vuex';


const state = {
    web3: null, 
    provider: null,
    userAddress: '',
    connected: false,
    chainId: 1,
    networkId: 1, 
    ethersProvider: null,
    signer: null,
    reservedPossums: null,
    claimedPossums: 0,
    contractAddress: "0x24c9B9B9348BB80ec2427D198e47D6fd787a3bEf",
    trashABI: "../artifacts/contracts/TrashPossums.sol/TrashPossums.json"
}

const mutations = {
    clearCache(state){
        state.web3 = null,  
        state.provider = null,
        state.userAddress = '',
        state.connected = false,
        state.chainId = 1,
        state.networkId = 1, 
        state.ethersProvider = null,
        state.signer = null,
        state.reservedPossums = null,
        state.claimedPossums = 0

    },
    updateWallet(state, payload){
        state.web3 = payload.web3;
        state.provider = payload.provider;
        state.connected = payload.connected;
        state.userAddress = payload.userAddress;
        state.chainId = payload.chainId;
        state.networkId = payload.networkId;
        state.ethersProvider = payload.ethersProvider;
        state.signer = payload.signer;
        state.provider = payload.provider;
    },
    setWeb3(state, web3){
        state.web3 = web3;
     },
    setProvider(state, provider){
        state.provider = provider;
      },
    setConnected(state, connected){
        state.connected = connected;
      },
    setAddress(state, userAddress){
        state.userAddress = userAddress;
    },
    setChainId(state, chainId){
        state.chainId = chainId;
    },  
    setNetworkId(state, networkId){
        state.networkId = networkId;
    },
    setEthersProvider(state, ethersProvider){
        state.ethersProvider = ethersProvider;
    },
    setSigner(state, signer){
        state.signer = signer
    },
    setProvider(state, provider){
        state.provider = provider
    },
    setReservedPossums(state, reservedPossums){
        state.reservedPossums = reservedPossums
    },
    setClaimedPossums(state, claimedPossums){
        state.claimedPossums = claimedPossums
    }
}

const getters = {
    getConnected(state){
        return state.connected
    },
    getWeb3(state){
        return state.web3
    },
    getProvider(state){
        return state.provider;
    },
    getAddress(state){
        return state.userAddress;
    },
    getChainId(state){
        return state.chainId;
    },
    getNetworkId(state){
        return state.chainId;
    },
    getEthersProvider(state){
        return state.ethersProvider;
    },
    getSigner(state){
        return state.signer
    },
    getProvider(state){
        return state.provider
    },
    getReservedPossums(state){
        return state.reservedPossums
    },
    getClaimedPossums(state){
        return state.claimedPossums
    },
    getContractAddress(state){
        return state.contractAddress;
    },
    getTrashAbi(state){
        return state.trashABI;
    }
}

const actions = {

}

export default createStore({
    state,
    getters,
    actions,
    mutations,
})