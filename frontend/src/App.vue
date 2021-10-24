<template>
  <Modal caption="Greek Possum" />
</template>

<script>
// import HelloWorld from "./components/HelloWorld.vue";
import Modal from "./components/Modal";

export default {
  name: "App",
  components: {
    Modal,
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
</style>
