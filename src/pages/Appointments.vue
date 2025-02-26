<template>
    <DefaultLayout>
      <div class="flex justify-between items-center mb-6">
        <h1 class="text-2xl font-bold">Appointments</h1>
        <div class="flex space-x-3">
          <Button @click="router.push('/appointments/new')">
            New Appointment
          </Button>
        </div>
      </div>
      
      <!-- Filters -->
      <div class="bg-white p-4 rounded-lg shadow mb-6">
        <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Date Range</label>
            <div class="flex space-x-2">
              <input
                v-model="filters.startDate"
                type="date"
                class="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
              <span class="self-center">to</span>
              <input
                v-model="filters.endDate"
                type="date"
                class="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
            </div>
          </div>
          
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Status</label>
            <select
              v-model="filters.status"
              class="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            >
              <option value="">All Statuses</option>
              <option value="Scheduled">Scheduled</option>
              <option value="Completed">Completed</option>
              <option value="Cancelled">Cancelled</option>
              <option value="No-Show">No-Show</option>
            </select>
          </div>
          
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Appointment Type</label>
            <select
              v-model="filters.type"
              class="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            >
              <option value="">All Types</option>
              <option value="Regular Checkup">Regular Checkup</option>
              <option value="Cleaning">Cleaning</option>
              <option value="Emergency">Emergency</option>
              <option value="Consultation">Consultation</option>
              <option value="Procedure">Procedure</option>
            </select>
          </div>
          
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Search Patient</label>
            <input
              v-model="filters.patientSearch"
              type="text"
              placeholder="Name or ID"
              class="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            />
          </div>
        </div>
        
        <div class="flex justify-end mt-4">
          <Button @click="resetFilters" variant="secondary" class="mr-2">Reset</Button>
          <Button @click="fetchAppointments">Apply Filters</Button>
        </div>
      </div>
      
      <!-- Appointments Table -->
      <div class="bg-white rounded-lg shadow overflow-hidden">
        <div v-if="loading" class="flex justify-center items-center p-8">
          <div class="animate-spin h-8 w-8 border-4 border-blue-500 rounded-full border-t-transparent"></div>
        </div>
        
        <div v-else-if="filteredAppointments.length === 0" class="p-8 text-center text-gray-500">
          No appointments found matching your criteria.
        </div>
        
        <div v-else>
          <div class="overflow-x-auto">
            <table class="min-w-full divide-y divide-gray-200">
              <thead class="bg-gray-50">
                <tr>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Date
                  </th>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Time
                  </th>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Patient
                  </th>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Type
                  </th>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody class="bg-white divide-y divide-gray-200">
                <tr v-for="appointment in filteredAppointments" :key="appointment.id">
                  <td class="px-6 py-4 whitespace-nowrap">
                    {{ formatDate(appointment.date) }}
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap">
                    {{ appointment.time }}
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap">
                    <div class="text-sm font-medium text-gray-900">
                      <a 
                        @click="navigateToPatient(appointment.patient_id)" 
                        class="text-blue-600 hover:text-blue-900 cursor-pointer"
                      >
                        {{ getPatientName(appointment.patient_id) }}
                      </a>
                    </div>
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap">
                    {{ appointment.type }}
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap">
                    <span :class="getStatusClass(appointment.status)">
                      {{ appointment.status }}
                    </span>
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap">
                    <div class="flex space-x-2">
                      <button @click="viewAppointment(appointment.id)" class="text-blue-600 hover:text-blue-900">
                        View
                      </button>
                      <button 
                        v-if="canEditAppointment(appointment)" 
                        @click="editAppointment(appointment.id)" 
                        class="text-yellow-600 hover:text-yellow-900"
                      >
                        Edit
                      </button>
                      <button 
                        v-if="canCancelAppointment(appointment)" 
                        @click="cancelAppointment(appointment)" 
                        class="text-red-600 hover:text-red-900"
                      >
                        Cancel
                      </button>
                      <button 
                        v-if="canCompleteAppointment(appointment)" 
                        @click="markAsCompleted(appointment)" 
                        class="text-green-600 hover:text-green-900"
                      >
                        Complete
                      </button>
                      <button 
                        v-if="canMarkNoShow(appointment)" 
                        @click="markAsNoShow(appointment)" 
                        class="text-orange-600 hover:text-orange-900"
                      >
                        No-Show
                      </button>
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
          
          <!-- Pagination -->
          <div class="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6">
            <div class="flex-1 flex justify-between sm:hidden">
              <Button 
                :disabled="page === 1" 
                @click="page--" 
                variant="secondary" 
                size="sm"
              >
                Previous
              </Button>
              <Button 
                :disabled="page * perPage >= totalAppointments" 
                @click="page++" 
                variant="secondary" 
                size="sm"
              >
                Next
              </Button>
            </div>
            <div class="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
              <div>
                <p class="text-sm text-gray-700">
                  Showing
                  <span class="font-medium">{{ ((page - 1) * perPage) + 1 }}</span>
                  to
                  <span class="font-medium">{{ Math.min(page * perPage, totalAppointments) }}</span>
                  of
                  <span class="font-medium">{{ totalAppointments }}</span>
                  results
                </p>
              </div>
              <div>
                <nav class="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
                  <button
                    @click="page = 1"
                    :disabled="page === 1"
                    class="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50"
                  >
                    <span class="sr-only">First</span>
                    &laquo;
                  </button>
                  <button
                    @click="page--"
                    :disabled="page === 1"
                    class="relative inline-flex items-center px-2 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50"
                  >
                    <span class="sr-only">Previous</span>
                    &lsaquo;
                  </button>
                  <span class="relative inline-flex items-center px-4 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-700">
                    {{ page }} of {{ Math.ceil(totalAppointments / perPage) }}
                  </span>
                  <button
                    @click="page++"
                    :disabled="page * perPage >= totalAppointments"
                    class="relative inline-flex items-center px-2 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50"
                  >
                    <span class="sr-only">Next</span>
                    &rsaquo;
                  </button>
                  <button
                    @click="page = Math.ceil(totalAppointments / perPage)"
                    :disabled="page * perPage >= totalAppointments"
                    class="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50"
                  >
                    <span class="sr-only">Last</span>
                    &raquo;
                  </button>
                </nav>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <!-- Notification component -->
      <Notification
        v-if="notification.show"
        :message="notification.message"
        :type="notification.type"
        @close="notification.show = false"
      />
    </DefaultLayout>
  </template>
  
  <script setup>
  import { ref, reactive, onMounted, computed, watch } from 'vue';
  import { useRouter } from 'vue-router';
  import { supabase } from '../supabase';
  import DefaultLayout from '../layouts/DefaultLayout.vue';
  import Button from '../components/ui/Button.vue';
  import Notification from '../components/ui/Notification.vue';
  
  const router = useRouter();
  const appointments = ref([]);
  const patientMap = ref({});
  const loading = ref(true);
  const totalAppointments = ref(0);
  const page = ref(1);
  const perPage = ref(10);
  
  // Filters
  const filters = reactive({
    startDate: new Date().toISOString().substr(0, 10), // Today
    endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().substr(0, 10), // 30 days from now
    status: '',
    type: '',
    patientSearch: ''
  });
  
  const notification = reactive({
    show: false,
    message: '',
    type: 'success'
  });
  
  onMounted(async () => {
    await fetchAppointments();
    await fetchPatients();
  });
  
  watch(page, () => {
    fetchAppointments();
  });
  
  const filteredAppointments = computed(() => {
    // Client-side filtering for search (server-side filtering is done in fetchAppointments)
    if (!filters.patientSearch) return appointments.value;
    
    const searchTerm = filters.patientSearch.toLowerCase();
    return appointments.value.filter(appointment => {
      const patient = patientMap.value[appointment.patient_id];
      if (!patient) return false;
      
      const fullName = `${patient.first_name} ${patient.last_name}`.toLowerCase();
      return fullName.includes(searchTerm) || patient.id.toString().includes(searchTerm);
    });
  });
  
  async function fetchAppointments() {
    try {
      loading.value = true;
      
      // Build query
      let query = supabase
        .from('appointments')
        .select('*', { count: 'exact' });
      
      // Apply filters
      if (filters.startDate) {
        query = query.gte('date', filters.startDate);
      }
      
      if (filters.endDate) {
        query = query.lte('date', filters.endDate);
      }
      
      if (filters.status) {
        query = query.eq('status', filters.status);
      }
      
      if (filters.type) {
        query = query.eq('type', filters.type);
      }
      
      // Apply pagination
      query = query
        .order('date', { ascending: true })
        .range((page.value - 1) * perPage.value, page.value * perPage.value - 1);
      
      const { data, count, error } = await query;
      
      if (error) throw error;
      
      appointments.value = data;
      totalAppointments.value = count || 0;
      
    } catch (err) {
      showNotification('Error loading appointments: ' + err.message, 'error');
      console.error(err);
    } finally {
      loading.value = false;
    }
  }
  
  async function fetchPatients() {
    try {
      const { data, error } = await supabase
        .from('patients')
        .select('id, first_name, last_name');
      
      if (error) throw error;
      
      // Create a map for easy lookup
      const map = {};
      data.forEach(patient => {
        map[patient.id] = patient;
      });
      
      patientMap.value = map;
      
    } catch (err) {
      console.error('Error loading patients:', err);
    }
  }
  
  function getPatientName(patientId) {
    const patient = patientMap.value[patientId];
    return patient ? `${patient.first_name} ${patient.last_name}` : 'Unknown Patient';
  }
  
  function formatDate(dateString) {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString();
  }
  
  function getStatusClass(status) {
    const statusClasses = {
      'Scheduled': 'px-2 py-1 text-xs font-medium rounded-full bg-blue-100 text-blue-800',
      'Completed': 'px-2 py-1 text-xs font-medium rounded-full bg-green-100 text-green-800',
      'Cancelled': 'px-2 py-1 text-xs font-medium rounded-full bg-red-100 text-red-800',
      'No-Show': 'px-2 py-1 text-xs font-medium rounded-full bg-yellow-100 text-yellow-800'
    };
    
    return statusClasses[status] || 'px-2 py-1 text-xs font-medium rounded-full bg-gray-100 text-gray-800';
  }
  
  function resetFilters() {
    filters.startDate = new Date().toISOString().substr(0, 10);
    filters.endDate = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().substr(0, 10);
    filters.status = '';
    filters.type = '';
    filters.patientSearch = '';
    page.value = 1;
    fetchAppointments();
  }
  
  function navigateToPatient(patientId) {
    router.push(`/patients/${patientId}`);
  }
  
  function viewAppointment(appointmentId) {
    router.push(`/appointments/${appointmentId}`);
  }
  
  function editAppointment(appointmentId) {
    router.push(`/appointments/${appointmentId}/edit`);
  }
  
  function canEditAppointment(appointment) {
    // Can edit if appointment is scheduled and in the future
    return appointment.status === 'Scheduled' && new Date(appointment.date) > new Date();
  }
  
  function canCancelAppointment(appointment) {
    // Can cancel if appointment is scheduled and in the future
    return appointment.status === 'Scheduled' && new Date(appointment.date) > new Date();
  }
  
  function canCompleteAppointment(appointment) {
    // Can complete if appointment is scheduled and today or past
    const appointmentDate = new Date(appointment.date);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    return appointment.status === 'Scheduled' && appointmentDate <= today;
  }
  
  function canMarkNoShow(appointment) {
    // Can mark as no-show if appointment is scheduled and today or past
    const appointmentDate = new Date(appointment.date);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    return appointment.status === 'Scheduled' && appointmentDate <= today;
  }
  
  async function cancelAppointment(appointment) {
    try {
      if (!confirm('Are you sure you want to cancel this appointment?')) {
        return;
      }
      
      const { error } = await supabase
        .from('appointments')
        .update({ status: 'Cancelled' })
        .eq('id', appointment.id);
      
      if (error) throw error;
      
      // Update local state
      appointment.status = 'Cancelled';
      showNotification('Appointment cancelled successfully', 'success');
      
    } catch (err) {
      showNotification('Error cancelling appointment: ' + err.message, 'error');
      console.error(err);
    }
  }
  
  async function markAsCompleted(appointment) {
    try {
      const { error } = await supabase
        .from('appointments')
        .update({ status: 'Completed' })
        .eq('id', appointment.id);
      
      if (error) throw error;
      
      // Update local state
      appointment.status = 'Completed';
      showNotification('Appointment marked as completed', 'success');
      
    } catch (err) {
      showNotification('Error updating appointment: ' + err.message, 'error');
      console.error(err);
    }
  }
  
  async function markAsNoShow(appointment) {
    try {
      const { error } = await supabase
        .from('appointments')
        .update({ status: 'No-Show' })
        .eq('id', appointment.id);
      
      if (error) throw error;
      
      // Update local state
      appointment.status = 'No-Show';
      showNotification('Appointment marked as no-show', 'success');
      
    } catch (err) {
      showNotification('Error updating appointment: ' + err.message, 'error');
      console.error(err);
    }
  }
  
  function showNotification(message, type = 'success') {
    notification.message = message;
    notification.type = type;
    notification.show = true;
    
    // Auto-hide notification after 5 seconds
    setTimeout(() => {
      notification.show = false;
    }, 5000);
  }
  </script>