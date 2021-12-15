<template>
<hr  class="color-white-light m-auto" width="90%">
<div class="flex p-5">
     <div class="flex m-auto">
          <h1 class="text-white-light mt-auto mb-auto mr-2">Join the Mailing List</h1>
    <SubmitEmail/>
    </div>
    <div  class="
    max-w-lg h-auto m-auto            
         col-span-2 p-2     
          ">
     <router-link
          to="/"
         >
          <img src='https://ik.imagekit.io/trashpossums/assets/group-logo_-k58ey1ZcL.png?updatedAt=1639170276005' class=""/>
        </router-link>
</div>
<div class="m-auto text-center text-white-light ">&#169; Trash Possums</div>
    
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