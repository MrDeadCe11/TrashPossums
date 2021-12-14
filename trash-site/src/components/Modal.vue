<template>
  <div  class="backdrop w-4/6 m-auto mt-32 p-5 h-auto fixed top-0 left-0 right-0 bg-gray-light" @click.self="toggleModal">
  <button class="col-span-6 justify-self-end -mr-10 -mt-5">
<font-awesome-icon style="filter:invert(100%)" @click="$emit('toggle', $event.target.value) " :icon="['fas', 'times-circle']" />
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