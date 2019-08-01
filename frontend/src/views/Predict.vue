<template>
  <div class="predict">
    <router-link class="back" to="/">Go back</router-link>

    <div class="container">
      <div class="form">
        <form @submit.prevent="sendUploadToBackend">
          <label for="name">Name</label>
          <input
            v-model="name"
            placeholder="enter product's name"
            type="text"
            id="name"
            name="name"
          />
          <br />
          <label id="details-label" for="details">Details</label>
          <textarea
            name="details"
            placeholder="enter product's detail"
            id="details"
            rows="4"
            cols="49"
            v-model="details"
          ></textarea>
          <div class="upload">
            <label for="">Upload</label>
            <input type="file" accept="image/jpeg" @change="onFileSelected">
          </div>
          <button @click.prevent="sendUploadToBackend">Submit</button>
        </form>
      </div>
      <div class="result"></div>
    </div>
  </div>
</template>

<script>

export default {
  data() {
    return {
      name: "",
      details: "",
      selectedImage: "",
    };
  },
  methods: {
    sendUploadToBackend() {
      console.log('sending')
      const fd = new FormData()
      fd.append('name', this.name)
      fd.append('details', this.details)
      fd.append('file', this.selectedImage)
      console.log(this.selectedImage)
      const path = "http://localhost:5000/api/upload";
      this.axios.post(path, fd)
        .then((response) => {
          console.log('response', response)
        })
      console.log("tried code in sendUploadToBackend");
    },
    onFileSelected(event) {
      this.selectedImage = event.target.files[0]
    }
  }
};
</script>

<style lang="scss">
.container {
  display: flex;

  form {
    margin-top: 150px;

    label {
      font-size: 18px;
      margin-left: 10px;
    }

    #details {
      margin-left: 40px;
    }

    input,
    textarea {
      margin-top: 10px;
      margin-bottom: 10px;
      margin-left: 10px;
    }
  }
}

.predict {
  position: relative;
  height: 100vh;
  width: 100%;

  .back {
    padding: 10px 15px;
    position: absolute;
    border-radius: 3px;
    border: solid 1px goldenrod;
    top: 15px;
    left: 15px;
    background-color: goldenrod;
    text-decoration: none;
    color: white;
    font-weight: 600;
  }
}
</style>
