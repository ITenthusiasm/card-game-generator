import Vue from "vue";
import VueRouter from "vue-router";
import Home from "@/views/Home.vue";
import Lobby from "@/views/Lobby.vue";

Vue.use(VueRouter);

const routes = [
  {
    path: "/",
    name: "home",
    component: Home,
  },
  {
    path: "/lobby",
    name: "lobby",
    component: Lobby,
  },
];

const router = new VueRouter({
  mode: "history",
  base: "/",
  routes,
});

export default router;
