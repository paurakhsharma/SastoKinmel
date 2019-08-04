<template>
  <div class="predict">
    <router-link class="back" to="/">Go back</router-link>

    <div class="hello">
      <form @submit.prevent="predict">
        <label for="name">Name</label>
        <input type="text" id="name" placeholder="enter product's name" v-model="name" />
        <label for="details">Details</label>
        <textarea  rows="6" cols="30" class="text-area" type="text" id="details" placeholder="enter product's detail" v-model="details" />
        <button type="submit" @click.prevent="predict" v-if="!loading">Predict</button>
      </form>
      <div class="result">
        <sync-loader :loading="loading"></sync-loader>
        <div v-if="!loading  && result">
          <table id="categories">
            <tr>
              <th>Category</th>
              <th>Sub Category</th>
            </tr>
            <tr v-for="(category, i) in categories" :key="category.category">
              <td>
                <span>{{category.category}}</span>	&nbsp;
                <span>{{category.score | toPercentage}}</span>
              </td>
              <td>
                <span>{{subCategories[i].category}}</span>	&nbsp;
                <span>{{subCategories[i].score | toPercentage}}</span>
              </td>
            </tr>
          </table>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import SyncLoader from "vue-spinner/src/SyncLoader.vue";
import Vue from 'vue'

Vue.filter('toPercentage', function (value) { 
    return Math.round(value * 100) + '%'
})

export default {
  data() {
    return {
      name: "",
      details: "",
      predicted: false,
      result: "",
      loading: false
    };
  },
  methods: {
    predict() {
      this.loading = true;
      console.log("sending");
      const fd = new FormData();
      fd.append("name", this.name);
      fd.append("details", this.details);
      const path = "http://localhost:5000/api/upload";
      this.axios
        .post(path, fd)
        .then(response => {
          this.predicted = true;
          this.result = response.data.result;
          this.loading = false;
          console.log(this.result);
        })
        .catch(err => {
          this.predicted = false;
          this.loading = false;
        });
    }
  },
  components: {
    SyncLoader
  },
  computed: {
    categories() {
      return this.result.category.slice(0, 3);
    },
    subCategories() {
      return this.result.subCategory.slice(0, 3);
    }
  },
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

input, textarea {
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

#categories {
  font-family: "Trebuchet MS", Arial, Helvetica, sans-serif;
  border-collapse: collapse;
  width: 100%;
  margin-top: 40px;

  & td,
  & th {
    border: 1px solid #ddd;
    padding: 8px;
  }

  & tr:nth-child(even) {
    background-color: #f2f2f2;
  }

  & tr:hover {
    background-color: #ddd;
  }

  & th {
    padding-top: 12px;
    padding-bottom: 12px;
    text-align: left;
    background-color: #42b983;
    color: white;
  }
}
</style>
