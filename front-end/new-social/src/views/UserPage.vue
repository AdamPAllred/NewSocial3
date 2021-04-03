<template>
  <div>
    <h1> Beth123's Page</h1>
    <div class="info">
      <button @click="editPage">Edit Page</button>
    </div>
      <div class="info">
          <div id="bio"></div>
      </div>
      <div v-if="this.editingPage">
        <div class="info">
          <input v-model="bio" placeholder="Bio">
          <button @click="editBio(bio)">Edit Bio</button>
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
        if(currPosts[i].userName == "Beth123") {
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
        console.log(error);
      }
    },
    async getBio() {
      try {
        let response = await axios.get("api/users/6065fb95a7c2de476c9274b0");
        this.user = response.data;
        this.bio = this.user.bio;
        let results = "";
        results += "<p> Bio: ";
        results += this.bio;
        results += "</p>";
        document.getElementById("bio").innerHTML = results;
        return true;
      } catch (error) {
        console.log(error);
      }
    },
    async editBio(bio) {
        try {
          await axios.put("/api/users/6065fb95a7c2de476c9274b0", {
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
          console.log(error);
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

.button {
  font-size: 25px;
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
