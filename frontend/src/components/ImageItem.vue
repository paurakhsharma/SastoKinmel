<template>
  <figure v-lazyload class="image__wrapper">
    <img
      class="image__item"
      :data-url="source"
      alt="random image"
    >
  </figure>
</template>

<script>
import LazyLoadDirective from "@/directives/LazyLoadDirective";

export default {
    name: "ImageItem",
    props: {
      source: {
        type: String,
        required: true
      }
    },
    directives: {
    lazyload: LazyLoadDirective
  }
}
</script>

<style lang="scss" scoped>

.image__wrapper {
  display: flex;
  justify-content: end;
  align-items: flex-start;
  flex-direction: column;


  .image__item {
    height: 200px;
    width: 200px;
  }
}


</style>