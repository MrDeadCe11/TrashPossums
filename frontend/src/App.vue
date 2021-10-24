<template>
  <div v-if="showModal">
    <Modal @close="toggleModal">
      <h1>{{ nftTitle }}</h1>
      <p>{{ text }}</p>
      <template v-slot:links>
        <a href="https://twitter.com/trash_possums"
          ><img class="linkImg" src="./assets/twitterLogo.png" />
        </a>
        <a href="https://discord.gg/gz2hMPFk6s"
          ><img class="linkImg" src="./assets/discordLogo.png"
        /></a>
      </template>
    </Modal>
  </div>
  <button @click="toggleModal">open modal</button>
</template>

<script>
// import HelloWorld from "./components/HelloWorld.vue";
import Modal from "./components/Modal";

export default {
  name: "App",
  components: {
    Modal,
  },
  data() {
    return {
      showModal: false,
      nftTitle: "Greek Possum",
      text: "This possum is probably trying to be greek.",
    };
  },
  methods: {
    toggleModal() {
      this.showModal = !this.showModal;
    },
  },
};
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
.possum {
  max-width: 200px;
  max-height: 200px;
}
.linkImg {
  max-height: 25px;
  max-width: 25px;
  padding: 8px;
}
</style>
