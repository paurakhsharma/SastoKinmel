<template>
  <div>
    <div class="loader" v-if="loading">
      <moon-loader :loading="loading" :color="loadingColor" class="loader-element"></moon-loader>
    </div>
    <transition-group name="list" tag="p" class="products">
      <div class="product" v-for="product in products" :key="product._id">
        <a :href="product.productUrl" target="_blank" class="source-link">
          <span
            class="source"
            :class="{'source-daraz': isDaraz(product.source), 'source-sd': !isDaraz(product.source)}"
          >{{product.source}}</span>
          <ImageItem :source="product.imageUrl" />
          <div class="product-detail">
            <span class="product-name">{{product.name}}</span>
            <span class="product-price">₹ {{product.discountedPrice}}</span>
          </div>
        </a>
      </div>
    </transition-group>
  </div>
</template>

<script>
import ImageItem from "@/components/ImageItem.vue";
import MoonLoader from "vue-spinner/src/MoonLoader.vue";

export default {
  name: "Products",
  components: {
    MoonLoader,
    ImageItem
  },
  data() {
    return {
      products: [],
      bottom: false,
      nextPage: 2,
      loading: false,
      loadingColor: "grey"
    };
  },
  created: function() {
    this.loading = true;
    this.axios.get("http://localhost:3000?page=1&limit=30").then(response => {
      this.$store.dispatch("load_products", response.data);
      this.products = response.data;
      this.loading = false;
    });
    window.addEventListener("scroll", () => {
      console.log("💩");
      this.bottom = this.bottomVisible();
    });
  },
  methods: {
    bottomVisible() {
      const scrollY = window.scrollY;
      const visible = document.documentElement.clientHeight;
      const pageHeight = document.documentElement.scrollHeight;
      const bottomOfPage = visible + scrollY >= pageHeight;
      return bottomOfPage || pageHeight < visible;
    },
    getMoreProducts() {
      this.axios
        .get(`http://localhost:3000?page=${this.nextPage}&limit=30`)
        .then(response => {
          this.$store.dispatch("load_products", response.data);
          this.products.push(...response.data);
          this.nextPage++;
        });
    }
  },
  watch: {
    bottom(bottom) {
      if (bottom) {
        this.getMoreProducts();
      }
    }
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss">
@import url("https://fonts.googleapis.com/css?family=Dosis");

.products {
  margin-top: 10vh;
  height: 90vh;
  display: grid;
  grid-template-columns: minmax(100px, 1fr) minmax(100px, 1fr) minmax(
      100px,
      1fr
    );
  grid-gap: 20px 20px;
  justify-content: center;
  font-family: "Dosis", sans-serif;
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
    margin-bottom: 20px;
    transition: transform .2s;

    &:hover {
      transform: translateY(-2px);
      box-shadow: 15px 15px #42b983;
    }

    a {
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
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

.loader {
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
}

.list-enter-active,
.list-leave-active {
  transition: all 1s;
}
.list-enter, .list-leave-to /* .list-leave-active below version 2.1.8 */ {
  opacity: 0;
  transform: translateY(30px);
}
</style>
