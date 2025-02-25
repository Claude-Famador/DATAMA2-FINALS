<template>
  <div class="min-h-screen bg-gray-50">
    <AppHeader />
    <div class="flex">
      <AppSidebar />
      <main class="flex-1 p-6">
        <slot />
      </main>
    </div>
    <AppFooter />
  </div>
</template>

<script setup>
    import AppHeader from '../components/AppHeader.vue'
    import AppSidebar from '../components/AppSidebar.vue'
    import AppFooter from '../components/AppFooter.vue'
</script>