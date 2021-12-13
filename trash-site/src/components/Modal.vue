<template>
  <div  class="backdrop w-96 m-auto mt-32 p-5 h-auto fixed top-0 left-0 right-0 bg-gray-light" @click.self="toggleModal">
      <div class="grid-col-4">
          <button class="col-end-4 flex"><font-awesome-icon style="filter:invert(100%)" @click="$emit('toggle', $event.target.value) " :icon="['fas', 'times-circle']" class="w-5"/></button>
          <slot>No Slot Passed</slot>

      </div>
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