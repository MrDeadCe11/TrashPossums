import { createStore } from 'vuex';



const store = createStore({

    // walletObj.web3 = web3;
    // walletObj.provider = provider;    
    // walletObj.connected = true;
    // walletObj.userAddress = address;
    // walletObj.chainId = chainId;
    // walletObj.networkId = networkId;
    // walletObj.ethersProvider = ethersProvider;
    // walletObj.signer = ethersSigner;
   state: {
    web3: null,
    provider: null,
    connected: false,
    userAddress: '',
    chainId: null,
    networkId: null,
    ethersProvider: null,
    signer: '',
    reservedPossums: null,
    claimedPossums: null,
    contractAddress: "0x24c9B9B9348BB80ec2427D198e47D6fd787a3bEf",
    trashABI: "../artifacts/contracts/TrashPossums.sol/TrashPossums.json"
    
 },
 mutations: {
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
     setnetworkId(state, networkId){
        state.networkId = networkId;
     },
     setethersProvider(state, ethersProvider){
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
 },
 actions: {},
    modules: {
    },
})

export default store;
