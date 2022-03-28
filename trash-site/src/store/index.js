import { createStore } from 'vuex';



const store = createStore({
   state: {
    account: null,
    signer: null,
    provider: null,
    chainId: null,
    reservedPossums: null,
    claimedPossums: null,
    contractAddress: "0x24c9B9B9348BB80ec2427D198e47D6fd787a3bEf",
    trashABI: "../artifacts/contracts/TrashPossums.sol/TrashPossums.json"
    
 },
 mutations: {
     setChainId(state, chainId){
         state.chainId = chainId
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
