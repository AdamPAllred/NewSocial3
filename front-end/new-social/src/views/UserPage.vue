<template>
  <div>
    <div class="logout">
      <div class="logout-item">
    <h1> {{this.$root.$data.user.username}}'s Page</h1>
      </div>
      <div class="lougout-item">
    <h2><button @click="logout"> Logout! </button></h2>
      </div>
    </div>
    <div class="info">
      <button @click="editPage">Edit Page</button>
    </div>
      <div class="info">
          <div id="bio"></div>
      </div>
      <div v-if="this.editingPage">
        <div class="info">
          <div>
          <textarea v-model="bio" placeholder="Bio"></textarea>
          </div>
          <div>
          <button @click="editBio(bio)">Edit Bio</button>
          </div>
        </div>
      </div>
    <PostList :posts="filterPosts" />
  </div>
</template>

<script>
import axios from 'axios';
import PostList from "../components/PostList.vue"
export default {
  name: 'Home',
  components: {
    PostList
  },
  data() {
    return {
      editingPage: false,
      bio: null,
      posts: [],
      user: "None right now!!",
    }
  },
  created() {
    this.getPosts();
    this.getBio();
  },
  computed: {
    filterPosts() {
      this.getPosts();
      var addPost = [];
      var currPosts = this.posts;
      for(var i = 0; i < currPosts.length; i++) {
        if(currPosts[i].userName == this.$root.$data.user.username) {
          addPost.push(currPosts[i]);
        }
      }
      return addPost;
    }
  },
  methods: {
    async getPosts() {
      try {
        let response = await axios.get("/api/posts");
        this.posts = response.data;
        return true;
      } catch (error) {
        //console.log(error);
      }
    },
    async getBio() {
      try {
        let response = await axios.get("api/users/" + this.$root.$data.user._id);
        this.user = response.data;
        this.bio = this.user.bio;
        let results = "";
        results += "<p> Bio: ";
        results += this.bio;
        results += "</p>";
        document.getElementById("bio").innerHTML = results;
        return true;
      } catch (error) {
        //console.log(error);
      }
    },
    async editBio(bio) {
        try {
          await axios.put("/api/users/" + this.$root.$data.user._id, {
            bio: this.bio,
            follow: "bio",
          });
          let results = "";
          results += "<p> Bio: ";
          results += bio;
          results += "</p>";
          document.getElementById("bio").innerHTML = results;
          return true;
        } catch (error) {
          //console.log(error);
        }
    },
    editPage() {
      if(this.editingPage) {
        this.editingPage = false;
      }
      else {
        this.editingPage = true;
      }
    },
    async logout() {
      try {
        await axios.delete("/api/users");
        this.$root.$data.user = null;
      } catch (error) {
        this.$root.$data.user = null;
      }
    },
  }
}
</script>

<style scoped>
.info {
  text-align: center;
  margin-right: 15%;
  margin-left: 15%;
  font-size:20px;
}


h1 {
  text-align: center;
  text-decoration: underline;
  margin-bottom: 30px;
}

.logout {
  display: flex;
  align-items: center;
  justify-content: center;
}

.logout-item {

  padding-left: 10px;
  padding-right:10px;
  display: flex;
}

.button {
  font-size: 50px;
}

p {
  text-align: center;
}

.header {
  font-size: 20px;
}




.wrapper {
  display: flex;
  align-items: center;
  justify-content: center;
}

.search {
  border: 1px solid #ccc;
  border-radius: 4px;
  width: 50%;
}

form {
  display: table;
  width: 100%;
}

i {
  display: table-cell;
  padding-left: 10px;
  width: 1px;
}

input {
  display: table-cell;
  font-size: 20px;
  border: none !important;
  box-shadow: none !important;
  width: 100%;
  height: 40px;
}
</style>
