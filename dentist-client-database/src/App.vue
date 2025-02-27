<template>
  <component>
    <router-view />
  </component>
</template>

<script>
import DefaultLayout from '@/layouts/DefaultLayout.vue';

export default {
  name: 'App',
  components: {
    DefaultLayout
  },
  computed: {
    layout() {
      return (this.$route.meta.layout || 'DefaultLayout');
    }
  }
}
</script>

<style>
@import '@/assets/styles/main.css';
</style>