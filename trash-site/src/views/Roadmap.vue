<template>
<div class="roadmap h-auto text-white-light mt-32 mb-8">
   <div class="text-base m-auto max-w-4xl bg-gray-light shadow-xl">
   <h1 class="font-bold text-2xl"> 
Roadmap
   </h1>
   <ul class="list-decimal ml-8">
   
      <br>
<li class=""> <p>Who are we / who is the team?</p></li>

<li><p>  Why are we creating the NFT’s.</p>
<p>Trash possums originated as a spitball that stuck to the wall. With our multi talented team we all found a single outlet that we could combine our efforts into a single focus. Our purpose is threefold. 
Generate capital for philanthropic use, In storm ravaged south west louisiana. On August 26 2020 Hurricane Laura barrelled into our home as a category four storm. It was a powerhouse of wind surges at 175mph and above. At the time of writing November 2021 this author is still out of a home. My story and hundreds more are similar, numerous businesses, and city staples have not yet recovered. With little help from the state and federal government we must rebuild together. We pledge a third of our earnings to our local restoration efforts. We will make donations to numerous non profit organizations such as Heck Haven, Pitbull rescue, and or any others that we decide on. 
Generate capital for the Wallstreet Couillon DAO.
Generate capital for the individuals of the NFT project. 
</p></li>
<li><p> What are the NFT’s utility for the owner?</p></li>

Deflationary asset
Bragging rights
Supporting a good cause

<li><p> What is our purpose for coming together as a collective?</p></li>
We live in a changing world with unprecedented connectivity. Collectives offer freedom for regular people to realize their own dreams instead of only buying into someone else’s.
Success is more likely when people work together.

<li><p> How much is this expected to cost?</p></li>
10k?

<li><p>  Quantity of NFT’s in collection.</p></li>
10000

<li><p></p></li>  Floor price at launch. 
300

Raising floor price? 
Sell 100, then incrementally raise the price by 50 per 100

<li><p> Charities we will be supporting?</p></li>
Suggestion NCB 
Heck haven closed?
Pit bull rescue 
Wildlife and fisheries 
Local Schools
9.  What royalty? 
Flat fee put in contract, and universal
10. Mint first or mint on demand? 
</ul>

</div>
</div>
</template>

<script setup>

import { computed }from 'vue';

import { useStore } from 'vuex'

const store = useStore();
const name = computed(() => {
    return store.state.user.name
});
</script>

<style>

</style>