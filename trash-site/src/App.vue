<script>
import Navbar from "./components/Navbar.vue"
import Footer from './components/Footer.vue'
import { useStore } from "vuex"
import {ref} from 'vue'

export default {
    components: {
        Navbar, Footer
    },
    mounted () {
          const store = useStore();
    // store.commit("clearCache");
    const connected = store.getters.getConnected
    console.log("connected app side", connected)
    },
    setup () {
        const store = useStore();
      
        function clicked () {
            console.log("app clicked")
        }
        return {clicked}
       
    },
}
</script>

<template>
 <Navbar/>
 
<div >   
<router-view/> 
</div>

<Footer/>
</template>

<style>
#app{
    background-color: #1d262d;    
}

@font-face {
    font-family: "Banco";
    src: local("Banco"),
    url('./fonts/Banco Regular.ttf') format('truetype');
    font-weight: normal;
    font-style: normal;
    font-language-override: normal;
}
h1{
  font-family: "Banco";  
}
</style>
