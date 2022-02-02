# Trash Possums minting dapp

This is a work in progress for the Trash possums minting dapp.
the website is made with Vue3(vite) and tailwind css.
The smart contract is written and tested in HardHat.

The contract uses Chainlink VRF to randomly select token ids out of an array of the remaining id's.  hopefully this will help with the manipulation of the nft drop.  When you mint the nft you will get a random ID selected by the chainlink vrf.  done in the "getPossumToBeClaimed" function on the main contract.

this is a work in progress...


check it out 

clone the repo,
install dependencies,
npx hardhat test.

