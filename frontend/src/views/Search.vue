<template>
  <div class="about">
    <form @submit.prevent="search">
      <input type="text" v-model="search_param" />
      <button type="submit" @click.prevent="search">Search</button>
    </form>
    <router-link class="predict-btn" to="/predict">Predict</router-link>

    <span v-if="noItemFound" class="text-warn">No items found</span>

    <div class="loader" v-if="loading">
      <moon-loader :loading="loading" class="loader-element"></moon-loader>
    </div>

    <transition-group name="list" tag="p" class="products">
      <div class="product" v-for="product in products" :key="product._id">
        <ImageItem :source="product.imageUrl" />
        <div class="product-detail">
          <span class="product-name">{{product.name}}</span>
          <span class="product-price">₹ {{product.discountedPrice}}</span>
        </div>
      </div>
    </transition-group>
  </div>
</template>

<script>
import ImageItem from "@/components/ImageItem.vue";
import MoonLoader from "vue-spinner/src/MoonLoader.vue";

export default {
  data() {
    return {
      search_param: "",
      products: [],
      loading: false,
      noItemFound: false
    };
  },
  methods: {
    search() {
      this.loading = true;
      this.axios
        .get(`http://localhost:3000/search?search_param=${this.search_param}`)
        .then(data => {
          console.log(data);
          this.products = data.data;
          this.loading = false;
          if (!this.products.length) {
            this.noItemFound = true;
          }
        });
    }
  },
  components: {
    ImageItem,
    MoonLoader
  }
};
</script>


<style lang="scss">
form {
  padding: 15px;
  margin-top: 50px;

  input {
    font-family: "Dosis", sans-serif;
    padding: 10px;
    width: 350px;
    margin-right: 10px;
    font-size: 16px;
    letter-spacing: 1.2px;
    outline-color: #42b983;
  }

  button {
    border: none;
    font-size: 16px;
    font-weight: 600;
    border-radius: 5px;
    padding: 15px 40px;
    box-shadow: 10px 15px 25px 0.2;
    background-color: #42b983;
    color: white;
    cursor: pointer;

    &:hover {
      transform: translateY(-1.2px);
      background-color: #5ccc9a;
    }

    &:active {
      transform: translateY(1.2px);
    }
  }
}

.text-warn {
  color: rgb(245, 207, 104);
  font-weight: 600;
}

.predict-btn {
  float: right;
  position: relative;
  margin-top: -60px;
  margin-right: 80px;
  border: none;
  font-size: 16px;
  font-weight: 600;
  border-radius: 5px;
  padding: 15px 40px;
  border: solid 1px #42b983;
  box-shadow: 10px 15px 25px 0.2;
  color: #42b983;
  cursor: pointer;
  background-color: white;
  outline: none;
  text-decoration: none;

  &:hover {
    transform: translateY(-1.2px);
  }

  &:active {
    transform: translateY(1.2px);
  }
}

.about {
  position: absolute;
  width: 100%;
}

</style>
