<template>
<div class="purchase container items-center flex sm:h-screen m-auto">
  <div class="md:hidden visible justify-center align-middle">
    <h1 class="text-white-light text-4xl flex-row mb-20 min-h-screen p-5">wallet connect does not work on mobile. Please access on a desktop.</h1>
  </div>      
  <div v-if="!isMobile" class="w-4/5 mb-10 p-5 mx-auto bg-gray-light rounded-xl">
    <div class="title mb-3">      
    <h1 class="font-bold w-auto text-white-light text-center sm:text-5xl text-xl"> 
           Get you some possums
     </h1>  
     </div>
     <div v-if="!connected" class="flex-row">
     <p class="text-white-light text-xl text-center mb-3">Must be connected to Polygon.  Add it <a href="https://docs.polygon.technology/docs/develop/metamask/config-polygon-on-metamask#polygon-scan" class="underline hover:">here.</a></p>
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
          <div class="flex justify-center">
        <p class="text-white-light text-2xl font-extrabold">Possums are {{possumPrice}} Matic</p>  
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
  <div v-show="claimedPossumIds.length > 0" class="grid grid-cols-4">
  <Gallery :images="claimedPossumIds" :sliceStart="0" :sliceEnd="claimedPossumIds.length -1"/>  
</div>
</template>


<script>
import {useStore} from 'vuex'
import {computed, watchEffect, ref, onMounted, defineAsyncComponent} from 'vue'
import ConnectWallet from '../components/ConnectWallet.vue'
import {reservePossums, reservedPossums, claimPossums} from "../utils/web3Helpers.js"
import axios from 'axios'
import Gallery from '../components/Gallery.vue'

export default {
  name:  'Purchase',
  components: {ConnectWallet, Gallery},
  watch: {
  },  
  setup() {
    
      const store = useStore();
    
      let numberField = ref(0);
      let res = ref(false);
      const contract = store.getters.getTrashpossums;
      const signerAddress = store.getters.getAddress;



      const getDate = (date) => {
        const month = date.getMonth() +1;
        const day = date.getDate();
        const year = date.getFullYear();
        const twentyFourHour = date.getHours();
        const minute = date.getMinutes();
        const hour = Number(twentyFourHour) > 12 ? Number(twentyFourHour) - 12 : twentyFourHour 
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
        await claimPossums(contract, signerAddress);  
      }

      let claimDate = computed(()=>{
        const date = store.getters.getClaimDate;
          if(date > 0){
            const fulldate = getDate(new Date(date));
            return fulldate;
          } else {
            return "NEVER!";
          }
      }
      )
      
      const modifiable = computed(()=>{
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
          console.log("number", numberField.value, "contract",contract,"signer", signer)
            await reservePossums(numberField.value, contract, signer);
            
        } catch(error){
            console.error(error)
        }
            await reservedPossums(contract, signer); 
            toggleRes();     
      }
        else {
          console.log("need to reserve more than zero possums")
      }
      }
      

      const increment = () => {
        if(modifiable.value){    
          numberField.value++
        }else if(!modifiable.value && numberField.value >26){    
          numberField.value = 27
        }else if(!modifiable.value && numberField.value < 1){    
          numberField.value = 0
        }    
        }

      const decrement = () => {
        if(modifiable.value){
          numberField.value--
        } else if(!modifiable.value && numberField.value < 1){
          numberField.value= 0
        } else if(!modifiable.value && numberField.value > 26){
          numberField.value = 27
        }
      }

      const claimedPossumIds = computed(()=>{
      
      let ids = store.getters.getClaimedIds
      ids?ids.toString():null
      let uri = store.getters.getBaseURI
      let uriArray = [];
        if(ids && uri){
          ids.forEach((entry, index)=> {
            uriArray.push(uri +'/'+entry.toString()+'.json')
           
          })
        
        let imageURIArray = []

        uriArray.forEach((entry, index)=> {
          try{
          axios.get(entry).then(res => imageURIArray.push(res.data)).catch((error)=>console.log(error))
          } catch (err) {
            console.error("there was a problem retrieving image data", err)
          }
          });
        console.log(imageURIArray)
        return imageURIArray
        
          } else {
          return uriArray
        }
       })

      async function fetchImage(url){
        console.log('URL', url)
        const image = axios.get(url).then(res=> console.log("RESPONSE",res)) 
        console.log("IMAGE",image)
        return image
      }

      const isMobile = computed(() =>{
        let mobile = window.innerWidth <= 760 ? true :false
       return mobile
      })
 
  return {
      connected: computed(()=>store.getters.getConnected),     
      reservedPossums: computed(()=>store.getters.getReservedPossums),
      claimable: computed(()=> store.getters.getClaimable),
      offset: computed(()=> store.getters.getOffset),
      claimedPossums: computed(()=> store.getters.getClaimedPossums),
      claimedPossumIds,
      possumPrice: computed(()=> store.getters.getPossumPrice),
      claimDate,
      currentStamp,
      numberField,
      increment,
      decrement,
      res,
      submitPurchase,
      claimSomePossums,
      isMobile,
      }
  }
}
</script>

<style>
h1{
  font-family: "Banco";  
}
</style>