<template>
  <div class="patients-page">
    <h1>Patients</h1>
    
    <div class="controls">
      <Button @click="openAddPatientModal" variant="primary">Add New Patient</Button>
      <div class="search-container">
        <input 
          type="text" 
          v-model="searchQuery" 
          placeholder="Search patients..." 
          @input="handleSearch"
        />
      </div>
    </div>

    <div v-if="loading" class="loading">
      Loading patients...
    </div>
    
    <div v-else-if="error" class="error">
      {{ error }}
    </div>
    
    <div v-else-if="filteredPatients.length === 0" class="no-results">
      No patients found.
    </div>
    
    <table v-else class="patients-table">
      <thead>
        <tr>
          <th @click="sortBy('last_name')">
            Name
            <span v-if="sortColumn === 'last_name'">{{ sortDirection === 'asc' ? '↑' : '↓' }}</span>
          </th>
          <th @click="sortBy('email')">
            Email
            <span v-if="sortColumn === 'email'">{{ sortDirection === 'asc' ? '↑' : '↓' }}</span>
          </th>
          <th @click="sortBy('phone')">
            Phone
            <span v-if="sortColumn === 'phone'">{{ sortDirection === 'asc' ? '↑' : '↓' }}</span>
          </th>
          <th @click="sortBy('last_appointment')">
            Last Appointment
            <span v-if="sortColumn === 'last_appointment'">{{ sortDirection === 'asc' ? '↑' : '↓' }}</span>
          </th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="patient in filteredPatients" :key="patient.id">
          <td>{{ patient.last_name }}, {{ patient.first_name }}</td>
          <td>{{ patient.email }}</td>
          <td>{{ patient.phone }}</td>
          <td>{{ formatDate(patient.last_appointment) }}</td>
          <td class="actions">
            <Button @click="viewPatient(patient.id)" variant="secondary" size="small">View</Button>
            <Button @click="editPatient(patient)" variant="secondary" size="small">Edit</Button>
            <Button @click="confirmDeletePatient(patient)" variant="danger" size="small">Delete</Button>
          </td>
        </tr>
      </tbody>
    </table>

    <Modal v-if="showAddEditModal" @close="showAddEditModal = false" :title="isEditing ? 'Edit Patient' : 'Add New Patient'">
      <form @submit.prevent="savePatient">
        <div class="form-group">
          <label for="firstName">First Name</label>
          <input id="firstName" v-model="currentPatient.first_name" required />
        </div>
        
        <div class="form-group">
          <label for="lastName">Last Name</label>
          <input id="lastName" v-model="currentPatient.last_name" required />
        </div>
        
        <div class="form-group">
          <label for="email">Email</label>
          <input id="email" type="email" v-model="currentPatient.email" required />
        </div>
        
        <div class="form-group">
          <label for="phone">Phone</label>
          <input id="phone" type="tel" v-model="currentPatient.phone" required />
        </div>
        
        <div class="form-group">
          <label for="birthdate">Date of Birth</label>
          <input id="birthdate" type="date" v-model="currentPatient.birthdate" required />
        </div>
        
        <div class="form-group">
          <label for="address">Address</label>
          <input id="address" v-model="currentPatient.address" />
        </div>
        
        <div class="form-group">
          <label for="insurance">Insurance Provider</label>
          <input id="insurance" v-model="currentPatient.insurance_provider" />
        </div>
        
        <div class="form-group">
          <label for="notes">Notes</label>
          <textarea id="notes" v-model="currentPatient.notes"></textarea>
        </div>
        
        <div class="modal-actions">
          <Button type="button" @click="showAddEditModal = false" variant="secondary">Cancel</Button>
          <Button type="submit" variant="primary">{{ isEditing ? 'Update' : 'Save' }}</Button>
        </div>
      </form>
    </Modal>
    
    <Modal v-if="showDeleteModal" @close="showDeleteModal = false" title="Confirm Deletion">
      <p>Are you sure you want to delete {{ patientToDelete?.first_name }} {{ patientToDelete?.last_name }}?</p>
      <p class="warning">This action cannot be undone.</p>
      
      <div class="modal-actions">
        <Button @click="showDeleteModal = false" variant="secondary">Cancel</Button>
        <Button @click="deletePatient" variant="danger">Delete</Button>
      </div>
    </Modal>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { supabase } from '../supabase';
import Button from '../components/ui/Button.vue';
import Modal from '../components/ui/Modal.vue';
import { usePatientStore } from '../stores/patients';

const router = useRouter();
const patientStore = usePatientStore();

// State
const patients = ref([]);
const filteredPatients = ref([]);
const loading = ref(true);
const error = ref(null);
const searchQuery = ref('');
const sortColumn = ref('last_name');
const sortDirection = ref('asc');
const showAddEditModal = ref(false);
const showDeleteModal = ref(false);
const isEditing = ref(false);
const currentPatient = ref({
  first_name: '',
  last_name: '',
  email: '',
  phone: '',
  birthdate: '',
  address: '',
  insurance_provider: '',
  notes: ''
});
const patientToDelete = ref(null);

// Fetch patients on component mount
onMounted(async () => {
  await fetchPatients();
});

// Methods
const fetchPatients = async () => {
  loading.value = true;
  error.value = null;
  
  try {
    const { data, error: supabaseError } = await supabase
      .from('patients')
      .select('*, appointments(scheduled_at)')
      .order(sortColumn.value, { ascending: sortDirection.value === 'asc' });
    
    if (supabaseError) throw supabaseError;
    
    // Process data to get last appointment date
    patients.value = data.map(patient => {
      // Find most recent appointment
      let lastAppointment = null;
      if (patient.appointments && patient.appointments.length > 0) {
        const dates = patient.appointments.map(app => new Date(app.scheduled_at));
        lastAppointment = new Date(Math.max(...dates));
      }
      
      return {
        ...patient,
        last_appointment: lastAppointment
      };
    });
    
    filteredPatients.value = [...patients.value];
    patientStore.setPatients(patients.value);
  } catch (err) {
    console.error('Error fetching patients:', err);
    error.value = 'Failed to load patients. Please try again.';
  } finally {
    loading.value = false;
  }
};

