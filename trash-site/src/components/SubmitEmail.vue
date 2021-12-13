<template>
      <div class="ml-10 p-10" >
           <button @click="toggleModal" class="p-2 sm:inline-block md:flex bg-gray-light rounded-full border-4 border-black-dark"> 
            <font-awesome-icon :icon="['fas', 'envelope']" /></button>
            </div>
             <div v-if="modal" class="fixed">        
        <Modal class="border-4" @toggle="toggleModal"><slot>
            <h1 class="text-center text-2xl text-white-light"> Join the Mailing list </h1>
            <form action="">
                <input placeholder="enter your email" required class="bg-gray-light border-2 pl-2 ml-5 mt-3">
                <button class=" border-2 w-10 bg-gray-dark"><font-awesome-icon :icon="['fas', 'caret-left']" style="filter:invert(100%)" class="fill-white-light"/></button>

            </form>
             </slot> </Modal>
            </div>
      
      
</template>

<script>
import {ref} from 'vue'
import Modal from './Modal.vue'

export default {
    name: 'Submit Email',
    components: {Modal},
    emits: [],
methods: {},
 
setup() {
    let modal = ref(false)
    function toggleModal () {
    modal.value = !modal.value
    }
    return {toggleModal, modal}

}
}
</script>

<style>

</style>