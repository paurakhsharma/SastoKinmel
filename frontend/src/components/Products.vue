<template>
  <div>
    <transition-group name="list" tag="p" class="products">
      <div class="product" v-for="product in products" :key="product._id">
        <img class="product-img" :src="product.imageUrl" alt="" srcset="">
        <div class=product-detail>
          <span class="product-name">{{product.name}}</span>
          <span class="product-price">₹ {{product.discountedPrice}}</span>
        </div>
      </div>
    </transition-group>
  </div>
</template>

<script>
export default {
  name: "Products",
  data() {
    return {
      products: [],
      bottom: false,
      lastValue: 50
    }
  },
  created: function () {
    this.axios.get('http://localhost:3000').then(response => {
      this.$store.dispatch('load_products', response.data)
      this.products = response.data.slice(0, this.lastValue)
    })
    window.addEventListener('scroll', () => {
      this.bottom = this.bottomVisible()
    })
  },
  methods: {
    bottomVisible() {
      const scrollY = window.scrollY
      const visible = document.documentElement.clientHeight
      const pageHeight = document.documentElement.scrollHeight
      const bottomOfPage = visible + scrollY >= pageHeight
      return bottomOfPage || pageHeight < visible
    },
    getMoreProducts() {
      this.products.push(...this.$store.state.products.slice(this.lastValue, this.lastValue + 50))
      this.lastValue += 50
    }
  },
  watch: {
    bottom(bottom) {
      if (bottom) {
        this.getMoreProducts()
      }
    }
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
@import url('https://fonts.googleapis.com/css?family=Dosis');

.products {
  margin-top: 10vh;
  height: 90vh;
  display: grid;
  grid-template-columns: minmax(100px, 1fr) minmax(100px, 1fr) minmax(100px, 1fr);
  grid-gap: 20px 20px;
  justify-content: center;
  font-family: 'Dosis', sans-serif;
  margin-left: 10px;
  margin-right: 10px;

  .product {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    border-radius: 5px;
    box-shadow: 3px 3px 25px rgba(204, 204, 204, 0.397);
    height: 300px;

    &-img {
      height: 200px;
      width: 200px;
      border-radius: 5px;
      display: block;
      margin-left: auto;
      margin-right: auto;
      width: 50%;
    }

    &-detail {
      margin-top: 10px;
      display: flex;
      flex-direction: column;
      background: rgb(214, 213, 213);
      width: 100%;
      height: 95px;
      border-radius: 0 0 5px 5px;
    }

    &-name {
      margin-top: 10px;
      font-size: 20px;
    }

    &-price {
      margin-top: 10px;
      font-size: 20px;
      font-weight: 800;
    }
  }
}

.list-enter-active, .list-leave-active {
  transition: all 1s;
}
.list-enter, .list-leave-to /* .list-leave-active below version 2.1.8 */ {
  opacity: 0;
  transform: translateY(30px);
}
</style>
