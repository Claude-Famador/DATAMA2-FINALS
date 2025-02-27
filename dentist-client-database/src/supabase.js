import { createClient } from '@supabase/supabase-js'

// Supabase configuration
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

// Create a single supabase client for interacting with your database
const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Custom error handling wrapper
const handleError = (error) => {
  console.error('Supabase error:', error)
  throw error
}

// Auth related functions
export const auth = {
  // Get current user
  getUser: async () => {
    const { data: { user }, error } = await supabase.auth.getUser()
    if (error) handleError(error)
    return user
  },
  
  // Sign in with email and password
  signIn: async (email, password) => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password
    })
    if (error) handleError(error)
    return data
  },
  
  // Sign up with email and password
  signUp: async (email, password) => {
    const { data, error } = await supabase.auth.signUp({
      email,
      password
    })
    if (error) handleError(error)
    return data
  },
  
  // Sign out
  signOut: async () => {
    const { error } = await supabase.auth.signOut()
    if (error) handleError(error)
    return true
  },
  
  // Reset password
  resetPassword: async (email) => {
    const { data, error } = await supabase.auth.resetPasswordForEmail(email)
    if (error) handleError(error)
    return data
  }
}

// Patient related functions
export const patients = {
  // Get all patients
  getAll: async () => {
    const { data, error } = await supabase
      .from('patients')
      .select('*')
      .order('last_name', { ascending: true })
    
    if (error) handleError(error)
    return data
  },
  
  // Get patient by ID
  getById: async (id) => {
    const { data, error } = await supabase
      .from('patients')
      .select('*, medical_history(*), appointments(*)')
      .eq('id', id)
      .single()
    
    if (error) handleError(error)
    return data
  },
  
  // Create patient
  create: async (patientData) => {
    const { data, error } = await supabase
      .from('patients')
      .insert(patientData)
      .select()
    
    if (error) handleError(error)
    return data
  },
  
  // Update patient
  update: async (id, patientData) => {
    const { data, error } = await supabase
      .from('patients')
      .update(patientData)
      .eq('id', id)
      .select()
    
    if (error) handleError(error)
    return data
  },
  
  // Delete patient
  delete: async (id) => {
    const { error } = await supabase
      .from('patients')
      .delete()
      .eq('id', id)
    
    if (error) handleError(error)
    return true
  },
  
  // Search patients
  search: async (query) => {
    const { data, error } = await supabase
      .from('patients')
      .select('*')
      .or(`first_name.ilike.%${query}%,last_name.ilike.%${query}%,email.ilike.%${query}%,phone.ilike.%${query}%`)
      .order('last_name', { ascending: true })
    
    if (error) handleError(error)
    return data
  }
}

// Appointment related functions
export const appointments = {
  // Get all appointments
  getAll: async () => {
    const { data, error } = await supabase
      .from('appointments')
      .select('*, patients(*)')
      .order('appointment_date', { ascending: true })
    
    if (error) handleError(error)
    return data
  },
  
  // Get appointments for a specific date range
  getByDateRange: async (startDate, endDate) => {
    const { data, error } = await supabase
      .from('appointments')
      .select('*, patients(*)')
      .gte('appointment_date', startDate)
      .lte('appointment_date', endDate)
      .order('appointment_date', { ascending: true })
    
    if (error) handleError(error)
    return data
  },
  
  // Get appointment by ID
  getById: async (id) => {
    const { data, error } = await supabase
      .from('appointments')
      .select('*, patients(*)')
      .eq('id', id)
      .single()
    
    if (error) handleError(error)
    return data
  },
  
  // Create appointment
  create: async (appointmentData) => {
    const { data, error } = await supabase
      .from('appointments')
      .insert(appointmentData)
      .select()
    
    if (error) handleError(error)
    return data
  },
  
  // Update appointment
  update: async (id, appointmentData) => {
    const { data, error } = await supabase
      .from('appointments')
      .update(appointmentData)
      .eq('id', id)
      .select()
    
    if (error) handleError(error)
    return data
  },
  
  // Delete appointment
  delete: async (id) => {
    const { error } = await supabase
      .from('appointments')
      .delete()
      .eq('id', id)
    
    if (error) handleError(error)
    return true
  },
  
  // Get appointments for a specific patient
  getByPatient: async (patientId) => {
    const { data, error } = await supabase
      .from('appointments')
      .select('*')
      .eq('patient_id', patientId)
      .order('appointment_date', { ascending: true })
    
    if (error) handleError(error)
    return data
  }
}

// For direct access to Supabase client if needed
export const supabaseClient = supabase

export default {
  auth,
  patients,
  appointments,
  supabase: supabaseClient
}