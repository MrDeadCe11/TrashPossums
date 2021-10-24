<template>
  <div class="backdrop" @click.self="closeModal">
    <div class="modal" :class="{ onSale: sale }">
      <img alt="modal image" src="../assets/GREEKPOSSUM.png" class="possum" />
      <slot></slot>
      <button @click="toggleSale">sale?</button>
      <br />
      <slot name="links"></slot>
    </div>
  </div>
</template>

<script>
export default {
  props: [],
  data() {
    return {
      sale: false,
    };
  },
  methods: {
    toggleSale() {
      this.sale = !this.sale;
    },
    closeModal() {
      this.$emit("close");
    },
  },
};
</script>

<style scoped>
.modal {
  width: 400px;
  padding: 20px;
  margin: 100px auto;
  background: black;
  border-radius: 10px;
}
.backdrop {
  top: 0;
  position: fixed;
  background: rgba(0, 0, 0, 0.5);
  width: 100%;
  height: 100%;
}
p {
  color: blanchedalmond;
  font-style: normal;
}
h1 {
  color: blanchedalmond;
}
.onSale {
  background: crimson;
  color: white;
}
.onSale h1 {
  background: crimson;
  color: white;
}
</style>
