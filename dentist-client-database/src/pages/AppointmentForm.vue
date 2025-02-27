<template>
    <div class="appointment-form">
      <h1 class="text-2xl font-bold mb-6">{{ isEditing ? 'Edit Appointment' : 'New Appointment' }}</h1>
      
      <form @submit.prevent="saveAppointment" class="space-y-6">
        <!-- Patient Selection -->
        <div class="form-group">
          <label for="patient" class="block text-sm font-medium mb-1">Patient</label>
          <select 
            id="patient" 
            v-model="form.patient_id" 
            required
            class="w-full p-2 border rounded focus:ring focus:ring-blue-200 transition"
          >
            <option value="" disabled>Select a patient</option>
            <option v-for="patient in patients" :key="patient.id" :value="patient.id">
              {{ patient.first_name }} {{ patient.last_name }}
            </option>
          </select>
        </div>
  
        <!-- Date & Time Selection -->
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div class="form-group">
            <label for="date" class="block text-sm font-medium mb-1">Date</label>
            <input 
              id="date" 
              type="date" 
              v-model="form.date" 
              required
              class="w-full p-2 border rounded focus:ring focus:ring-blue-200 transition"
            >
          </div>
          <div class="form-group">
            <label for="time" class="block text-sm font-medium mb-1">Time</label>
            <input 
              id="time" 
              type="time" 
              v-model="form.time" 
              required
              class="w-full p-2 border rounded focus:ring focus:ring-blue-200 transition"
            >
          </div>
        </div>
  
        <!-- Treatment Type -->
        <div class="form-group">
          <label for="treatmentType" class="block text-sm font-medium mb-1">Treatment Type</label>
          <select 
            id="treatmentType" 
            v-model="form.treatment_type" 
            required
            class="w-full p-2 border rounded focus:ring focus:ring-blue-200 transition"
          >
            <option value="" disabled>Select treatment type</option>
            <option value="cleaning">Cleaning</option>
            <option value="filling">Filling</option>
            <option value="root_canal">Root Canal</option>
            <option value="extraction">Extraction</option>
            <option value="crown">Crown</option>
            <option value="consultation">Consultation</option>
            <option value="checkup">Check-up</option>
            <option value="other">Other</option>
          </select>
        </div>
  
        <!-- Duration -->
        <div class="form-group">
          <label for="duration" class="block text-sm font-medium mb-1">Duration (minutes)</label>
          <select 
            id="duration" 
            v-model="form.duration" 
            required
            class="w-full p-2 border rounded focus:ring focus:ring-blue-200 transition"
          >
            <option value="15">15 minutes</option>
            <option value="30">30 minutes</option>
            <option value="45">45 minutes</option>
            <option value="60">60 minutes</option>
            <option value="90">90 minutes</option>
            <option value="120">120 minutes</option>
          </select>
        </div>
  
        <!-- Notes -->
        <div class="form-group">
          <label for="notes" class="block text-sm font-medium mb-1">Notes</label>
          <textarea 
            id="notes" 
            v-model="form.notes" 
            rows="3"
            class="w-full p-2 border rounded focus:ring focus:ring-blue-200 transition"
          ></textarea>
        </div>
  
        <!-- Status -->
        <div class="form-group">
          <label for="status" class="block text-sm font-medium mb-1">Status</label>
          <select 
            id="status" 
            v-model="form.status" 
            required
            class="w-full p-2 border rounded focus:ring focus:ring-blue-200 transition"
          >
            <option value="scheduled">Scheduled</option>
            <option value="confirmed">Confirmed</option>
            <option value="completed">Completed</option>
            <option value="cancelled">Cancelled</option>
            <option value="no_show">No Show</option>
          </select>
        </div>
  
        <!-- Buttons -->
        <div class="flex justify-between pt-4">
          <button 
            type="button" 
            @click="goBack"
            class="px-4 py-2 border border-gray-300 rounded shadow-sm hover:bg-gray-50 transition"
          >
            Cancel
          </button>
          <button 
            type="submit" 
            class="px-4 py-2 bg-blue-600 text-white rounded shadow-sm hover:bg-blue-700 transition"
            :disabled="loading"
          >
            {{ loading ? 'Saving...' : (isEditing ? 'Update Appointment' : 'Create Appointment') }}
          </button>
        </div>
      </form>
  
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
  import { useRoute, useRouter } from 'vue-router';
  import { useAppointmentsStore } from '../stores/appointments';
  import { usePatientsStore } from '../stores/patients';
  import { supabase } from '../supabase';
  import Notification from '../components/ui/Notification.vue';
  
  // Stores & Router
  const appointmentsStore = useAppointmentsStore();
  const patientsStore = usePatientsStore();
  const route = useRoute();
  const router = useRouter();
  
  // State
  const loading = ref(false);
  const patients = ref([]);
  const notification = ref({
    show: false,
    type: 'success',
    message: ''
  });
  
  // Form data
  const form = ref({
    patient_id: '',
    date: '',
    time: '',
    treatment_type: '',
    duration: '30', // Default to 30 minutes
    notes: '',
    status: 'scheduled', // Default to scheduled
  });
  
  // Computed
  const isEditing = computed(() => !!route.params.id);
  
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
  
  const loadAppointment = async (id) => {
    try {
      loading.value = true;
      const { data, error } = await supabase
        .from('appointments')
        .select('*')
        .eq('id', id)
        .single();
  
      if (error) throw error;
      
      // Format date and time from ISO string
      if (data) {
        const dateTime = new Date(data.appointment_datetime);
        form.value = {
          patient_id: data.patient_id,
          date: dateTime.toISOString().split('T')[0],
          time: dateTime.toTimeString().slice(0, 5),
          treatment_type: data.treatment_type,
          duration: data.duration.toString(),
          notes: data.notes || '',
          status: data.status,
        };
      }
    } catch (error) {
      showNotification('error', 'Error loading appointment: ' + error.message);
    } finally {
      loading.value = false;
    }
  };
  
  const loadPatients = async () => {
    try {
      // Get patients from store or fetch if needed
      if (patientsStore.patients.length === 0) {
        await patientsStore.fetchPatients();
      }
      patients.value = patientsStore.patients;
    } catch (error) {
      showNotification('error', 'Error loading patients: ' + error.message);
    }
  };
  
  const saveAppointment = async () => {
    try {
      loading.value = true;
      
      // Combine date and time into ISO string
      const dateTimeStr = `${form.value.date}T${form.value.time}:00`;
      const appointmentData = {
        patient_id: form.value.patient_id,
        appointment_datetime: dateTimeStr,
        treatment_type: form.value.treatment_type,
        duration: parseInt(form.value.duration),
        notes: form.value.notes,
        status: form.value.status,
      };
  
      let result;
      
      if (isEditing.value) {
        result = await appointmentsStore.updateAppointment(route.params.id, appointmentData);
        if (result.error) throw result.error;
        showNotification('success', 'Appointment updated successfully');
      } else {
        result = await appointmentsStore.createAppointment(appointmentData);
        if (result.error) throw result.error;
        showNotification('success', 'Appointment created successfully');
      }
  
      // Navigate back to appointments list after brief delay
      setTimeout(() => {
        router.push({ name: 'appointments' });
      }, 1500);
    } catch (error) {
      showNotification('error', `Error ${isEditing.value ? 'updating' : 'creating'} appointment: ${error.message}`);
    } finally {
      loading.value = false;
    }
  };
  
  const goBack = () => {
    router.push({ name: 'appointments' });
  };
  
  // Lifecycle hooks
  onMounted(async () => {
    await loadPatients();
    
    if (isEditing.value && route.params.id) {
      await loadAppointment(route.params.id);
    }
  });
  </script>