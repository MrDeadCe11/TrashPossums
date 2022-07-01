<template>
  <div
    class="static-z-10"
    @click.self="$emit('appclicked', $event.target.value)"
    style="
      transition: opacity 400ms ease 0s, transform 400ms ease 0s;
      transform: none;
      opacity: 1;
    "
  >
    <div class="grid grid-cols-6 grid-rows-auto gap-4 p-5 -z-10">
      <div class="m-auto col-span-6 row-span-6 w-5/6 -z-50">
        <img
          src="https://ik.imagekit.io/trashpossums/assets/possum_central_naked_Jm05jJafT.png?updatedAt=1639249322920"
          class="static m-5 h-auto w-auto -z-50"
        />
      </div>

      <h1 class="d-flex col-span-6 mb-3 ml- 10 text-4xl text-white-light">
        The Trash Possums are Coming!
      </h1>
      <div class="mb-5 flex col-span-4 flex-row">
        <p class="sm:text-2xl text-xl text-white-light ml-5">
          In the year 2421, centuries after irradiated hurricanes caused the
          evolution of rabies into an incurable pestilence across the globe.
          With humanity long extinct, the Trash 'Possums have risen. Shaping
          their entire society around humans' pop culture icons, which they
          regard as deities. The Trash Possums have improved on tech left by
          humanity and traverse the near infinite expanse of the universe along
          with improving the earth left by humans.
        </p>
      </div>
      <div class="col-span-2 row-span-2">
        <div class="grid sm:grid-cols-2 w-5/6 ml-5 grid-cols-1">
          <Gallery
            :images="pfpImages"
            :sliceStart="sliceStart"
            :sliceEnd="sliceEnd"
          />
        </div>
      </div>
      <div class="col-span-4">
        <h1 class="col-span-2 mb-3 ml-5 text-4xl text-white-light">
          Fair launch and minting
        </h1>
        <div class="flex col-span-3">
          <p class="sm:text-2xl text-xl text-white-light ml-10">
            Trash Possums is an NFT collection on Polygon. We will have a
            totally fair launch. Each token ID is generated using a pseudo
            random number generator in the contract when the user reserves a
            possum. After all the possums have been reserved or a certain period
            of time has passed (chosen by the community) we will use an integer
            chosen by Chainlink VRF to offset the IDs to their final value. All
            metadata and properties will be revealed on the release date and the
            final token ids will be revealed after the VRF has been fulfilled.
          </p>
        </div>
        <div class="col-span-full mt-5">
          <h1 class="col-span-2 mb-3 ml-5 text-4xl text-white-light">
            Reserving and Claiming your NFT
          </h1>
          <div class="flex col-span-6">
            <p class="sm:text-2xl text-xl text-white-light ml-10">
              You can reserve up to 27 Trash possums during the reserve period
              and reserving will cost the full price of the nft. <br> When you claim
              your nft on or after the claim date you will only pay gas for the
              minting of your nft.
            </p>
          </div>
        </div>
      </div>
      <div class="h-auto col-span-full sm:col-span-3 sm:col-start-2 text-white-light mt-32 mb-8">
        <div
          class="p-5 rounded-md border-white-light border-4 shadow-xl"
        >
          <h1 class="font-bold text-xl sm:text-3xl">Roadmap:</h1>

          <ul class="sm:text-2xl text-lg sm:ml-8 p-1 sm:p-5">
            <li class="mb-5">
              <p>
                <span class="font-bold text-xl"> 20% </span> We pay back our
                wives’ boyfriends
              </p>
            </li>
            <li class="mb-5">
              <p>
                <span class="font-bold text-xl"> 40% </span> Launch Trash Dao
              </p>
            </li>
            <li class="mb-5">
              <p><span class="font-bold text-xl"> 60% </span> Roach Buddies.</p>
            </li>
            <li class="mb-5">
              <p>
                <span class="font-bold text-xl"> 80% </span> Special edition pog
                run.
              </p>
            </li>
            <li>
              <p>
                <span class="font-bold text-xl"> 100%</span> Trash Possums
                series two.
              </p>
            </li>
            <br />
          </ul>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Gallery from "../components/Gallery.vue";
import Footer from "../components/Footer.vue";
import { computed, ref } from "vue";
import pfpImagesArr from "../store/modules/pfpImagesArr";
import { useStore } from "vuex";

export default {
  name: "Home",
  components: { Gallery, Footer },
  mounted() {},
  setup() {
    const pfpImages = ref([...pfpImagesArr]);
    const sliceStart = computed(() => Math.floor(Math.random() * 19));
    const sliceEnd = computed(() => sliceStart.value + 4);

    return { pfpImages, sliceStart, sliceEnd };
  },
};
</script>

<style scoped>
.possumworld {
  max-height: 50%;
  max-width: 70%;
  margin: auto auto;
  margin-top: 70px;
}
h1 {
  font-family: "Banco";
}
</style>
