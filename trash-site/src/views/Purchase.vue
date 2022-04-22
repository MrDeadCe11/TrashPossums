<template>
<div class="purchase container items-center flex sm:h-screen mt-20 mx-auto">      
  <div class="w-4/5 mb-10 p-5 mx-auto bg-gray-light rounded-xl">
    <div class="title mb-3">      
    <h1 class="font-bold w-auto text-white-light text-center sm:text-5xl text-xl"> 
           Get you some possums
     </h1>  
     </div>
     <div v-if="!connected">
      <connect-wallet/>
    </div>    
    <div v-else class="flex-col h-auto w-auto justify-center">     
      <form @submit.prevent="submit">
        <div class="w-auto justify-center flex"> 
            <button class="bg-blue-light w-32 h-14 rounded-l-xl" @click="decrement"><h1 class="text-4xl text-white-light">-</h1></button>                    
            <input type="number"  v-model="numberField" min="1" max="27" id="numberField" class="text-center w-40 h-14 text-4xl"/>          
            <button class="bg-blue-light w-32 h-14 rounded-r-xl" @click="increment"><h1 class="text-align-middle text-4xl text-white-light">+</h1></button>  
        </div>
        <div class="flex mx-auto justify-center">
          <button v-if="!res" type="submit" :disabled="res" @click="submitPurchase" class=" bg-blue-dark mt-3 w-1/3 mx-auto text-white-light rounded-xl p-5"><h1 class="text-bold text-xl">RESERVE</h1></button>
        </div>
        <div class="flex-col text-white-light mx-auto text-2xl mt-6 mb-6 sm:w-1/2 w-auto p-5 bg-gray-dark justify-center shadow-2xl rounded-lg">
            <div class="flex justify-center"><p><h1>You have <span class="text-yellow-light text-4xl">{{ reservedPossums }} </span> possums reserved</h1></p></div>
            <div v-if="claimedPossums > 0" class="flex justify-center"><p><h1>You have claimed <span class="text-yellow-light text-4xl">{{claimedPossums}}</span> Possums</h1></p> </div>
            
        </div>
        <div class="flex justify-center">
          <p v-if="!claimable" class="text-white-light text-2xl font-extrabold">Possums are claimable on {{ claimDate }}</p>
          <p v-else class="text-white-light text-2xl font-extrabold">offset is: {{offset}} </p>
        </div>        
      </form>
      <div class="mx-auto flex justify-center"> 
        <button v-if="claimable" @click="claimSomePossums" class="shadowed-xl bg-blue-dark mt-3 w-1/3 text-white-light rounded-xl p-5"><h1 class="text-bold text-xl">CLAIM</h1></button>
      </div>
        <p class="text-white-light text-center font-extrabold text-xl mt-3">Max of 27 possums per wallet</p>     
      </div>
    </div>   
  </div>
  <div class="text-extrabold text-white-light">{{claimedPossumIds}}</div>
</template>


<script>
import {useStore} from 'vuex'
import {computed, watchEffect, ref, onMounted} from 'vue'
import ConnectWallet from '../components/ConnectWallet.vue'
import {reservePossums, reservedPossums, claimPossums, claimedPossums, getCurrentStamp, getClaimedPossumsIds} from "../utils/web3Helpers.js"

export default {
  name:  'Purchase',
  components: {ConnectWallet},
  watch: {
  },  
  setup() {
      const store = useStore();
    
      let numberField = ref(0);
      let res = ref(false);

      const getDate = (date) => {
        const month = date.getMonth() +1;
        const day = date.getDate();
        const year = date.getFullYear();
        const twentyFourHour = date.getHours();
        const minute = date.getMinutes();
        const hour = Number(twentyFourHour) > 12 ? Number(twentyFourHour) -12 : twentyFourHour 
        const fullDate = `${month}/${+day}/${year} at ${hour}:${minute} ${Number(twentyFourHour) >12 ? "pm" : "am"} (UTC)` 
        return fullDate
      }

      let currentStamp = computed(()=>{
        const date = store.getters.getCurrentStamp    
        if(date > 0){
          const fulldate = getDate(new Date(date));
          return fulldate
        } else {
          return "NEVER!";
        }
        
      })

async function claimSomePossums(){
   await claimPossums();  
}

let claimDate = computed(()=>{
        const date = store.getters.getClaimDate
        if(date > 0){
          const fulldate = getDate(new Date(date));
          return fulldate
        } else {
          return "NEVER!";
        }
      }
      )
      
      const modifyable = computed(()=>{
        if (numberField.value >= 0 && numberField.value <= 27){    
          return true
        } else {      
          return false
        }
      })

      const toggleRes = () => {   
        res.value ? res.value = false: res.value = true;
        return res.value
      }
      
      async function submitPurchase(e){
        if(numberField.value>0){  
            e.preventDefault();
            toggleRes();
        try{
            await reservePossums(numberField.value);
            
        } catch(error){
            console.error(error)
        }
            await reservedPossums(); 
            toggleRes();     
      }
        else {
          console.log("need to reserve more than zero possums")
      }
      }
      

      const increment = () => {
        if(modifyable.value){    
          numberField.value++
        }else if(!modifyable.value && numberField.value >26){    
          numberField.value = 27
        }else if(!modifyable.value && numberField.value < 1){    
          numberField.value = 0
        }    
        }

      const decrement = () => {
        if(modifyable.value){
          numberField.value--
        } else if(!modifyable.value && numberField.value < 1){
          numberField.value= 0
        } else if(!modifyable.value && numberField.value > 26){
          numberField.value = 27
        }
      }

  return {
      connected: computed(()=>store.getters.getConnected),     
      reservedPossums: computed(()=>store.getters.getReservedPossums),
      claimable: computed(()=> store.getters.getClaimable),
      offset: computed(()=> store.getters.getOffset),
      claimedPossums: computed(()=> store.getters.getClaimedPossums),
      claimedPossumIds: computed(()=>{let ids = store.getters.getClaimedIds
      return ids?ids.toString():null}),
      claimDate,
      currentStamp,
      numberField,
      increment,
      decrement,
      res,
      submitPurchase,
      claimSomePossums
      }
  }
}
</script>

<style>
h1{
  font-family: "Banco";  
}
</style>