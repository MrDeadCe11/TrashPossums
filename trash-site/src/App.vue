<script>
import Navbar from "./components/Navbar.vue"
import Footer from './components/Footer.vue'
import Modal from "./components/Modal.vue"
import {ref} from 'vue'
export default {
    components: {
        Navbar, Footer
    },
    setup () {
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
