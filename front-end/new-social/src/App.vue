<template>
<div class="overall">
  <div v-if="user">
  <div class="menu">
    <div class="link" v-on:click="updateBold(0)">
      <router-link style="text-decoration: none;" to="/">
        <div v-if="bold(0)">
          <p style="text-decoration: underline;"><strong> Global </strong></p>
        </div>
        <div v-else>
          <p> Global </p>
        </div>
      </router-link>
    </div>
    <div class="link" v-on:click="updateBold(1)">
      <router-link style="text-decoration: none;" to="/following">
        <div v-if="bold(1)">
          <p style="text-decoration: underline;"><strong> Friends </strong></p>
        </div>
        <div v-else>
          <p> Friends </p>
        </div>
      </router-link>
    </div>
    <div class="link" v-on:click="updateBold(2)">
      <router-link style="text-decoration: none;" to="/userPage">
        <div v-if="bold(2)">
          <p style="text-decoration: underline;"><strong> My Page </strong></p>
        </div>
        <div v-else>
          <p> My Page </p>
        </div>
      </router-link>
    </div>
    <div class="link" v-on:click="updateBold(3)">
      <router-link style="text-decoration: none;" to="/addPost">
        <div v-if="bold(3)">
          <p style="text-decoration: underline;"><strong> Add Post </strong></p>
        </div>
        <div v-else>
          <p> Add Post </p>
        </div>
      </router-link>
    </div>
  </div>
  <router-view />
  </div>
  <Login v-else/>
  <p><a href="https://github.com/AdamPAllred/NewSocial">GitHub Link! I spent 6 hours!</a></p>




</div>
</template>


<script>
import Login from '@/components/Login.vue';
import axios from 'axios';
export default {
  name: 'App',
  components: {
    Login,
  },
  async created() {
    try {
      let response = await axios.get('/api/users');
      this.$root.$data.user = response.data.user;
    } catch (error) {
      this.$root.$data.user = null;
    }
  },
  computed: {
    user() {
      return this.$root.$data.user;
    }
  },
  methods: {
    bold(index) {
      if(this.$root.$data.bold == index) {
        return true;
      }
      else {
        return false;
      }
    },
    updateBold(index) {
      this.$root.$data.bold = index;
    },
  },
}
</script>

<style>

p {
  text-align: center;
}

.overall {
  background-color: #cfe0e8;
}

.menu {
  margin-top: 20px;
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  background-color: #b7d7e8;
}

.link {
  margin: 5%;
  margin-top: 50px;
  width: 100px;
  text-align: center;

  text-color: black;
  text-decoration: none;
  font-size: 25px;
}

.link p {
  color: black;
}



</style>
