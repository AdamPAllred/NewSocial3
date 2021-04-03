import Vue from "vue";
import VueRouter from "vue-router";
import Home from "../views/Home.vue";
import Following from "../views/Following.vue";
import UserPage from "../views/UserPage.vue";
import AddPost from "../views/AddPost.vue";

Vue.use(VueRouter);

const routes = [
  {
    path: "/",
    name: "Home",
    component: Home
  },
  {
    path: "/following",
    name: "Following",
    component: Following
  },
  {
    path: "/userPage",
    name: "UserPage",
    component: UserPage
  },
  {
    path: "/addPost",
    name: "AddPost",
    component: AddPost
  }
];

const router = new VueRouter({
  mode: "history",
  base: process.env.BASE_URL,
  routes
});

export default router;
