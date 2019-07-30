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

v-<script>
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
