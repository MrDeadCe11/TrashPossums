<template>
<div style="transition:opacity 400ms ease 0s, transform 400ms ease 0s; transform: none; opacity: 1;">
<div class="common-container bg-gray-dark" >
<div class="mb-4 mb-lg-5 container possumworld" >
  <div class="row">
    <div class="col-12 px-0">
  <img  src="https://ik.imagekit.io/trashpossums/assets/possum_central_naked_Jm05jJafT.png?updatedAt=1639249322920" class="relative m-5 h-auto w-auto"/>
  </div>
  </div>
  </div>
   <h1 class="d-flex welcome-title mb-3 ml-10 font-bold text-4xl text-white-light">
    The Trash Possums are Coming!
    </h1>  
  <div class="px-4 mt-md-4 col ml-10">     
    <div class="mb-5 flex flex-row">               
    <p class="common-p mb-0 text-xl text-white-light basis-1/2 ml-5">The year is 100 AD (Anno Didelphis) and the possums have become sentient.  Living in the garbage left by mankind they... Lorem ipsum dolor, sit amet consectetur adipisicing elit. Iusto, unde! Sint accusantium, dicta vel ut deleniti deserunt fugit expedita distinctio rem eaque enim! Laboriosam vel cumque ducimus at obcaecati, laudantium nulla. Reprehenderit, deserunt! Cupiditate in veritatis amet similique quis eos at sit temporibus aspernatur illum numquam, culpa optio exercitationem dolor placeat sunt consequatur fugiat maxime quos dolorum, atque ratione corporis molestias. Nam odit error velit distinctio culpa dolorum tempore qui nemo officia mollitia veritatis neque, blanditiis asperiores aperiam, exercitationem itaque obcaecati nostrum! Autem ratione dicta delectus dolorem obcaecati optio id laboriosam quae illo. Deleniti consequuntur commodi ea. Sunt, beatae laborum!</p>
    
    <div class="basis-1/2 object-right-top mr-20 ml-20">
    <Gallery :images="pfpImages" :sliceStart="sliceStart" :sliceEnd="sliceEnd"/>
  </div>
  </div> 

</div>
</div>
<Footer />

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