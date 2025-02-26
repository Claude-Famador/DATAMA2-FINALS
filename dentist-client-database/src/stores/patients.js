import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { supabase } from '../supabase'

export const usePatientStore = defineStore('patients', () => {
  const patients = ref([])
  const currentPatient = ref(null)
  const isLoading = ref(false)
  const error = ref(null)

  // Get all patients
  async function fetchPatients() {
    try {
      isLoading.value = true
      error.value = null
      
      const { data, error: fetchError } = await supabase
        .from('patients')
        .select('*')
        .order('last_name', { ascending: true })
      
      if (fetchError) throw fetchError
      patients.value = data
    } catch (err) {
      error.value = err.message
    } finally {
      isLoading.value = false
    }
  }

  // Get a single patient by ID
  async function fetchPatient(id) {
    try {
      isLoading.value = true
      error.value = null
      
      const { data, error: fetchError } = await supabase
        .from('patients')
        .select(`
          *,
          appointments(
            *,
            treatments(*)
          )
        `)
        .eq('id', id)
        .single()
      
      if (fetchError) throw fetchError
      currentPatient.value = data
      return data
    } catch (err) {
      error.value = err.message
    } finally {
      isLoading.value = false
    }
  }

  // Create a new patient
  async function createPatient(patientData) {
    try {
      isLoading.value = true
      error.value = null
      
      const { data, error: insertError } = await supabase
        .from('patients')
        .insert(patientData)
        .select()
        .single()
      
      if (insertError) throw insertError
      patients.value.push(data)
      return data
    } catch (err) {
      error.value = err.message
      throw err
    } finally {
      isLoading.value = false
    }
  }

  // Update a patient
  async function updatePatient(id, updates) {
    try {
      isLoading.value = true
      error.value = null
      
      const { data, error: updateError } = await supabase
        .from('patients')
        .update(updates)
        .eq('id', id)
        .select()
        .single()
      
      if (updateError) throw updateError
      
      // Update local state
      const index = patients.value.findIndex(p => p.id === id)
      if (index !== -1) {
        patients.value[index] = { ...patients.value[index], ...data }
      }
      if (currentPatient.value?.id === id) {
        currentPatient.value = { ...currentPatient.value, ...data }
      }
      
      return data
    } catch (err) {
      error.value = err.message
      throw err
    } finally {
      isLoading.value = false
    }
  }

  // Delete a patient
  async function deletePatient(id) {
    try {
      isLoading.value = true
      error.value = null
      
      const { error: deleteError } = await supabase
        .from('patients')
        .delete()
        .eq('id', id)
      
      if (deleteError) throw deleteError
      
      // Update local state
      patients.value = patients.value.filter(p => p.id !== id)
      if (currentPatient.value?.id === id) {
        currentPatient.value = null
      }
    } catch (err) {
      error.value = err.message
      throw err
    } finally {
      isLoading.value = false
    }
  }

  // Search patients
  async function searchPatients(query) {
    try {
      isLoading.value = true
      error.value = null
      
      const { data, error: searchError } = await supabase
        .from('patients')
        .select('*')
        .or(`first_name.ilike.%${query}%,last_name.ilike.%${query}%,email.ilike.%${query}%,phone.ilike.%${query}%`)
        .order('last_name', { ascending: true })
      
      if (searchError) throw searchError
      return data
    } catch (err) {
      error.value = err.message
      throw err
    } finally {
      isLoading.value = false
    }
  }

  return {
    patients,
    currentPatient,
    isLoading,
    error,
    fetchPatients,
    fetchPatient,
    createPatient,
    updatePatient,
    deletePatient,
    searchPatients
  }
})