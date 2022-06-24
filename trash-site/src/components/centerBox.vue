<template>
  <div class="mb-3 md:w-4/6 w-full mx-auto overflow-y-auto bg-gray-light rounded p-2">
    <div class="rounded-xl mr-8">
      <h1 class="text-3xl ml-3 w-full text-yellow-light">{{ name }}</h1>
      <div class="float-right ml-6 -mt-7 sm:aspect-w-16 sm:aspect-h-9 sm:w-44">
        <img class="rounded-lg md:w-full w-2/3 m-auto" :src="image" alt="Member Profile pic" />
      </div>
      <p class="ml-10 text-2xl">{{ description }}</p>
    </div>
  </div>
</template>

<script>
export default {
  props: ["name", "image", "description"],
};
</script>

<style></style>
