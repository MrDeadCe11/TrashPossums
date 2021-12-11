<script>
import Navbar from "./components/Navbar.vue"

export default {
    components: {
        Navbar
    },
    setup () {},
}
</script>

<template>
 <Navbar/>
 
<div>
   
<router-view />
</div>
</template>

<style>
#app{
    background-color: rgba(17, 24, 39);    
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
