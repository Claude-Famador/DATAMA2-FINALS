<template>
    <aside class="w-64 bg-blue-800 text-white min-h-screen" :class="{ 'hidden': !isSidebarOpen, 'md:block': true }">
      <nav class="p-4">
        <div class="pb-4 mb-4 border-b border-blue-700">
          <router-link to="/" class="flex items-center space-x-3">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
            </svg>
            <span class="text-lg font-semibold">DentaCare</span>
          </router-link>
        </div>
        
        <ul class="space-y-2">
          <li>
            <router-link
              to="/"
              class="flex items-center space-x-3 p-2 rounded-md transition-colors"
              :class="isActiveRoute('/') ? 'bg-blue-700' : 'hover:bg-blue-700'"
            >
              <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
              </svg>
              <span>Dashboard</span>
            </router-link>
          </li>
          
          <li>
            <router-link
              to="/patients"
              class="flex items-center space-x-3 p-2 rounded-md transition-colors"
              :class="isActiveRoute('/patients') ? 'bg-blue-700' : 'hover:bg-blue-700'"
            >
              <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
              <span>Patients</span>
            </router-link>
          </li>
          
          <li>
            <router-link
              to="/appointments"
              class="flex items-center space-x-3 p-2 rounded-md transition-colors"
              :class="isActiveRoute('/appointments') ? 'bg-blue-700' : 'hover:bg-blue-700'"
            >
              <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              <span>Appointments</span>
            </router-link>
          </li>
          
          <li>
            <router-link
              to="/settings"
              class="flex items-center space-x-3 p-2 rounded-md transition-colors"
              :class="isActiveRoute('/settings') ? 'bg-blue-700' : 'hover:bg-blue-700'"
            >
              <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              <span>Settings</span>
            </router-link>
          </li>
        </ul>
        
        <div class="mt-8 pt-4 border-t border-blue-700">
          <button
            @click="toggleSidebar"
            class="md:hidden flex items-center space-x-3 p-2 w-full text-left rounded-md hover:bg-blue-700 transition-colors"
          >
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
            </svg>
            <span>Collapse Menu</span>
          </button>
          
          <div class="hidden md:block mt-4 p-4 bg-blue-900 rounded-md">
            <h3 class="text-sm font-medium mb-2">Today's Schedule</h3>
            <p class="text-xs text-blue-300">You have {{ todayAppointmentsCount }} appointments today</p>
            <router-link 
              to="/appointments" 
              class="mt-2 block text-xs text-white bg-blue-600 hover:bg-blue-500 text-center p-1 rounded"
            >
              View Schedule
            </router-link>
          </div>
        </div>
      </nav>
    </aside>
  </template>
  
  <script setup>
  import { ref, computed } from 'vue'
  import { useRoute } from 'vue-router'
  import { useAppointmentStore } from '../stores/appointments'
  
  const route = useRoute()
  const appointmentStore = useAppointmentStore()
  
  const isSidebarOpen = ref(true)
  const todayAppointmentsCount = ref(0)
  
  // Fetch today's appointments count
  appointmentStore.fetchTodayAppointments().then(data => {
    todayAppointmentsCount.value = data?.length || 0
  })
  
  function toggleSidebar() {
    isSidebarOpen.value = !isSidebarOpen.value
  }
  
  function isActiveRoute(path) {
    if (path === '/') {
      return route.path === '/'
    }
    return route.path.startsWith(path)
  }
  </script>