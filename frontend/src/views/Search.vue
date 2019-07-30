<template>
  <div class="about">
    <form @submit.prevent="search">
      <input type="text" v-model="search_param">
      <button type="submit" @click.prevent="search">Search</button>
    </form>

    <transition-group name="list" tag="p" class="products">
      <div class="product" v-for="product in products" :key="product._id">
        <ImageItem :source="product.imageUrl"/>
        <div class=product-detail>
          <span class="product-name">{{product.name}}</span>
          <span class="product-price">₹ {{product.discountedPrice}}</span>
        </div>
      </div>
    </transition-group>
  </div>
</template>

<script>
import ImageItem from '@/components/ImageItem.vue';

export default {
  data() {
    return {
      search_param: '',
      products: []
    }
  },
  methods: {
    search () {
      this.axios.get(`http://localhost:3000/search?search_param=${this.search_param}`)
        .then(data => {
          console.log(data)
          this.products = data.data
        })
    }
  },
  components: {
    ImageItem
  }
}
</script>


<style lang="scss">
form {
  padding: 15px;
  margin-top: 50px;

  input {
    font-family: 'Dosis', sans-serif;
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
      background-color: #3f9b72;
    }
  }
}
</style>
