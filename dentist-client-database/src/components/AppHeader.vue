<template>
    <header class="bg-white shadow">
      <div class="max-w-7xl mx-auto px-4 py-3 flex justify-between items-center">
        <div class="flex items-center">
          <h1 class="text-xl font-semibold text-blue-800">Dental Practice Management</h1>
        </div>
        
        <div class="flex items-center space-x-4">
          <button
            v-if="isSearchVisible"
            class="relative"
          >
            <input
              v-model="searchQuery"
              type="text"
              placeholder="Search patients..."
              class="border rounded-lg py-1 px-3 pr-8 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              @keyup.enter="handleSearch"
            />
            <span
              v-if="searchQuery"
              class="absolute right-2 top-1.5 cursor-pointer text-gray-400 hover:text-gray-600"
              @click="clearSearch"
            >
              ✕
            </span>
          </button>
          
          <div class="relative" ref="notificationMenu">
            <button
              class="p-1 text-gray-500 hover:text-gray-700"
              @click="toggleNotifications"
            >
              <span class="sr-only">Notifications</span>
              <!-- Notification icon -->
              <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
              </svg>
              <span
                v-if="unreadNotifications > 0"
                class="absolute top-0 right-0 bg-red-500 text-white text-xs rounded-full h-4 w-4 flex items-center justify-center"
              >
                {{ unreadNotifications }}
              </span>
            </button>
            
            <div
              v-if="isNotificationsOpen"
              class="absolute right-0 mt-2 w-80 bg-white rounded-md shadow-lg py-1 z-10"
            >
              <div class="px-4 py-2 border-b border-gray-100 flex justify-between items-center">
                <h3 class="text-sm font-semibold">Notifications</h3>
                <button
                  class="text-xs text-blue-600 hover:text-blue-800"
                  @click="markAllAsRead"
                >
                  Mark all as read
                </button>
              </div>
              <div v-if="notifications.length === 0" class="px-4 py-3 text-sm text-gray-500">
                No new notifications
              </div>
              <ul v-else class="max-h-80 overflow-y-auto">
                <li
                  v-for="notification in notifications"
                  :key="notification.id"
                  class="px-4 py-3 hover:bg-gray-50 border-b border-gray-100 last:border-0"
                  :class="{ 'bg-blue-50': !notification.read }"
                >
                  <div class="flex items-start">
                    <div class="flex-1">
                      <p class="text-sm font-medium" :class="{ 'font-semibold': !notification.read }">
                        {{ notification.title }}
                      </p>
                      <p class="text-xs text-gray-500 mt-1">{{ notification.message }}</p>
                      <p class="text-xs text-gray-400 mt-1">{{ notification.time }}</p>
                    </div>
                    <button
                      class="ml-2 text-gray-400 hover:text-gray-600"
                      @click="removeNotification(notification.id)"
                    >
                      <span class="sr-only">Dismiss</span>
                      <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>
                </li>
              </ul>

            </div>
        </div>
        
        <div class="relative" ref="userMenu">
          <button
            class="flex items-center space-x-2 text-sm"
            @click="toggleUserMenu"
          >
            <div class="h-8 w-8 rounded-full bg-blue-600 flex items-center justify-center text-white font-medium">
              {{ userInitials }}
            </div>
            <span class="hidden md:inline-block font-medium">{{ userName }}</span>
            <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
            </svg>
          </button>
          
          <div
            v-if="isUserMenuOpen"
            class="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-10"
          >
            <router-link
              to="/settings"
              class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
              @click="isUserMenuOpen = false"
            >
              Settings
            </router-link>
            <button
              class="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
              @click="logout"
            >
              Logout
            </button>
          </div>
        </div>
      </div>
    </div>
  </header>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useAuthStore } from '../stores/auth'

const router = useRouter()
const route = useRoute()
const authStore = useAuthStore()

// User menu state
const isUserMenuOpen = ref(false)
const userMenu = ref(null)

// Notifications state
const isNotificationsOpen = ref(false)
const notificationMenu = ref(null)
const notifications = ref([
  {
    id: 1,
    title: 'Appointment Reminder',
    message: 'You have 5 appointments scheduled for today',
    time: 'Just now',
    read: false
  },
  {
    id: 2,
    title: 'New Patient',
    message: 'John Doe has been added as a new patient',
    time: '2 hours ago',
    read: false
  }
])

// Search state
const searchQuery = ref('')
const isSearchVisible = computed(() => {
  return ['Patients', 'Appointments'].includes(route.name)
})

// Computed properties
const userName = computed(() => {
  return authStore.user?.email?.split('@')[0] || 'User'
})

const userInitials = computed(() => {
  const name = userName.value
  return name.charAt(0).toUpperCase()
})

const unreadNotifications = computed(() => {
  return notifications.value.filter(n => !n.read).length
})

// Methods
function toggleUserMenu() {
  isUserMenuOpen.value = !isUserMenuOpen.value
  isNotificationsOpen.value = false
}

function toggleNotifications() {
  isNotificationsOpen.value = !isNotificationsOpen.value
  isUserMenuOpen.value = false
}

function markAllAsRead() {
  notifications.value = notifications.value.map(n => ({
    ...n,
    read: true
  }))
}

function removeNotification(id) {
  notifications.value = notifications.value.filter(n => n.id !== id)
}

function handleSearch() {
  if (searchQuery.value.trim()) {
    if (route.name === 'Patients') {
      router.push({ 
        name: 'Patients', 
        query: { search: searchQuery.value } 
      })
    } else if (route.name === 'Appointments') {
      router.push({ 
        name: 'Appointments', 
        query: { search: searchQuery.value } 
      })
    }
  }
}

function clearSearch() {
  searchQuery.value = ''
  if (route.query.search) {
    router.push({ 
      name: route.name
    })
  }
}

async function logout() {
  try {
    await authStore.logout()
    router.push('/login')
  } catch (error) {
    console.error('Logout error:', error)
  }
}

// Close menus when clicking outside
function handleClickOutside(event) {
  if (userMenu.value && !userMenu.value.contains(event.target)) {
    isUserMenuOpen.value = false
  }
  
  if (notificationMenu.value && !notificationMenu.value.contains(event.target)) {
    isNotificationsOpen.value = false
  }
}

onMounted(() => {
  document.addEventListener('click', handleClickOutside)
})

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside)
})
</script>