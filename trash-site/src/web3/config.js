import WalletConnectProvider from '@walletconnect/web3-provider';
import Torus from '@toruslabs/torus-embed';
import Authereum from 'authereum';
import ethProvider from "eth-provider";



import { Bitski } from 'bitski';

const infuraID = import.meta.env.VITE_WALLET_CONNECT_ID

// eslint-disable-next-line global-require
// const { USDT_ADDRESS } = process.env.NODE_ENV === 'production'
//   ? require('./constants')
//   : require('./constants.dev');
// 
const providerOptions = {
  //https://docs.walletconnect.org/
  walletconnect: {
    package: WalletConnectProvider,
    options: {
      infuraId: infuraID, // TODO infuraId
    },
  },
    // https://github.com/torusresearch/torus-embed#readme
  torus: {
    package: Torus,
  },
    // https://docs.authereum.com/integration
  authereum: {
    package: Authereum,
  },
  frame: {
    package: ethProvider // required
  },
};

export {providerOptions };
