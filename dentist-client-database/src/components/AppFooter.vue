<template>
    <footer class="bg-white border-t py-4">
      <div class="max-w-7xl mx-auto px-4 flex flex-col md:flex-row justify-between items-center">
        <div class="text-sm text-gray-500">
          &copy; {{ currentYear }} DentaCare Management System
        </div>
        <div class="mt-2 md:mt-0 text-sm text-gray-500">
          <span>Version 0.1.0</span>
        </div>
      </div>
    </footer>
  </template>
  
  <script setup>
  import { computed } from 'vue'
  
  const currentYear = computed(() => new Date().getFullYear())
  </script>