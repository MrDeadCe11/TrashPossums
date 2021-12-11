<template>
  <div class="mainnav">
    <nav
      class="       
        px-10
        py-0
        mx-0
        md:flex md:justify-between md:items-center
        fixed
        bg-brown-dark
        w-screen
        top-0
        z-50
      "
    >
      <div class="flex items-center justify-between">
        <router-link
          to="/"
          class="
            text-xl
            font-bold
            text-gray-100
            md:text-2xl        
          ">
          <img src='../assets/logo.png' class="w-96 justify-self-center"/>
        </router-link>
        <!-- Mobile menu button -->
        <div @click="toggleNav" class="flex ml-10 md:hidden">
          <button
            type="button"
            class="
              text-brown-light
              hover:text-yellow-light
              focus:outline-none focus:text-gray-400
            "
          >
            <svg viewBox="0 0 24 24" class="w-6 h-6 fill-current">
              <path
                fill-rule="evenodd"
                d="M4 5h16a1 1 0 0 1 0 2H4a1 1 0 1 1 0-2zm0 6h16a1 1 0 0 1 0 2H4a1 1 0 0 1 0-2zm0 6h16a1 1 0 0 1 0 2H4a1 1 0 0 1 0-2z"
              ></path>
            </svg>
          </button>
        </div>
      </div>

      <!-- Mobile Menu open: "block", Menu closed: "hidden" -->
      <ul
        :class="showMenu ? 'flex' : 'hidden'"
        class="
          flex-col
          mt-8
          space-y-2
          md:flex md:space-y-0 md:flex-row md:items-center md:space-x-10 md:mt-0
        "
      >
        <li class="text-brown-light hover:text-yellow-light active:text-yellow-light"><router-link to='/'>HOME</router-link></li>
        <li class="text-brown-light hover:text-yellow-light active:text-yellow-light"><router-link to='/roadmap'>ROADMAP</router-link></li>
         <li class="text-brown-light hover:text-yellow-light active:text-yellow-light"><router-link to="/team">THE TEAM</router-link></li>
        <li class="text-brown-light hover:text-yellow-light active:text-yellow-light border-solid border-grey-100 border-2 p-1.5"><router-link to='/purchase'>BUY A POSSUM</router-link></li>
       
      </ul>
    </nav>
  </div>
</template>

<script>
import { ref } from 'vue';
export default {
  setup() {
    let showMenu = ref(false);
    const toggleNav = () => (showMenu.value = !showMenu.value);
    return { showMenu, toggleNav };
  },
};
</script>

<style scoped>
.router-link-exact-active{
    color: #dad186;
    font-weight: bold;
  }
  a{
    font-family: "Banco";
    letter-spacing: .4px;
    font-weight: lighter;
  }
  .mainnav {
    min-height: 10px;
  }
</style>