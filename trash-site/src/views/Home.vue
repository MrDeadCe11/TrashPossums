<template>
<div style="transition:opacity 400ms ease 0s, transform 400ms ease 0s; transform: none; opacity: 1;">
<div class="grid grid-cols-6 grid-rows-auto gap-4 p-5" >
    <div class="m-auto mt-10 col-span-6 w-5/6">
  <img  src="https://ik.imagekit.io/trashpossums/assets/possum_central_naked_Jm05jJafT.png?updatedAt=1639249322920" class="relative m-5 h-auto w-auto"/>
  </div> 
   
    
    <h1 class="d-flex col-span-6 mb-3 ml-10 font-bold text-4xl text-white-light">
    The Trash Possums are Coming!
    </h1>  
    <div class="mb-5 flex col-span-4 flex-row">               
    <p class="text-xl text-white-light ml-5"> In the year 2421, centuries after irradiated hurricanes caused the evolution of rabies into an incurable pestilence across the globe. With humanity long extinct, the Trash 'Possums have risen. Shaping their entire society around humans' pop culture icons, which they regard as deities. The Trash Possums have improved on tech left by humanity and traverse the near infinite expanse of the universe along with improving the earth left by humans. </p>
    </div>
    <div class="col-span-2">
    <Gallery :images="pfpImages" :sliceStart="sliceStart" :sliceEnd="sliceEnd"/>  
  </div> 

</div>
</div>
</template>

<script>
import Gallery from '../components/Gallery.vue'
import Footer from '../components/Footer.vue'
import { computed, ref } from 'vue'
import pfpImagesArr from '../store/modules/pfpImagesArr'


export default {
  name:  'Home',
  components: {Gallery, Footer},
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