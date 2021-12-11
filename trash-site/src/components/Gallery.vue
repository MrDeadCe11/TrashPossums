<template>
 <div class="container grid grid-cols-2 gap-0 ">
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