<template>
  <div>
    <h1> Add Post </h1>

    <div >
      <div class="addPost">

        <input v-model="country" placeholder="country">
        <p></p>
        <input type="file" name="photo" @change="fileChanged">
        <p></p>
        <p>#<input v-model="tags" placeholder="HashTag"></p>
        <p></p>
        <textarea v-model="description" placeholder="Description"></textarea>
        <p></p>
        <input v-model="color" placeholder="Color: CSS code or Regular">
        <p></p>
        <button @click="post">Post</button>
      </div>
      <div  v-if="addPost">
        <p> Successfully Posted!!! </p>
      </div>
    </div>
  </div>
</template>


<script>
import axios from 'axios';
  export default {
    name: 'AddPost',
    data() {
      return {
        country: "",
        tags: "",
        description: "",
        color: "",
        file: null,
        addPost: null,
        findUserName: "",
        findPost: null,
        posts: [],
        user: "",
      }
    },
    methods: {
      fileChanged(event) {
        this.file = event.target.files[0]
      },
      async post() {
        try {
          const formData = new FormData();
          formData.append('photo', this.file, this.file.name);
          let r1 = await axios.post('/api/photos', formData);
          let r2 = await axios.post('/api/posts', {
            userName: this.$root.$data.user.username,
            country: this.country,
            tags: this.tags,
            color: this.color,
            path: r1.data.path,
            description: this.description,
            heart: "noColorHeart.png",
          });
          this.addPost = r2.data;
        } catch (error) {
          //console.log(error);
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

.input {
  width: 50%;
}

.addPost {
  text-align: center;
  margin-right: 15%;
  margin-left: 15%;
  font-size:20px;
  padding-bottom: 90px;
}

</style>
