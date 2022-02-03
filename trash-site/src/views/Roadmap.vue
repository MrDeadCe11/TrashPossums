<template>
<div class="roadmap h-auto text-white-light mt-32 mb-8">
   <div class="text-base m-auto max-w-4xl p-5 bg-gray-light shadow-xl">
   <h1 class="font-bold text-2xl"> 
Roadmap:
   </h1>
    <br>
   <ul class="list-bullet ml-8">    
<li><p>10% We pay back our wives’ boyfriends</p></li>
<li><p>20% Special edition pog run.</p></li>
<li><p>40% Trash Possum Series 2 Launch </p></li>
<li><p>60% Roach Buddies</p></li>
<li><p>80% Buy Metaverse property and construct “Possum Town”</p></li>
<li><p>100% Roach pet battle game?</p></li>
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