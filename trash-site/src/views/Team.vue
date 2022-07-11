<template>
  <div
    class="h-auto md:m-auto w-full p-5 mt-5 text-white-light"
  >
    <h1 class="text-5xl">The Team</h1>
    <div v-for="member in members" :key="member.name">
      <center-box-vue
        :name="member.name"
        :image="member.image"
        :description="member.description"
      ></center-box-vue>
    </div>
  </div>
</template>

<script>
import centerBoxVue from "../components/centerBox.vue";
export default {
  name: "Team",
  components: { centerBoxVue },
  data() {
    return {
      members: [
        {
          name: "Stoney O'Possum",
          image:
            "https://ik.imagekit.io/trashpossums/assets/C2A35DF6-EFEF-4E0A-80D9-21552A94DD6D_pv8M62Aqeab.jpeg?updatedAt=1639521998737",
          description:
            "Attaining oneness with life and toking across the continent to better understand who these 'humans' were as a species.",
        },
        {
          name: "Buskrat Slim",
          image:
            "https://ik.imagekit.io/trashpossums/assets/3BE34223-01DB-4DA8-8F68-C21ACE46D623_UpaAiBx6j9.jpeg?updatedAt=1639522000673",
          description:
            "He is a possum.  he busks.  check out that lethal harmonica bandolier.",
        },
        {
          name: "Baron Von Parton",
          image:
            "https://ik.imagekit.io/trashpossums/assets/AC1D1B67-FC1D-4032-BCD8-20DB1F1148AE_MSHV_wL9pwq.jpeg?updatedAt=1639522000833",
          description:
            "Baron Von Parton enjoys wearing hard clothing, and exploring the humans obsession with violence.",
        },
        {
          name: "Marsu Poss: Starbage Hauler",
          image:
            "https://ik.imagekit.io/trashpossums/assets/Marsu_poss_starbage_hauler_AydMLZ2tG.png?ik-sdk-version=javascript-1.4.3&updatedAt=1657500077890",
          description:
            "A spacefaring rogue trader and seeker of trash from across the Milky Way. Aboard the starbage hauler Hopium, with his tail droid Mr. Pinchy, he naps and hauls and collects his way through the galaxy looking for anything and everything that can better possumkind.",
        },
        {
          name: "The SousaMaPoss",
          image:
            "https://ik.imagekit.io/trashpossums/assets/75A0A23E-9865-4900-9B5B-E5D8735F66D9_Z2h3aifj2.jpeg?updatedAt=1639521995175",
          description:
            "Something something social media maybe?  something something.",
        },
        {
          name: "Mr DeadCe11",
          image:
            "https://ik.imagekit.io/trashpossums/assets/614E777F-009C-4838-941D-DDCF93464B62_RRIXGzQtlXZ.jpeg?updatedAt=1639521995673",
          description:
            "Single handedly making sure all possum-kind is Y2K compliant.",
        },
      ],
    };
  },
};
</script>

<style></style>
