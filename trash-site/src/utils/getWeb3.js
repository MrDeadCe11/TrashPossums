import { ethers, Signer } from 'ethers';
import {Provider} from '@ethersproject/abstract-provider';
import {BigNumber} from '@ethersproject/bignumber'
import detectEthereumProvider from "@metamask/detect-provider";

const trashABI = "../artifacts/contracts/TrashPossums.sol/TrashPossums.json"
const randomnessAddress = "0x9e10cD823C6836b1123B05953d4BA216e619fb04";
const trashPossumsAddress= "0x24c9B9B9348BB80ec2427D198e47D6fd787a3bEf";
/*
* 1. Check for injected web3 (mist/metamask)
* 2. If metamask/mist create a new web3 instance and pass on result
* 3. Get networkId - Now we can check the user is connected to the right network to use our dApp
* 4. Get user account from metamask
* 5. Get user balance
*/
class BlockchainConnect {
  provider
  signer 
  account
  onChange

  constructor() {
    this.account = "";
    this.provider = null;
    this.signer = null;
    this.onChange = null
  }



  async connect(){
          this.provider = await detectEthereumProvider();

          if(this.provider){
    
    this.provider = new ethers.providers.Web3Provider(window.ethereum);
    await this.provider.send("eth_requestAccounts", []);
            
      this.signer = this.provider.getSigner();

            if(this.signer === null || this.signer === undefined)
                console.error("BlockchainConnect::connect() Signer returned null")
        
        } else {
            this.provider = ethers.providers.getDefaultProvider();
            this.signer = this.provider.getSigner();
        }

        this.account = await this.signer.getAddress();
        console.log("BlockchainConnect::connect() - Complete: ", this.provider, this.signer, this.account);
    
        window.ethereum.on('accountsChanged', (accounts) => {
                      this.accountsChanged(accounts);
                  });
        }
}  


export default BlockchainConnect;

// export default connectWallet; 

// import { ethers, Signer } from 'ethers';
// import type {Provider} from '@ethersproject/abstract-provider';
// import type {BigNumber} from '@ethersproject/bignumber'
// import detectEthereumProvider from "@metamask/detect-provider";

// interface changeCallback { (myArgument: string): void }

// export default class BlockchainConnect {
//     public provider: Provider|null;
//     public signer: Signer|null;
//     public account: string;

//     #onChange: changeCallback|null;

//     constructor() {
//         this.account = "";
//         this.provider = null;
//         this.signer = null;
//         this.#onChange = null;
//     }

//     async connect(): Promise<void> {
//         // Connect MetaMask
//         this.provider = <Provider> await detectEthereumProvider();

//         if(this.provider) {
//             // Connect Ethers to Metamask instance
//             await window.ethereum!.enable();

//             this.provider = new ethers.providers.Web3Provider(window.ethereum)

//             await this.provider.send("eth_requestAccounts", []);
            
//  ,           this.signer = this.provider.getSigner();

//             if(this.signer === null || this.signer === undefined)
//                 console.error("BlockchainConnect::connect() Signer returned null")
        
//         } else {
//             this.provider = <Provider> ethers.providers.getDefaultProvider();
//             this.signer = this.provider.getSigner();
//         }

//         this.account = await this.signer!.getAddress();
//         console.log("BlockchainConnect::connect() - Complete: ", this.provider, this.signer, this.account);
    
//         //
//         // Setup change notification
//         //
//         // TODO: Figure out why I can't call this by passing func reference... odd
//         window.ethereum!.on('accountsChanged', (accounts: Array<string>) => {
//             this.accountsChanged(accounts);
//         });
//     }
   
//     /**
//      * Callback handler for when user changes accounts
//      * 
//      * @param accounts list of accounts - currently MetaMask only sets account[0]
//      */
//     accountsChanged(accounts: Array<string>) {
//         if(accounts.length) {
//             console.log("BlockchainConnect::accountsChanged()", accounts);
//             this.account = accounts[0];
//         } else if (accounts.length === 0) {
//             console.log('BlockchainConnect::accountsChanged() - Please connect to MetaMask.');
//             this.account = "";    
//         }

//         // call user supplied change notification callback
//         if(this.#onChange != null)
//             this.#onChange(this.account); 
//     }
    
//     /**
//      * Sets the callback to be used when the account changes
//      * @param _onChange changeCallback
//      */
//     setOnChange(_onChange: changeCallback) {
//         this.#onChange = _onChange;
//     }    
    
//     /**
//      * Gets the ETHER balance of an account 
//      * @param address Account to get balance for
//      * @returns promise to the balance in WEI - a string
//      */
//     async getBalance(address: string) : Promise<string> {
//         if(this.provider) {
//             const balance: BigNumber = await this.provider.getBalance(address);
//             return balance.toString();
//         } else {
//             console.error("BlockchainConnect::balanceOf() - not loaded yet - call connect first")
//             return "0";
//         }
//     }
//     /**
//      * Helper to return balance formatted as Ether
//      * @param address Account address to get balance for
//      * @param precision Number of decimal places of precision. Default (-1) returns the full number
//      * @returns promise to the balance in ETHER - a string
//      */
//     async getBalanceEther(address: string, precision: number = -1 ) : Promise<string> {
//         const weiBal: string = await this.getBalance(address);
//         const ether: string = ethers.utils.formatEther(weiBal);
//         console.log("BlockchainConnect::getBalanceEther - ", ether);
//         if(precision === -1)
//             return ether;
//         else
//         {
//             let bal = Math.round(Number((Math.abs(ether.toB) * 10**precision).toPrecision(16))) / 10**precision * Math.sign(ether); 
//             return bal.toString();
//         }
//     }

// }