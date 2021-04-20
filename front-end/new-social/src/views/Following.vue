<template>
  <div>
    <h1> Friends! </h1>
    <div v-if="ifFollowing()">
      <h3> You arn't following anyone! Look around on Global to find people to follow! </h3>
    </div>
    <div vi-else>
      <p class="header"> Here is your specilized Feed! This will just show the people you Follow! </p>
      <p class="header"> If you want to unfollow someone, just click the "unFollow" button! </p>
      <PostList :posts="filterPosts" />
    </div>
  </div>
</template>

<script>
import axios from 'axios';
import PostList from "../components/PostList.vue"
export default {
  name: 'Following',
  components: {
    PostList
  },
  data() {
    return {
      following: [],
      posts: [],
    }
  },
  created() {
    this.getPosts();
    this.getFollowing();
  },
  computed: {
    filterPosts() {
      this.getFollowing();
      var addPost = [];
      var currPost = this.posts;
      for(var i = 0; i < currPost.length; i++) {
        if(this.following.includes(currPost[i].userName)) {
          addPost.push(currPost[i]);
        }
      }
      return addPost;
    },
  },
  methods: {
    ifFollowing() {
      if(this.following.length < 1) {
        return true;
      }
      else {
        return false;
      }
    },
    async getFollowing() {
      try {
        let response = await axios.get("/api/users/" + this.$root.$data.user._id);
        var user = response.data;
        this.following = user.following;
        return true;
      } catch (error) {
        //console.log(error);
      }
    },
    async getPosts() {
      try {
        let response = await axios.get("/api/posts");
        this.posts = response.data;
        return true;
      } catch (error) {
        console.log(error);
      }
    },
  }
}
</script>

<style scoped>


h1 {
  text-align: center;
  text-decoration: underline;
  margin-bottom: 30px;
}

p {
  text-align: center;
}

.header {
  font-size: 20px;
}

h3 {
  text-align: center;
}
p {
  text-align: center;
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
