<template>

  <div class="w-full z-10">
   <Nav :navLinks="navLinks" :navConfig="navConfig" :btnConfig="btnConfig" style="width: 100%">
   <div class="p-2 ml-5 mt-2">
      <div class="flex justify-start ml-2 p-2">
     <a class="mr-2" href="https://discord.gg/8WhbqH8JzQ"> <font-awesome-icon :icon="['fab', 'discord']" style="filter: invert(100%); width:fit-content"/></a>
      <a href="https://twitter.com/trash_possums"> <font-awesome-icon :icon="['fab', 'twitter']" style="filter: invert(100%); width:fit-content"/></a>
    
      <img class="img p-2 ml-5 mt-2 md:w-2/3 w-96" src="https://ik.imagekit.io/trashpossums/assets/logo_zt0ryp8T_s.png?updatedAt=1639170269961" alt="" width="" srcset="" /> <!-- A slot For your project Logo -->
    </div></div>
   
    </Nav>
    
  </div>
</template>

<script>
import { ref, computed } from "vue";
import { useStore } from "vuex";
import Nav from "vue-nav-ui";

export default {
  components: {
    Nav
  },
  setup() {
    let showMenu = ref(false);
    const store = useStore();

    const toggleNav = () => {
      showMenu.value = !showMenu.value;
    };
        /* FOR YOUR NAVIGATION LINKING NAMES AND PATHS */ 
    const navLinks = ref([
      {
        name: "Home",
        path: "/",
      },
      {
        name: "Roadmap",
        path: "/roadmap",
      },
      {
        name: "Team",
        path: "/team",
      }
    ]);

    /* FOR CONFIGURING THE STYLING OF YOUR NAVIGATION */
    const navConfig = ref({
      whitespace: false, /* GIVES PADDING TO YOUR NAV, IF SET TO FALSE, REMOVES PADDING */
      navBg: "#1d262d", /* BACKGROUND COLOR OF YOUR NAV  */
      navBorderRadius: "0px", /* BORDER RADIUS OF YOUR NAV */
      linkFont: "banco", /* FONT FAMILY OF YOUR NAV */
      linkColor: "#dad186", /* FONT COLOR OF YOUR NAV */
      //margin: "10px",
      //width: "100%",
      responsivePosition: "top", /* FOR CHANGING THE POSITION OF YOUR NAV WHEN RESPONSIVE. BOTTOM or TOP | The only two options */
    });

     /* FOR NAV BUTTON CONFIGURATION */
    const btnConfig = ref({
      btnLink: true, /* FOR INITIALIZING NAV BUTTON USAGE, IF SET TO FALSE, REMOVES THE NAV BUTTON  */
      btnUrl: "/purchase", /* LINK URL OF YOUR NAV BUTTON */
      btnText: "Buy a Possum!", /* NAV BUTTON TEXT */
      btnBg: "#6d5934", /* BACKGROUND COLOR OF YOUR NAV BUTTON  */
      btnTextColor: "white", /* FONT COLOR OF YOUR NAV BUTTON*/
      btnBorderWidth: "0", /* BORDER WIDTH OF YOUR NAV BUTTON */
      btnBorderColor: "black", /* BORDER COLOR OF YOUR NAV BUTTON */
      btnBorderRadius: "20px", /* BORDER RADIUS OF YOUR NAV BUTTON */
    });

    return {
      showMenu,
      toggleNav,
      connected: computed(() => store.getters.getConnected),
       navLinks, btnConfig, navConfig 
    };
  },
};
// class="px-10 py-0 mx-0 md:flex fixed bg-brown-dark w-screen top-0 z-50 gap-4 grid grid-cols-6 grid-rows-1 md:justify-between sm:justify-center border-b-4 border-brown-light"
</script>

<style scoped>
.router-link-exact-active {
  color: #dad186;
  font-weight: bold;
}
a {
  /* font-family: "Banco"; */
  letter-spacing: 0.4px;
  font-weight: lighter;
}

</style>
