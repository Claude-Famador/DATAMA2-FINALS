<template>
    <component :is="layout">
      <router-view />
    </component>
  </template>
  
  <script setup>
  import { computed } from 'vue'
  import { useRoute } from 'vue-router'
  import DefaultLayout from './layouts/DefaultLayout.vue'
  
  const route = useRoute()
  
  const layout = computed(() => {
    // Get layout from route meta or fallback to default
    return route.meta.layout || DefaultLayout
  })
  </script>