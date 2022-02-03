# Trash Possums minting dapp

This is the Trash possums minting dapp.
the website is made with Vue3(vite) and tailwind css.
The smart contract is written and tested in HardHat.

The contract uses pseudo random number generator to randomly select token ids out of an array of the remaining id's and then after minting is complete it will use chainlink vrf to offset the token IDs to their final values.  hopefully this will help with the manipulation of the nft drop.  When you mint the nft you will get a random ID  this is done in the "getPossumToBeClaimed" function on the main contract.

this is a work in progress...


check it out 

clone the repo,
install dependencies,
npx hardhat test.