const handleSearch = () => {
  if (!searchQuery.value.trim()) {
    filteredPatients.value = [...patients.value];
    return;
  }
  
  const query = searchQuery.value.toLowerCase().trim();
  filteredPatients.value = patients.value.filter(patient => 
    patient.first_name.toLowerCase().includes(query) ||
    patient.last_name.toLowerCase().includes(query) ||
    patient.email.toLowerCase().includes(query) ||
    patient.phone.includes(query)
  );
};

const sortBy = (column) => {
  if (sortColumn.value === column) {
    // Toggle direction if clicking the same column
    sortDirection.value = sortDirection.value === 'asc' ? 'desc' : 'asc';
  } else {
    // Default to ascending for a new column
    sortColumn.value = column;
    sortDirection.value = 'asc';
  }
  
  // Re-sort the data
  const multiplier = sortDirection.value === 'asc' ? 1 : -1;
  
  filteredPatients.value.sort((a, b) => {
    const valA = a[column] || '';
    const valB = b[column] || '';
    
    if (column === 'last_appointment') {
      // Handle date comparison
      const dateA = valA ? new Date(valA).getTime() : 0;
      const dateB = valB ? new Date(valB).getTime() : 0;
      return multiplier * (dateA - dateB);
    }
    
    // String comparison for other fields
    return multiplier * valA.toString().localeCompare(valB.toString());
  });
};

const formatDate = (date) => {
  if (!date) return 'No appointments';
  return new Date(date).toLocaleDateString();
};

const openAddPatientModal = () => {
  isEditing.value = false;
  currentPatient.value = {
    first_name: '',
    last_name: '',
    email: '',
    phone: '',
    birthdate: '',
    address: '',
    insurance_provider: '',
    notes: ''
  };
  showAddEditModal.value = true;
};

const editPatient = (patient) => {
  isEditing.value = true;
  currentPatient.value = { ...patient };
  showAddEditModal.value = true;
};

const savePatient = async () => {
  try {
    if (isEditing.value) {
      const { error: updateError } = await supabase
        .from('patients')
        .update({
          first_name: currentPatient.value.first_name,
          last_name: currentPatient.value.last_name,
          email: currentPatient.value.email,
          phone: currentPatient.value.phone,
          birthdate: currentPatient.value.birthdate,
          address: currentPatient.value.address,
          insurance_provider: currentPatient.value.insurance_provider,
          notes: currentPatient.value.notes,
          updated_at: new Date()
        })
        .eq('id', currentPatient.value.id);
      
      if (updateError) throw updateError;
    } else {
      const { error: insertError } = await supabase
        .from('patients')
        .insert({
          first_name: currentPatient.value.first_name,
          last_name: currentPatient.value.last_name,
          email: currentPatient.value.email,
          phone: currentPatient.value.phone,
          birthdate: currentPatient.value.birthdate,
          address: currentPatient.value.address,
          insurance_provider: currentPatient.value.insurance_provider,
          notes: currentPatient.value.notes,
          created_at: new Date(),
          updated_at: new Date()
        });
      
      if (insertError) throw insertError;
    }
    
    // Refresh the patient list
    await fetchPatients();
    showAddEditModal.value = false;
  } catch (err) {
    console.error('Error saving patient:', err);
    error.value = `Failed to ${isEditing.value ? 'update' : 'create'} patient. Please try again.`;
  }
};

const viewPatient = (patientId) => {
  router.push(`/patients/${patientId}`);
};

const confirmDeletePatient = (patient) => {
  patientToDelete.value = patient;
  showDeleteModal.value = true;
};

const deletePatient = async () => {
  try {
    const { error: deleteError } = await supabase
      .from('patients')
      .delete()
      .eq('id', patientToDelete.value.id);
    
    if (deleteError) throw deleteError;
    
    // Refresh the patient list
    await fetchPatients();
    showDeleteModal.value = false;
  } catch (err) {
    console.error('Error deleting patient:', err);
    error.value = 'Failed to delete patient. Please try again.';
  }
};
</script>

<style>
.patients-page {
  padding: 20px;
}

.controls {
  display: flex;
  justify-content: space-between;
  margin-bottom: 20px;
}

.search-container {
  width: 300px;
}

.patients-table {
  width: 100%;
  border-collapse: collapse;
  margin-top: 10px;
}

.patients-table th {
  cursor: pointer;
  background-color: #f2f2f2;
  text-align: left;
  padding: 12px;
}

.patients-table th:hover {
  background-color: #e0e0e0;
}

.patients-table td {
  padding: 10px;
  border-bottom: 1px solid #ddd;
}

.actions {
  display: flex;
  gap: 5px;
}

.form-group {
  margin-bottom: 15px;
}

.form-group label {
  display: block;
  margin-bottom: 5px;
  font-weight: bold;
}

.form-group input,
.form-group textarea {
  width: 100%;
  padding: 8px;
  border: 1px solid #ddd;
  border-radius: 4px;
}

.modal-actions {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
  margin-top: 20px;
}

.warning {
  color: #d32f2f;
  font-weight: bold;
}

.loading, .error, .no-results {
  padding: 20px;
  text-align: center;
}

.error {
  color: #d32f2f;
}
</style>