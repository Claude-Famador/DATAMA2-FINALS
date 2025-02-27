<template>
    <div class="settings-page">
      <h1 class="text-2xl font-bold mb-6">Settings</h1>
      
      <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
        <!-- Sidebar/Navigation -->
        <div class="bg-white p-4 rounded shadow">
          <ul class="space-y-2">
            <li v-for="(section, index) in settingSections" :key="index">
              <button 
                @click="activeSection = section.id"
                class="w-full text-left px-3 py-2 rounded transition"
                :class="activeSection === section.id ? 'bg-blue-100 text-blue-600' : 'hover:bg-gray-100'"
              >
                {{ section.name }}
              </button>
            </li>
          </ul>
        </div>
        
        <!-- Settings Content -->
        <div class="bg-white p-6 rounded shadow md:col-span-2">
          <!-- Profile Settings -->
          <div v-if="activeSection === 'profile'">
            <h2 class="text-xl font-semibold mb-4">Profile Settings</h2>
            
            <form @submit.prevent="updateProfile" class="space-y-4">
              <div class="form-group">
                <label for="name" class="block text-sm font-medium mb-1">Full Name</label>
                <input 
                  id="name" 
                  v-model="profile.name" 
                  type="text" 
                  class="w-full p-2 border rounded focus:ring focus:ring-blue-200 transition"
                >
              </div>
              
              <div class="form-group">
                <label for="email" class="block text-sm font-medium mb-1">Email</label>
                <input 
                  id="email" 
                  v-model="profile.email" 
                  type="email" 
                  disabled
                  class="w-full p-2 border rounded bg-gray-50 cursor-not-allowed"
                >
                <p class="text-xs text-gray-500 mt-1">Email cannot be changed</p>
              </div>
              
              <div class="form-group">
                <label for="role" class="block text-sm font-medium mb-1">Role</label>
                <input 
                  id="role" 
                  v-model="profile.role" 
                  type="text" 
                  disabled
                  class="w-full p-2 border rounded bg-gray-50 cursor-not-allowed"
                >
              </div>
              
              <button 
                type="submit" 
                class="px-4 py-2 bg-blue-600 text-white rounded shadow-sm hover:bg-blue-700 transition"
                :disabled="profileLoading"
              >
                {{ profileLoading ? 'Saving...' : 'Save Profile' }}
              </button>
            </form>
          </div>
          
          <!-- Password Settings -->
          <div v-if="activeSection === 'password'">
            <h2 class="text-xl font-semibold mb-4">Change Password</h2>
            
            <form @submit.prevent="updatePassword" class="space-y-4">
              <div class="form-group">
                <label for="currentPassword" class="block text-sm font-medium mb-1">Current Password</label>
                <input 
                  id="currentPassword" 
                  v-model="passwordForm.currentPassword" 
                  type="password" 
                  required
                  class="w-full p-2 border rounded focus:ring focus:ring-blue-200 transition"
                >
              </div>
              
              <div class="form-group">
                <label for="newPassword" class="block text-sm font-medium mb-1">New Password</label>
                <input 
                  id="newPassword" 
                  v-model="passwordForm.newPassword" 
                  type="password" 
                  required
                  class="w-full p-2 border rounded focus:ring focus:ring-blue-200 transition"
                >
              </div>
              
              <div class="form-group">
                <label for="confirmPassword" class="block text-sm font-medium mb-1">Confirm New Password</label>
                <input 
                  id="confirmPassword" 
                  v-model="passwordForm.confirmPassword" 
                  type="password" 
                  required
                  class="w-full p-2 border rounded focus:ring focus:ring-blue-200 transition"
                >
                <p v-if="passwordsDoNotMatch" class="text-xs text-red-500 mt-1">
                  Passwords do not match
                </p>
              </div>
              
              <button 
                type="submit" 
                class="px-4 py-2 bg-blue-600 text-white rounded shadow-sm hover:bg-blue-700 transition"
                :disabled="passwordLoading || passwordsDoNotMatch"
              >
                {{ passwordLoading ? 'Updating...' : 'Update Password' }}
              </button>
            </form>
          </div>
          
          <!-- Practice Settings -->
          <div v-if="activeSection === 'practice'">
            <h2 class="text-xl font-semibold mb-4">Practice Information</h2>
            
            <form @submit.prevent="updatePracticeInfo" class="space-y-4">
              <div class="form-group">
                <label for="practiceName" class="block text-sm font-medium mb-1">Practice Name</label>
                <input 
                  id="practiceName" 
                  v-model="practiceInfo.name" 
                  type="text" 
                  required
                  class="w-full p-2 border rounded focus:ring focus:ring-blue-200 transition"
                >
              </div>
              
              <div class="form-group">
                <label for="practiceAddress" class="block text-sm font-medium mb-1">Address</label>
                <textarea 
                  id="practiceAddress" 
                  v-model="practiceInfo.address" 
                  rows="3" 
                  required
                  class="w-full p-2 border rounded focus:ring focus:ring-blue-200 transition"
                ></textarea>
              </div>
              
              <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div class="form-group">
                  <label for="practicePhone" class="block text-sm font-medium mb-1">Phone</label>
                  <input 
                    id="practicePhone" 
                    v-model="practiceInfo.phone" 
                    type="tel" 
                    required
                    class="w-full p-2 border rounded focus:ring focus:ring-blue-200 transition"
                  >
                </div>
                
                <div class="form-group">
                  <label for="practiceEmail" class="block text-sm font-medium mb-1">Email</label>
                  <input 
                    id="practiceEmail" 
                    v-model="practiceInfo.email" 
                    type="email" 
                    required
                    class="w-full p-2 border rounded focus:ring focus:ring-blue-200 transition"
                  >
                </div>
              </div>
              
              <div class="form-group">
                <label for="practiceHours" class="block text-sm font-medium mb-1">Business Hours</label>
                <textarea 
                  id="practiceHours" 
                  v-model="practiceInfo.hours" 
                  rows="3" 
                  placeholder="Monday-Friday: 9AM-5PM&#10;Saturday: 10AM-2PM&#10;Sunday: Closed"
                  class="w-full p-2 border rounded focus:ring focus:ring-blue-200 transition"
                ></textarea>
              </div>
              
              <button 
                type="submit" 
                class="px-4 py-2 bg-blue-600 text-white rounded shadow-sm hover:bg-blue-700 transition"
                :disabled="practiceLoading"
              >
                {{ practiceLoading ? 'Saving...' : 'Save Practice Info' }}
              </button>
            </form>
          </div>
          
          <!-- Notification Settings -->
          <div v-if="activeSection === 'notifications'">
            <h2 class="text-xl font-semibold mb-4">Notification Settings</h2>
            
            <div class="space-y-4">
              <div v-for="(setting, index) in notificationSettings" :key="index" class="flex items-center justify-between p-3 border rounded">
                <div>
                  <h3 class="font-medium">{{ setting.title }}</h3>
                  <p class="text-sm text-gray-600">{{ setting.description }}</p>
                </div>
                <label class="switch relative inline-block w-10 h-6">
                  <input 
                    type="checkbox" 
                    v-model="setting.enabled"
                    @change="updateNotificationSetting(setting.id, setting.enabled)"
                    class="sr-only"
                  >
                  <span class="slider absolute cursor-pointer inset-0 rounded-full bg-gray-300 transition-colors duration-200 before:absolute before:bg-white before:h-4 before:w-4 before:rounded-full before:left-1 before:bottom-1 before:transition-transform before:duration-200"
                    :class="{ 'bg-blue-600 before:translate-x-4': setting.enabled }"></span>
                </label>
              </div>
              
              <div class="mt-4">
                <p class="text-sm text-gray-500">
                  Changes to notification settings are applied immediately.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <!-- Notification component -->
      <Notification
        v-if="notification.show"
        :type="notification.type"
        :message="notification.message"
        @close="notification.show = false"
      />
    </div>
  </template>
  
  <script setup>
  import { ref, computed, onMounted } from 'vue';
  import { supabase } from '../supabase';
  import { useAuthStore } from '../stores/auth';
  import Notification from '../components/ui/Notification.vue';
  
  // Store
  const authStore = useAuthStore();
  
  // State
  const activeSection = ref('profile');
  const profileLoading = ref(false);
  const passwordLoading = ref(false);
  const practiceLoading = ref(false);
  const notification = ref({
    show: false,
    type: 'success',
    message: ''
  });
  
  // Form data
  const profile = ref({
    name: '',
    email: '',
    role: ''
  });
  
  const passwordForm = ref({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  
  const practiceInfo = ref({
    name: '',
    address: '',
    phone: '',
    email: '',
    hours: ''
  });
  
  const notificationSettings = ref([
    {
      id: 'appointment_reminder',
      title: 'Appointment Reminders',
      description: 'Send automatic reminders to patients before appointments',
      enabled: true
    },
    {
      id: 'new_appointment',
      title: 'New Appointments',
      description: 'Get notified when new appointments are booked',
      enabled: true
    },
    {
      id: 'cancelled_appointment',
      title: 'Cancelled Appointments',
      description: 'Get notified when appointments are cancelled',
      enabled: true
    },
    {
      id: 'patient_birthday',
      title: 'Patient Birthdays',
      description: 'Receive notifications about patient birthdays',
      enabled: false
    }
  ]);
  
  // Settings sections
  const settingSections = [
    { id: 'profile', name: 'Profile' },
    { id: 'password', name: 'Password' },
    { id: 'practice', name: 'Practice Information' },
    { id: 'notifications', name: 'Notification Settings' }
  ];
  
  // Computed
  const passwordsDoNotMatch = computed(() => {
    return passwordForm.value.newPassword !== passwordForm.value.confirmPassword &&
           passwordForm.value.confirmPassword !== '';
  });
  
  // Methods
  const showNotification = (type, message) => {
    notification.value = {
      show: true,
      type,
      message
    };
    
    // Auto hide after 5 seconds
    setTimeout(() => {
      notification.value.show = false;
    }, 5000);
  };
  
  const loadUserProfile = async () => {
    try {
      const user = authStore.user;
      
      if (user) {
        const { data, error } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', user.id)
          .single();
          
        if (error) throw error;
        
        if (data) {
          profile.value = {
            name: data.full_name || '',
            email: user.email,
            role: data.role || 'Staff'
          };
        }
      }
    } catch (error) {
      showNotification('error', 'Error loading profile: ' + error.message);
    }
  };
  
  const loadPracticeInfo = async () => {
    try {
      const { data, error } = await supabase
        .from('practice_info')
        .select('*')
        .single();
        
      if (error && error.code !== 'PGRST116') throw error; // PGRST116 is "no rows returned" error code
      
      if (data) {
        practiceInfo.value = {
          name: data.name || '',
          address: data.address || '',
          phone: data.phone || '',
          email: data.email || '',
          hours: data.business_hours || ''
        };
      }
    } catch (error) {
      showNotification('error', 'Error loading practice info: ' + error.message);
    }
  };
  
  const updateProfile = async () => {
    try {
      profileLoading.value = true;
      
      const { error } = await supabase
        .from('profiles')
        .update({
          full_name: profile.value.name
        })
        .eq('id', authStore.user.id);
        
      if (error) throw error;
      
      showNotification('success', 'Profile updated successfully');
    } catch (error) {
      showNotification('error', 'Error updating profile: ' + error.message);
    } finally {
      profileLoading.value = false;
    }
  };
  
  const updatePassword = async () => {
    try {
      if (passwordForm.value.newPassword !== passwordForm.value.confirmPassword) {
        return showNotification('error', 'Passwords do not match');
      }
      
      passwordLoading.value = true;
      
      const { error } = await supabase.auth.updateUser({
        password: passwordForm.value.newPassword
      });
      
      if (error) throw error;
      
      passwordForm.value = {
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      };
      
      showNotification('success', 'Password updated successfully');
    } catch (error) {
      showNotification('error', 'Error updating password: ' + error.message);
    } finally {
      passwordLoading.value = false;
    }
  };
  
  const updatePracticeInfo = async () => {
    try {
      practiceLoading.value = true;
      
      // Check if practice info exists first
      const { data: existingData, error: checkError } = await supabase
        .from('practice_info')
        .select('id')
        .limit(1);
        
      if (checkError) throw checkError;
      
      if (existingData && existingData.length > 0) {
        // Update existing record
        const { error } = await supabase
          .from('practice_info')
          .update({
            name: practiceInfo.value.name,
            address: practiceInfo.value.address,
            phone: practiceInfo.value.phone,
            email: practiceInfo.value.email,
            business_hours: practiceInfo.value.hours
          })
          .eq('id', existingData[0].id);
          
        if (error) throw error;
      } else {
        // Insert new record
        const { error } = await supabase
          .from('practice_info')
          .insert({
            name: practiceInfo.value.name,
            address: practiceInfo.value.address,
            phone: practiceInfo.value.phone,
            email: practiceInfo.value.email,
            business_hours: practiceInfo.value.hours
          });
          
        if (error) throw error;
      }
      
      showNotification('success', 'Practice information updated successfully');
    } catch (error) {
      showNotification('error', 'Error updating practice info: ' + error.message);
    } finally {
      practiceLoading.value = false;
    }
  };
  
  const updateNotificationSetting = async (settingId, enabled) => {
    try {
      // Here we would update the user's notification preferences in the database
      // For now, we'll just show a notification that it was updated
      showNotification('success', `${settingId} notifications ${enabled ? 'enabled' : 'disabled'}`);
      
      // In a real implementation, you would do something like:
      // await supabase
      //   .from('notification_settings')
      //   .upsert({
      //     user_id: authStore.user.id,
      //     setting_id: settingId,
      //     enabled: enabled
      //   });
    } catch (error) {
      showNotification('error', 'Error updating notification setting');
      // Revert the change in the UI
      const setting = notificationSettings.value.find(s => s.id === settingId);
      if (setting) {
        setting.enabled = !enabled;
      }
    }
  };
  
  // Lifecycle
  onMounted(async () => {
    await loadUserProfile();
    await loadPracticeInfo();
  });
  </script>
  
  <style scoped>
  .slider:before {
    content: "";
    position: absolute;
  }
  </style>