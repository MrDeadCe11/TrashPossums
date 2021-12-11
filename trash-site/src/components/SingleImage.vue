<template>
  <div class="image w-full rounded">  
   <img :src="image.image"
   :alt="image.name" />  
  </div>
</template>

<script>
import { computed } from '../../node_modules/vue'
export default {
  props: ['image'],
  setup(props) {
       return { }
  }
}
</script>

<style>
  
</style>