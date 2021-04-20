<template>
<div class="wrapper">
  <div class="posts">
    <div class="post" v-for="post in posts" :key="post.id">
      <div class="info" :style="'background-color:' + post.color">
          <div class="username">
            <h1>{{post.userName}}</h1>
          </div>
        <div class="button">
          <div v-if="onMyPage()">
            <div v-if="notFollowing(post.userName)">
              <button class="auto"><a v-on:click="follow(post)">Follow {{post.userName}}</a></button>
            </div>
            <div v-else>
              <button class="auto"><a v-on:click="unFollow(post)">UnFollow {{post.userName}}</a></button>
            </div>
          </div>
          <div v-else>
            <button class="auto"><a v-on:click="deletePost(post)">Delete Post</a></button>
          </div>
        </div>
      </div>
      <div class="middle">
        <div class="middle-item">
          <div class="image">
            <img :src="post.path">
          </div>
        </div>
        <div class="middle-item">
            <div class="description">
              <p> {{post.description}} </p>
            </div>
          </div>
        </div>
        <div class="description" :style="'background-color:' + post.color">
          <div class="bottom">
            <div class="bottom-item">
              <div class="tag">
                <div v-for="value in post.tags" :key="value.id">
                  <div class="tag-item">
                  <h2> #{{value}} </h2>
                  </div>
                </div>
            </div>
          </div>
          <img :src="'/images/'+post.heart" style="width: 50px; margin-right: 30px;" v-on:click="liked(post)">
          </div>
          <div class="bottom-item">
          <p>Posted in - {{post.country}}</p>
        </div>
        </div>
    </div>
  </div>
</div>
</template>

<script>
import axios from 'axios';
export default {
  name: 'PostList',
  props: {
    posts: Array,
  },
  data() {
    return {
      following: [],
    }
  },
  created() {
    this.getFollowing();
  },
  methods: {
    async unFollow(post) {
      try {
        await axios.put("/api/users/" + this.$root.$data.user._id, {
          userName: post.userName,
          follow: false,
        });
        this.getFollowing();
        return true;
      } catch (error) {
        //console.log(error);
      }
    },
    async follow(post) {
      try {
        await axios.put("/api/users/" + this.$root.$data.user._id, {
          userName: post.userName,
          follow: true,
        });
        this.getFollowing();
        return true;
      } catch (error) {
        //console.log(error);
      }
    },
    async getFollowing() {
      try {
        let response = await axios.get("/api/users/" + this.$root.$data.user._id);
        let user = response.data;
        this.following = user.following;
        return true;
      } catch (error) {
      //console.log(error);
      }
    },
    notFollowing(userName) {
      if(this.following.includes(userName)) {
        return false;
      }
      else {
        return true;
      }
    },
    onMyPage() {
      if(this.$root.$data.bold == 2) {
        return false;
      }
      else {
        return true;
      }
    },
    async deletePost(post) {
      try {
        await axios.delete("/api/posts/" + post._id);
        return true;
      } catch (error) {
        //console.log(error);
      }
    },
    async liked(post) {
      try {
        if(post.heart == "noColorHeart.png") {
          await axios.put("/api/posts/" + post._id, {
            heart: true,
            });
          post.heart = "colorHeart.png";
        }
        else {
          await axios.put("/api/posts/" + post._id, {
            heart: false,
            });
          post.heart = "noColorHeart.png";
        }
        return true;
      } catch (error) {
        //console.log(error);
      }
    },
  }
}
</script>

<style scoped>
.bottom {
  display: flex;
  align-items: left;
  text-align: left;
  width: 100%;
}

.bottom-item {
  width: 100%;
  display: flex;
}

.tag {
  display: flex;
  align-items: left;
  justify-content: flex-start;
  text-align: left;
}

.tag-item {
  margin-right: 10px;
  display: flex;
}

.delete {
  background-color: red;
}

.wrapper {
  display: flex;
  align-items: center;
  justify-content: center;
}

.tags {
  display: inline;
}

.posts {
  margin-top: 20px;
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
}

.middle {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.middle-item {
  width: 700px;
  margin-left: 5%;
  margin-right: 5%;
  display: flex;
}

.post {
  border: 2px solid black;
  margin: 10px;
  margin-top: 50px;
  margin-right: 30px;
  margin-left: 30px;
  width: 50%;
  background-color: white;
}

.post img {
  margin-top: 5px;
  border: 2px solid #333;
  height: 90%;
  width: 90%;
  object-fit: cover;
}

.post .image {
  display: flex;
  justify-content: center;
  margin-bottom: 5px;
}

.info {
  display: flex;
  background: #daebe8;
  color: #000;
  padding: 10px 30px;
  height: 80px;
}

.username {
  font-size: 25px;
  width: 80%;
}

.button {
  width: 100px;
  text-align: right;
}

.description {
  text-align: left;
  padding-left: 10px;
  padding-bottom: 8px;
}

.info h1 {
  font-size: 100%;
  text-align: left;
}

.info h2 {
  font-size: 14px;
}

h2 {
  font-size: 20px;
}

.info p {
  text-align: left;
  font-size: 90%;
}

button {
  height: 50px;
  background: #000;
  color: white;
  border: none;
}

.auto {
  margin-left: auto;
}

</style>
