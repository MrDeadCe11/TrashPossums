<template>
  <div class="mainnav">
    <nav
      class="       
        px-10
        py-0
        mx-0
        md:flex
        fixed
        bg-brown-dark
        w-screen
        top-0
        z-50
        gap-4
        grid
        grid-cols-6
        grid-rows-1
        md:justify-between
        sm:justify-center
        
      "
    >
     
      <div class="min-w-min p-2 ml-5 mt-2 max-w-sm col-span-3">
        <router-link
          to="/"
         > 
          <img src='https://ik.imagekit.io/trashpossums/assets/logo_zt0ryp8T_s.png?updatedAt=1639170269961'/>
        </router-link>
        </div>
        <!-- Mobile menu button -->
        <div @click="toggleNav" class="flex ml-10 col-start-6 md:hidden">
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
     
      

      <!-- Mobile Menu open: "block", Menu closed: "hidden" -->
      <ul
        :class="showMenu ? 'flex' : 'hidden'"
        class="
        grid grid-cols-6 grid-rows-4 grid-flow-col-dense
          gap-0
          w-96
          mb-5
          md:space-y-0 md:items-center md:w-1/3 md:mb-0 md:space-x-10 md:mt-0 md:flex       
        "
      >
        <li class="col-span-5 text-brown-light hover:text-yellow-light active:text-yellow-light"><router-link to='/'>HOME</router-link></li>
        <li class="col-span-5 text-brown-light hover:text-yellow-light active:text-yellow-light"><router-link to='/roadmap'>ROADMAP</router-link></li>
        <li class="col-span-5 text-brown-light  hover:text-yellow-light active:text-yellow-light"><router-link to="/team">THE TEAM</router-link></li>
        <li class="col-span-5 text-center text-brown-light hover:text-yellow-light active:text-yellow-light border-solid border-grey-100 border-2 p-1.5"><router-link to='/purchase'>BUY A POSSUM</router-link></li>
       
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