<template>
<hr  class="color-brown-light m-auto" width="90%">
<div class="footer grid grid-cols-3 grid-flow-col gap-4">
    <div class="col my-10 ml-10" >
        <form action="" class="email-form">
        <input class="m-0 email-input-text" required="" type="email" name="mailinglist" id="mailingList" placeholder="email">
        <button class="email-submit"></button>
        <p class="text-white-light inline-block ml-5 font-bold">get on the mailing list</p>
    </form>
    </div>
    <div  class="
    col m-auto
          row-start-1   
          w-80 p-2     
          ">
     <router-link
          to="/"
         >
          <img src='https://ik.imagekit.io/trashpossums/assets/logo_zt0ryp8T_s.png?updatedAt=1639170269961' class=""/>
        </router-link>
</div>
<div class="col text-white-light justify-items-end">&#169; Trash Possums</div>
    
</div>
</template>

<script>
export default {

}
</script>

<style>
hr{
    color: #e3e9e9;
    height: 5px;
}
</style>