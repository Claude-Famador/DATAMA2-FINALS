<template>
    <DefaultLayout>
      <div v-if="loading" class="flex justify-center items-center min-h-[50vh]">
        <div class="animate-spin h-8 w-8 border-4 border-blue-500 rounded-full border-t-transparent"></div>
      </div>
      
      <div v-else-if="error" class="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
        {{ error }}
      </div>
      
      <div v-else class="space-y-6">
        <!-- Patient Header -->
        <div class="flex justify-between items-center">
          <div>
            <h1 class="text-2xl font-bold">{{ patient.first_name }} {{ patient.last_name }}</h1>
            <p class="text-gray-600">Patient ID: {{ patient.id }}</p>
          </div>
          <div class="flex gap-3">
            <Button @click="editMode = !editMode">
              {{ editMode ? 'Cancel' : 'Edit Patient' }}
            </Button>
            <Button v-if="!editMode" @click="navigateToAppointmentForm" variant="secondary">
              Schedule Appointment
            </Button>
          </div>
        </div>
        
        <!-- Patient Information -->
        <div v-if="!editMode" class="bg-white shadow rounded-lg p-6">
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h2 class="text-lg font-semibold mb-4">Personal Information</h2>
              <div class="space-y-3">
                <div>
                  <p class="text-sm text-gray-500">Full Name</p>
                  <p>{{ patient.first_name }} {{ patient.last_name }}</p>
                </div>
                <div>
                  <p class="text-sm text-gray-500">Date of Birth</p>
                  <p>{{ formatDate(patient.date_of_birth) }}</p>
                </div>
                <div>
                  <p class="text-sm text-gray-500">Gender</p>
                  <p>{{ patient.gender }}</p>
                </div>
                <div>
                  <p class="text-sm text-gray-500">Email</p>
                  <p>{{ patient.email }}</p>
                </div>
                <div>
                  <p class="text-sm text-gray-500">Phone</p>
                  <p>{{ patient.phone }}</p>
                </div>
              </div>
            </div>
            
            <div>
              <h2 class="text-lg font-semibold mb-4">Medical Information</h2>
              <div class="space-y-3">
                <div>
                  <p class="text-sm text-gray-500">Insurance Provider</p>
                  <p>{{ patient.insurance_provider || 'Not specified' }}</p>
                </div>
                <div>
                  <p class="text-sm text-gray-500">Insurance ID</p>
                  <p>{{ patient.insurance_id || 'Not specified' }}</p>
                </div>
                <div>
                  <p class="text-sm text-gray-500">Medical Conditions</p>
                  <p>{{ patient.medical_conditions || 'None' }}</p>
                </div>
                <div>
                  <p class="text-sm text-gray-500">Allergies</p>
                  <p>{{ patient.allergies || 'None' }}</p>
                </div>
                <div>
                  <p class="text-sm text-gray-500">Notes</p>
                  <p>{{ patient.notes || 'No notes' }}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <!-- Edit Form -->
        <div v-else class="bg-white shadow rounded-lg p-6">
          <form @submit.prevent="updatePatient" class="space-y-4">
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label class="block text-sm font-medium text-gray-700">First Name</label>
                <input v-model="form.first_name" type="text" class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500">
              </div>
              
              <div>
                <label class="block text-sm font-medium text-gray-700">Last Name</label>
                <input v-model="form.last_name" type="text" class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500">
              </div>
              
              <div>
                <label class="block text-sm font-medium text-gray-700">Date of Birth</label>
                <input v-model="form.date_of_birth" type="date" class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500">
              </div>
              
              <div>
                <label class="block text-sm font-medium text-gray-700">Gender</label>
                <select v-model="form.gender" class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500">
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                </select>
              </div>
              
              <div>
                <label class="block text-sm font-medium text-gray-700">Email</label>
                <input v-model="form.email" type="email" class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500">
              </div>
              
              <div>
                <label class="block text-sm font-medium text-gray-700">Phone</label>
                <input v-model="form.phone" type="text" class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500">
              </div>
              
              <div>
                <label class="block text-sm font-medium text-gray-700">Insurance Provider</label>
                <input v-model="form.insurance_provider" type="text" class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500">
              </div>
              
              <div>
                <label class="block text-sm font-medium text-gray-700">Insurance ID</label>
                <input v-model="form.insurance_id" type="text" class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500">
              </div>
            </div>
            
            <div>
              <label class="block text-sm font-medium text-gray-700">Medical Conditions</label>
              <textarea v-model="form.medical_conditions" rows="2" class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"></textarea>
            </div>
            
            <div>
              <label class="block text-sm font-medium text-gray-700">Allergies</label>
              <textarea v-model="form.allergies" rows="2" class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"></textarea>
            </div>
            
            <div>
              <label class="block text-sm font-medium text-gray-700">Notes</label>
              <textarea v-model="form.notes" rows="3" class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"></textarea>
            </div>
            
            <div class="flex justify-end space-x-3">
              <Button type="button" @click="editMode = false" variant="secondary">Cancel</Button>
              <Button type="submit" :loading="updating">Save Changes</Button>
            </div>
          </form>
        </div>
        
        <!-- Appointments History -->
        <div class="bg-white shadow rounded-lg p-6">
          <div class="flex justify-between items-center mb-4">
            <h2 class="text-lg font-semibold">Appointment History</h2>
            <Button @click="navigateToAppointmentForm" size="sm">New Appointment</Button>
          </div>
          
          <div v-if="appointments.length === 0" class="text-center py-8 text-gray-500">
            No appointments found for this patient.
          </div>
          
          <div v-else class="overflow-x-auto">
            <table class="min-w-full divide-y divide-gray-200">
              <thead class="bg-gray-50">
                <tr>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Time</th>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody class="bg-white divide-y divide-gray-200">
                <tr v-for="appointment in appointments" :key="appointment.id">
                  <td class="px-6 py-4 whitespace-nowrap">{{ formatDate(appointment.date) }}</td>
                  <td class="px-6 py-4 whitespace-nowrap">{{ appointment.time }}</td>
                  <td class="px-6 py-4 whitespace-nowrap">{{ appointment.type }}</td>
                  <td class="px-6 py-4 whitespace-nowrap">
                    <span :class="getStatusClass(appointment.status)">
                      {{ appointment.status }}
                    </span>
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap">
                    <div class="flex space-x-2">
                      <button @click="viewAppointment(appointment.id)" class="text-blue-600 hover:text-blue-900">View</button>
                      <button v-if="canEditAppointment(appointment)" @click="editAppointment(appointment.id)" class="text-yellow-600 hover:text-yellow-900">Edit</button>
                      <button v-if="canCancelAppointment(appointment)" @click="cancelAppointment(appointment.id)" class="text-red-600 hover:text-red-900">Cancel</button>
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
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
  import { ref, reactive, onMounted, computed } from 'vue';
  import { useRoute, useRouter } from 'vue-router';
  import { supabase } from '../supabase';
  import DefaultLayout from '../layouts/DefaultLayout.vue';
  import Button from '../components/ui/Button.vue';
  import Notification from '../components/ui/Notification.vue';
  
  const route = useRoute();
  const router = useRouter();
  const patientId = route.params.id;
  
  const patient = ref({});
  const appointments = ref([]);
  const loading = ref(true);
  const updating = ref(false);
  const error = ref(null);
  const editMode = ref(false);
  
  const form = reactive({
    first_name: '',
    last_name: '',
    date_of_birth: '',
    gender: '',
    email: '',
    phone: '',
    insurance_provider: '',
    insurance_id: '',
    medical_conditions: '',
    allergies: '',
    notes: ''
  });
  
  const notification = reactive({
    show: false,
    message: '',
    type: 'success'
  });
  
  onMounted(async () => {
    await fetchPatientData();
    await fetchAppointments();
  });
  
  async function fetchPatientData() {
    try {
      loading.value = true;
      const { data, error: fetchError } = await supabase
        .from('patients')
        .select('*')
        .eq('id', patientId)
        .single();
  
      if (fetchError) throw fetchError;
      
      patient.value = data;
      
      // Populate form with patient data
      Object.keys(form).forEach(key => {
        if (data[key] !== undefined) {
          form[key] = data[key];
        }
      });
  
    } catch (err) {
      error.value = 'Error loading patient data: ' + err.message;
      console.error(err);
    } finally {
      loading.value = false;
    }
  }
  
  async function fetchAppointments() {
    try {
      const { data, error: fetchError } = await supabase
        .from('appointments')
        .select('*')
        .eq('patient_id', patientId)
        .order('date', { ascending: false });
  
      if (fetchError) throw fetchError;
      
      appointments.value = data;
  
    } catch (err) {
      console.error('Error loading appointments:', err);
    }
  }
  
  async function updatePatient() {
    try {
      updating.value = true;
      
      const { data, error: updateError } = await supabase
        .from('patients')
        .update(form)
        .eq('id', patientId)
        .select()
        .single();
  
      if (updateError) throw updateError;
      
      patient.value = data;
      editMode.value = false;
      showNotification('Patient information updated successfully', 'success');
  
    } catch (err) {
      showNotification('Error updating patient: ' + err.message, 'error');
      console.error(err);
    } finally {
      updating.value = false;
    }
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
  
  function navigateToAppointmentForm() {
    router.push({ 
      name: 'AppointmentForm',
      query: { patientId: patientId }
    });
  }
  
  function viewAppointment(appointmentId) {
    router.push({ 
      name: 'AppointmentDetails',
      params: { id: appointmentId }
    });
  }
  
  function editAppointment(appointmentId) {
    router.push({ 
      name: 'AppointmentForm',
      params: { id: appointmentId }
    });
  }
  
  function canEditAppointment(appointment) {
    // Can edit if appointment is scheduled and in the future
    return appointment.status === 'Scheduled' && new Date(appointment.date) > new Date();
  }
  
  function canCancelAppointment(appointment) {
    // Can cancel if appointment is scheduled and in the future
    return appointment.status === 'Scheduled' && new Date(appointment.date) > new Date();
  }
  
  async function cancelAppointment(appointmentId) {
    try {
      if (!confirm('Are you sure you want to cancel this appointment?')) {
        return;
      }
      
      const { error: updateError } = await supabase
        .from('appointments')
        .update({ status: 'Cancelled' })
        .eq('id', appointmentId);
  
      if (updateError) throw updateError;
      
      // Refresh appointment list
      await fetchAppointments();
      showNotification('Appointment cancelled successfully', 'success');
  
    } catch (err) {
      showNotification('Error cancelling appointment: ' + err.message, 'error');
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