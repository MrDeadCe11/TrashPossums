<template>
<div class="roadmap h-screen text-white-light mt-32 mb-8">
   <div class="text-base m-auto max-w-4xl p-5 bg-gray-light shadow-xl">
   <h1 class="font-bold text-2xl"> 
Roadmap:
   </h1>
    <br>
 <ul class="ml-8">    
      <li><p> <span class="font-bold text-xl"> 10% </span> We pay back our wives’ boyfriends</p></li>
      <li><p> <span class="font-bold text-xl"> 20% </span> Special edition pog run.</p></li>
      <li><p> <span class="font-bold text-xl"> 40% </span> Trash Possum Series 2 Launch </p></li>
      <li><p> <span class="font-bold text-xl"> 60% </span> Roach Buddies</p></li>
      <li><p> <span class="font-bold text-xl"> 80% </span> Buy Metaverse property and construct “Possum Town”</p></li>
      <li><p> <span class="font-bold text-xl"> 100%</span>  Roach pet battle game?</p></li>
  <br>
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