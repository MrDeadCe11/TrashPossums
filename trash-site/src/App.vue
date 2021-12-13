<script>
import Navbar from "./components/Navbar.vue"
import Footer from './components/Footer.vue'
export default {
    components: {
        Navbar, Footer
    },
    setup () {},
}
</script>

<template>
 <Navbar/>
 
<div>
   
<router-view />
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
</style>
