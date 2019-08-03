<template>
  <div class="predict">
    <router-link class="back" to="/">Go back</router-link>

    <div class="hello">
    <form @submit.prevent="predict">
      <label for="name">Name</label>
      <input type="text" id="name" placeholder="enter product's name" v-model="name">
      <label for="details">Details</label>
      <input type="text" id="details" placeholder="enter product's detail" v-model="details">
      <button type="submit" @click.prevent='predict'>Predict</button>
    </form>
    <div class="result">
      <span class="category">{{category}}</span>
      <span class="slash" v-if="predicted"> >> </span>
      <span class="subCategory">{{subCategory}}</span>
    </div>
  </div>

  </div>
</template>

<script>

export default {
  data() {
    return {
      name: "",
      details: "",
      predicted: false,
      category: '',
      subCategory: ''
    };
  },
  methods: {
    predict() {
      console.log('sending')
      const fd = new FormData()
      fd.append('name', this.name)
      fd.append('details', this.details)
      const path = "http://localhost:5000/api/upload";
      this.axios.post(path, fd)
        .then((response) => {
          this.predicted = true
          this.category = response.data.result.category
          this.subCategory = response.data.result.subCategory
          console.log('response', response)
        })
      console.log("tried code in sendUploadToBackend");
    }
  }
};
</script>

<style lang="scss">
.category {
  font-size: 24px;
  font-weight: 700;
}
.slash {
  margin-left: 5px;
  margin-right: 5px;
  font-size: 24px;
  // color: rgb(217, 255, 0);
  font-weight: 1000;
}

.subCategory {
  font-size: 24px;
  font-weight: 700;
}

.hello {
  height: 80vh;
  display: flex;
  align-items: center;
}
.hello form {
  display: flex;
  flex-direction: column;
  width: 40%;
  padding: 0 40px;
}
input {
  padding: 10px;
  border-radius: 5px;
  border: solid 1px #265741;
  box-shadow: 10px 15px 0.5;
  font-size: 18px;
}
label {
  margin-bottom: 5px;
  margin-top: 10px;
}
button {
  margin-top: 20px;
  padding: 15px;
  background: #42b983;
  border: none;
  border-radius: 5px;
  font-weight: 500;
  font-size: 24px;
  color: white;
  letter-spacing: 1.5px;
}
.result {
  display: flex;
  height: 100%;
  width: 100%;
  justify-content: center;
  align-items: center;
}
.survived {
  text-align: center;
  display: flex;
  flex-direction: column;
}
.not-survived {
  text-align: center;
  display: flex;
  flex-direction: column;
}
.result-msg {
  margin-top: 20px;
  font-size: 24px;
  padding: 10px;
  font-weight: 700;
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
