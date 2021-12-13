<template>
 <div class="grid md:grid-cols-2 min-w-min w-5/6 ml-10 sm:grid-cols-1">
     <div v-for="image in images.slice( sliceStart,sliceEnd)" :key="image.id"  >        
        <SingleImage :image="image" />   
      
     </div>
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