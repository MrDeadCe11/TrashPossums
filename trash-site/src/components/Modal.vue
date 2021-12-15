<template>
  <div  class="backdrop fixed w-4/6 m-auto mt-32 p-3 h-auto top-0 left-0 right-0 bg-gray-dark">
  <button>
<font-awesome-icon style="filter:invert(100%)" @click="$emit('toggle', $event.target.value)" :icon="['fas', 'times-circle']" />
</button>

          <slot>No Slot Passed</slot>

      
  </div>
</template>

<script>
export default {
    name: 'Modal',
    props: [],
    components: {},
methods:{
  
}
}
</script>

<style>

</style>