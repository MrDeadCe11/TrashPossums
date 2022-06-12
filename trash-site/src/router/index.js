import { createRouter, createWebHistory } from "vue-router";
import Home from "../views/Home.vue";
import Roadmap from "../views/Roadmap.vue";
import Team from "../views/Team.vue";
import Purchase from "../views/Purchase.vue";

const routes = [
  {
    path: "/",
    name: "Home",
    component: Home,
  },
  {
    path: "/roadmap",
    name: "Roadmap",
    component: Roadmap,
  },
  {
    path: "/team",
    name: "Team",
    component: Team,
  },
  {
    path: "/purchase",
    name: "Purchase",
    component: Purchase,
  },
];

const router = createRouter({
  history: createWebHistory(),

  routes,
});

export default router;
