<template>
<div class="purchase my-20">
   <h1 class="font-bold text-white-light text-2xl"> 
     Purchase A Possum
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