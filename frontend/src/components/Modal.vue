<template>
  <div class="backdrop">
    <div class="modal">
      <img alt="modal image" src="../assets/GREEKPOSSUM.png" class="possum" />
      <p>{{ caption }}</p>
    </div>
  </div>
</template>
<script>
export default {
  props: ["caption"],
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
  background: "../assets/simpleBg.jpg";
  width: 100%;
  height: 100%;
}
p {
  color: blanchedalmond;
  font-style: normal;
}
</style>
