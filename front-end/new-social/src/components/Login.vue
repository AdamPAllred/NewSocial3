<template>
  <div>
    <h1> New Social Login or Register </h1>
    <p> Welsom to New Social, please Register to make an account or Login to your account! </p>

    <div class="addPost">
      <h2> Register </h2>

      <input placeholder="First Name" v-model="firstName">
      <input placeholder="Last Name" v-model="lastName">
      <p></p>
      <input placeholder="User Name" v-model="username">
      <input placeholder="Password" v-model="password">
      <p></p>
      <button type="submit" @click.prevent="register"> Register </button>
      <p></p>
      <p v-if="error">{{error}}</p>
    </div>

    <div class="addPost">
      <h2> Login </h2>
      <input placeholder="User Name" v-model="usernameLogin">
      <input placeholder="Password" v-model="passwordLogin">
      <p></p>
      <button type="submit" @click.prevent="login"> Login </button>
      <p></p>
      <p v-if="errorLogin">{{error}}</p>
    </div>

  </div>
</template>


<script>
import axios from 'axios';
export default {
  name: 'HomePage',
  data() {
    return {
      firstName: '',
      lastName: '',
      username: '',
      password: '',
      usernameLogin: '',
      passwordLogin: '',
      error: '',
      errorLogin: '',
    }
  },
  methods: {
    async register() {
      this.error = '';
      this.errorLogin = '';
      if (!this.firstName || !this.lastName || !this.username || !this.password)
        return;
      try {
        let response = await axios.post('/api/users', {
          firstName: this.firstName,
          lastName: this.lastName,
          username: this.username,
          password: this.password,
        });
        this.$root.$data.user = response.data.user;
        this.$root.$data.userID = response.data.user._id;
        console.log(this.$root.$data.userID);
      } catch (error) {
        this.error = error.response.data.message;
        this.$root.$data.user = null;
      }
    },
    async login() {
      this.error = '';
      this.errorLogin = '';
      if (!this.usernameLogin || !this.passwordLogin)
        return;
      try {
        let response = await axios.post('/api/users/login', {
          username: this.usernameLogin,
          password: this.passwordLogin,
        });
        this.$root.$data.user = response.data.user;
        this.$root.$data.userID = response.data.user._id;
      } catch (error) {
        this.errorLogin = "Error: " + error.response.data.message;
        this.$root.$data.user = null;
      }
    },
  },
}
</script>

<style scoped>



h1 {
  text-align: center;
  text-decoration: underline;
  height: 100px;
  padding-top: 50px;
  background-color: #b7d7e8;
}

p {
  text-align: center;
}

.input {
  width: 50%;
}

.register {
  text-align: center;
  margin-right: 15%;
  margin-left: 15%;
  font-size:20px;
  margin-bottom: 50px;
}

.addPost {
  text-align: center;
  margin-right: 15%;
  margin-left: 15%;
  font-size:20px;
  padding-bottom: 30px;
}

</style>
