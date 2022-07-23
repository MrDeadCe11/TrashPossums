import { createStore } from "vuex";
import { reservedPossums } from "../utils/web3Helpers.js";

const state = {
  web3: null,
  provider: null,
  userAddress: "",
  connected: false,
  chainId: 1,
  networkId: 1,
  ethersProvider: null,
  signer: null,
  reservedPossums: 0,
  claimedPossums: 0,
  contractAddress: "0x3C39044c3c17f34E01f7008bE4908123280Ea306",//import.meta.env.VITE_TRASHPOSSUMS_ADDRESS,
  randomnessAddress: "0xc580cE5162bD7482694166e1a8b0f6D896dC45D1",//import.meta.env.VITE_RANDOMNESS_ADDRESS,
  claimDate: 0,
  currentStamp: 0,
  claimable: false,
  offset: 0,
  claimedIds: null,
  possumPrice: 0,
  trashpossums: null,
  randomness: null,
  baseURI: "",
  baseCID: import.meta.env.VITE_IPFSCID
};

const mutations = {
  clearCache(state) {
    (state.web3 = null),
      (state.provider = null),
      (state.userAddress = ""),
      (state.connected = false),
      (state.chainId = 1),
      (state.networkId = 1),
      (state.ethersProvider = null),
      (state.signer = null),
      (state.reservedPossums = null),
      (state.claimedPossums = 0),
      (state.claimDate = 0),
      (state.currentStamp = 0);
  },
  updateWallet(state, payload) {
    state.web3 = payload.web3;
    state.provider = payload.provider;
    state.connected = payload.connected;
    state.userAddress = payload.userAddress;
    state.chainId = payload.chainId;
    state.networkId = payload.networkId;
    state.ethersProvider = payload.ethersProvider;
    state.signer = payload.signer;
    state.provider = payload.provider;
    state.trashpossums = payload.trashpossums;
    state.randomness = payload.randomness;
    state.baseURI = payload.baseURI;
  },
  setWeb3(state, web3) {
    state.web3 = web3;
  },
  setProvider(state, provider) {
    state.provider = provider;
  },
  setConnected(state, connected) {
    state.connected = connected;
  },
  setAddress(state, userAddress) {
    state.userAddress = userAddress;
  },
  setChainId(state, chainId) {
    state.chainId = chainId;
  },
  setNetworkId(state, networkId) {
    state.networkId = networkId;
  },
  setEthersProvider(state, ethersProvider) {
    state.ethersProvider = ethersProvider;
  },
  setSigner(state, signer) {
    state.signer = signer;
  },
  setProvider(state, provider) {
    state.provider = provider;
  },
  setReservedPossums(state, reservedPossums) {
    state.reservedPossums = reservedPossums;
  },
  setClaimedPossums(state, claimedPossums) {
    state.claimedPossums = claimedPossums;
  },
  setClaimDate(state, claimDate) {
    state.claimDate = claimDate;
  },
  setCurrentStamp(state, currentStamp) {
    state.currentStamp = currentStamp;
  },
  setClaimable(state, claimable) {
    state.claimable = claimable;
  },
  setOffset(state, offset) {
    state.offset = offset;
  },
  setClaimedIds(state, Ids) {
    state.claimedIds = Ids;
  },
  setPossumPrice(state, price) {
    state.possumPrice = price;
  },
  setTrashpossums(state, trashContract) {
    state.trashpossums = trashContract;
  },
  setRandomness(state, randomness) {
    state.randomness = randomness;
  },
  setBaseURI(state, uri) {
    state.baseURI = uri;
  },
};

const getters = {
  getConnected(state) {
    return state.connected;
  },
  getWeb3(state) {
    return state.web3;
  },
  getProvider(state) {
    return state.provider;
  },
  getAddress(state) {
    return state.userAddress;
  },
  getChainId(state) {
    return state.chainId;
  },
  getNetworkId(state) {
    return state.chainId;
  },
  getEthersProvider(state) {
    return state.ethersProvider;
  },
  getSigner(state) {
    return state.signer;
  },
  getProvider(state) {
    return state.provider;
  },
  getReservedPossums(state) {
    return state.reservedPossums;
  },
  getClaimedPossums(state) {
    return state.claimedPossums;
  },
  getContractAddress(state) {
    return state.contractAddress;
  },
  getClaimDate(state) {
    return state.claimDate;
  },
  getCurrentStamp(state) {
    return state.currentStamp;
  },
  getRandomnessAddress(state) {
    return state.randomnessAddress;
  },
  getClaimable(state) {
    return state.claimable;
  },
  getOffset(state) {
    return state.offset;
  },
  getClaimedIds(state) {
    return state.claimedIds;
  },
  getPossumPrice(state) {
    return state.possumPrice;
  },
  getTrashpossums(state) {
    return state.trashpossums;
  },
  getRandomness(state) {
    return state.randomness;
  },
  getBaseURI(state) {
    return state.baseURI;
  },
  getCID(state) {
    return state.baseCID;
  }
};

const actions = {
  async fetchReservedPossums({ commit }) {
    commit(
      "setReservedPossums",
      await reservedPossums(state.trashpossums, state.signer)
    );
  },
};

export default createStore({
  state,
  getters,
  actions,
  mutations,
});
