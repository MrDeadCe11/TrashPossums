<template>
 <!-- <div class="grid sm:grid-cols-2 w-5/6 ml-5 grid-cols-1"> -->
     <div v-for="image in images.slice( sliceStart,sliceEnd)" :key="image.name"  >        
        <SingleImage :image="image" />   
      
     <!-- </div> -->
 </div>
</template>

<script>

import SingleImage from '../components/SingleImage.vue'
export default {
    props: ['images', 'sliceStart','sliceEnd'],
    components: {SingleImage},
    setup(props) {   
        const sliceStart = props.sliceStart
        const sliceEnd = props.sliceEnd
        return {sliceEnd, sliceStart}
         }, 
              
    
    
}
</script>

<style>

</style>