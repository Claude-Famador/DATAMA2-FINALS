import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { supabase } from '../supabase'
import { format, parseISO, startOfDay, endOfDay, addDays } from 'date-fns'

export const useAppointmentStore = defineStore('appointments', () => {
  const appointments = ref([])
  const currentAppointment = ref(null)
  const isLoading = ref(false)
  const error = ref(null)

  // Get all appointments
  async function fetchAppointments(filters = {}) {
    try {
      isLoading.value = true
      error.value = null
      
      let query = supabase
        .from('appointments')
        .select(`
          *,
          patients (id, first_name, last_name, phone)
        `)
      
      // Apply date filters if provided
      if (filters.startDate) {
        const start = startOfDay(parseISO(filters.startDate))
        query = query.gte('appointment_date', start.toISOString())
      }
      
      if (filters.endDate) {
        const end = endOfDay(parseISO(filters.endDate))
        query = query.lte('appointment_date', end.toISOString())
      }
      
      // Apply status filter if provided
      if (filters.status) {
        query = query.eq('status', filters.status)
      }
      
      // Apply patient filter if provided
      if (filters.patientId) {
        query = query.eq('patient_id', filters.patientId)
      }
      
      const { data, error: fetchError } = await query.order('appointment_date', { ascending: true })
      
      if (fetchError) throw fetchError
      appointments.value = data
      return data
    } catch (err) {
      error.value = err.message
      throw err
    } finally {
      isLoading.value = false
    }
  }

  // Get appointments for today
  async function fetchTodayAppointments() {
    const today = new Date()
    return fetchAppointments({ 
      startDate: format(today, 'yyyy-MM-dd'),
      endDate: format(today, 'yyyy-MM-dd')
    })
  }

  // Get appointments for the next week
  async function fetchWeekAppointments() {
    const today = new Date()
    const nextWeek = addDays(today, 7)
    return fetchAppointments({ 
      startDate: format(today, 'yyyy-MM-dd'),
      endDate: format(nextWeek, 'yyyy-MM-dd')
    })
  }

  // Get a single appointment by ID
  async function fetchAppointment(id) {
    try {
      isLoading.value = true
      error.value = null
      
      const { data, error: fetchError } = await supabase
        .from('appointments')
        .select(`
          *,
          patients (id, first_name, last_name, email, phone),
          treatments (*)
        `)
        .eq('id', id)
        .single()
      
      if (fetchError) throw fetchError
      currentAppointment.value = data
      return data
    } catch (err) {
      error.value = err.message
      throw err
    } finally {
      isLoading.value = false
    }
  }

  // Create a new appointment
  async function createAppointment(appointmentData) {
    try {
      isLoading.value = true
      error.value = null
      
      const { data, error: insertError } = await supabase
        .from('appointments')
        .insert(appointmentData)
        .select()
        .single()
      
      if (insertError) throw insertError
      appointments.value.push(data)
      return data
    } catch (err) {
      error.value = err.message
      throw err
    } finally {
      isLoading.value = false
    }
  }

  // Update an appointment
  async function updateAppointment(id, updates) {
    try {
      isLoading.value = true
      error.value = null
      
      const { data, error: updateError } = await supabase
        .from('appointments')
        .update(updates)
        .eq('id', id)
        .select()
        .single()
      
      if (updateError) throw updateError
      
      // Update local state
      const index = appointments.value.findIndex(a => a.id === id)
      if (index !== -1) {
        appointments.value[index] = { ...appointments.value[index], ...data }
      }
      if (currentAppointment.value?.id === id) {
        currentAppointment.value = { ...currentAppointment.value, ...data }
      }
      
      return data
    } catch (err) {
      error.value = err.message
      throw err
    } finally {
      isLoading.value = false
    }
  }

  // Delete an appointment
  async function deleteAppointment(id) {
    try {
      isLoading.value = true
      error.value = null
      
      const { error: deleteError } = await supabase
        .from('appointments')
        .delete()
        .eq('id', id)
      
      if (deleteError) throw deleteError
      
      // Update local state
      appointments.value = appointments.value.filter(a => a.id !== id)
      if (currentAppointment.value?.id === id) {
        currentAppointment.value = null
      }
    } catch (err) {
      error.value = err.message
      throw err
    } finally {
      isLoading.value = false
    }
  }

  // Update appointment status
  async function updateAppointmentStatus(id, status) {
    return updateAppointment(id, { status })
  }

  return {
    appointments,
    currentAppointment,
    isLoading,
    error,
    fetchAppointments,
    fetchTodayAppointments,
    fetchWeekAppointments,
    fetchAppointment,
    createAppointment,
    updateAppointment,
    deleteAppointment,
    updateAppointmentStatus
  }
})