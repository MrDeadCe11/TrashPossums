<template>
<hr  class="color-white-light m-auto" width="90%">
<div class="footer grid grid-cols-6 grid-rows-1 justify-between content-center gap-4 align-middle">
    <SubmitEmail/>
    <div  class="
    col-start-3 self-center ml-5 m-auto            
         col-span-2 p-2     
          ">
     <router-link
          to="/"
         >
          <img src='https://ik.imagekit.io/trashpossums/assets/group-logo_-k58ey1ZcL.png?updatedAt=1639170276005' class=""/>
        </router-link>
</div>
<div class="col-start-6 self-center col-span-2 inline-block text-center mt-10 text-white-light ">&#169; Trash Possums</div>
    
</div>
</template>

<script>
import SubmitEmail from './SubmitEmail.vue'

export default {
components: {SubmitEmail}
}
</script>

<style>
hr{
    border-color: #e3e9e9;
    height: 2px;
   }
</style>