<template>
<hr  class="color-white-light m-auto" width="90%">
<div class="footer grid grid-cols-6 grid-flow-col justify-between gap-4">
    <div class="my-20 ml-10" >
        <form action="" class="email-form">
        <label class="text-white-light text-center">get on the mailing list</label>
        <div class="flex">
        <input class="m-0 email-input-text" required="" type="email" name="mailinglist" id="mailingList" placeholder="email">
        <button class="email-submit text-white-light">button</button>
        </div>
    </form>
    </div>
    <div  class="
    col-start-3 justify-center align-middle m-auto            
         col-span-2 p-2     
          ">
     <router-link
          to="/"
         >
          <img src='https://ik.imagekit.io/trashpossums/assets/group-logo_-k58ey1ZcL.png?updatedAt=1639170276005' class=""/>
        </router-link>
</div>
<div class="align-middle col-start-6 col-span-2 inline-block text-center mt-20 text-white-light ">&#169; Trash Possums</div>
    
</div>
</template>

<script>
export default {

}
</script>

<style>
hr{
    border-color: #e3e9e9;
    height: 2px;
   }
</style>