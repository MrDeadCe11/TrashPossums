<template>
<div class="mt-16" @click.self="$emit('appclicked', $event.target.value)" style="transition:opacity 400ms ease 0s, transform 400ms ease 0s; transform: none; opacity: 1;">
<div class="grid grid-cols-6 grid-rows-auto gap-4 p-5" >
    <div class="m-auto col-span-6 row-span-6 w-5/6">
  <img  src="https://ik.imagekit.io/trashpossums/assets/possum_central_naked_Jm05jJafT.png?updatedAt=1639249322920" class="relative m-5 h-auto w-auto"/>
  </div> 
   
  
    <h1 class="d-flex col-span-6 mb-3 ml- 10 text-4xl text-white-light">
    The Trash Possums are Coming!
    </h1>  
    <div class="mb-5 flex col-span-4 flex-row">               
    <p class="text-xl text-white-light ml-5"> In the year 2421, centuries after irradiated hurricanes caused the evolution of rabies into an incurable pestilence across the globe. With humanity long extinct, the Trash 'Possums have risen. Shaping their entire society around humans' pop culture icons, which they regard as deities. The Trash Possums have improved on tech left by humanity and traverse the near infinite expanse of the universe along with improving the earth left by humans. </p>
  </div>
     <div class="col-span-2 row-span-4">
    <Gallery :images="pfpImages" :sliceStart="sliceStart" :sliceEnd="sliceEnd"/>       
    </div>
    <h1 class="d-flex col-span-4 mb-3 ml-10 text-4xl text-white-light">
      Fair launch and minting
    </h1>
   <div class="mb-5 flex col-span-4">
      <p class="text-xl text-white-light ml-5">Trash Possums is attempting to have a totally fair launch.  Each token ID is generated randomly at the time of minting using a pseudo random number generator in the contract. 
         After all the possums have been minted or a certain period of time has passed (chosen by the community) we will use an integer chosen by Chainlink 
         VRF to offset the IDs to their final value.  
        All metadata and properties will be released on the start mint date and the final ids will be revealed after minting is complete or after. </p>
    </div>
    
  <div class="roadmap h-auto col-span-3 col-start-2 text-white-light mt-32 mb-8">
   <div class="text-base m-auto max-w-4xl p-5 rounded-md border-white-light border-4 shadow-xl">
   <h1 class="font-bold text-3xl"> 
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
   

</div>
</div>
</template>

<script>
import Gallery from '../components/Gallery.vue'
import Footer from '../components/Footer.vue'
import { computed, ref } from 'vue'
import pfpImagesArr from '../store/modules/pfpImagesArr'
import { useStore } from 'vuex'


export default {
  name:  'Home',
  components: {Gallery, Footer},
  mounted(){
  
  },
  setup() {
  
  const pfpImages = ref([...pfpImagesArr]) 
  const sliceStart = computed(()=> Math.floor(Math.random()*19))
  const sliceEnd = computed(()=> sliceStart.value + 4)
  
  return { pfpImages, sliceStart, sliceEnd}
}

}
</script>

<style scoped>
.possumworld{
  max-height: 50%;
  max-width: 70%;
  margin: auto auto;  
  margin-top: 70px;
}
h1{
  font-family: "Banco";
}
</style>