<template>
  <div class="home">
    <Products msg="Welcome to Your Vue.js App" />
  </div>
</template>

<script>
// @ is an alias to /src
import Products from "@/components/Products.vue";

export default {
  name: "home",
  components: {
    Products
  }
};
</script>
