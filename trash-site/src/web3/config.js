import WalletConnectProvider from '@walletconnect/web3-provider';
import Torus from '@toruslabs/torus-embed';
import Authereum from 'authereum';
import ethProvider from "eth-provider";


import { Bitski } from 'bitski';

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
      infuraId: process.env.INFURA_ID, // TODO infuraId
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
    //https://docs.bitski.com/
  bitski: {
    package: Bitski,
    options: {
      clientId: 'xxxxxxxxxx', // TODO
      callbackUrl: `${window.location.href}bitski-callback.html`,
    },
  },
  frame: {
    package: ethProvider // required
  },
};

export {providerOptions };
