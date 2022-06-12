<template>
  <div class="mt-auto mb-auto">
    <button
      @click="toggleModal"
      class="p-2 flex bg-gray-dark rounded-full border-4 border-white-light justify-self-end"
    >
      <font-awesome-icon
        :icon="['fas', 'envelope']"
        style="filter: invert(100%)"
      />
    </button>
  </div>
  <div v-if="modal" class="fixed">
    <Modal class="mx-auto my-auto" @toggle="toggleModal"
      ><slot>
        <h1 class="text-center text-2xl text-white-light mb-2">
          Join the Mailing list
        </h1>
        <form class="" @submit.prevent="submitEmail" @submit="toggleModal">
          <input
            placeholder="enter your email"
            type="email"
            required
            class="text-white-light ml-3 w-3/4 bg-gray-dark border-2 pl-2 shadow-xl"
          />
          <button class="text-white-light border-2 w-10 bg-gray-dark">
            <font-awesome-icon
              :icon="['fas', 'caret-left']"
              style="filter: invert(0%)"
            />
          </button>
        </form>
      </slot>
    </Modal>
  </div>
</template>

<script>
import { ref } from "vue";
import Modal from "./Modal.vue";

export default {
  name: "Submit Email",
  components: { Modal },
  emits: [],
  methods: {},

  setup() {
    let modal = ref(false);
    function toggleModal() {
      modal.value = !modal.value;
    }
    function submitEmail() {
      console.log("email submitted");
    }
    return { toggleModal, modal, submitEmail };
  },
};
</script>

<style></style>
