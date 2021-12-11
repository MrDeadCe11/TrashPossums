<template>
<div class="roadmap my-20">
   <h1 class="font-bold my-10 text-white-light text-2xl"> 
      Roadmap
   </h1>
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
h1{
  font-family: "Banco";
  
}
</style>