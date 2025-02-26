<template>
    <div class="dashboard">
      <h1 class="page-title">Dashboard</h1>
      
      <div class="stats-grid">
        <div class="stat-card">
          <div class="stat-card-content">
            <div class="stat-card-title">Total Patients</div>
            <div class="stat-card-value">{{ stats.totalPatients }}</div>
          </div>
          <div class="stat-card-icon">
            <i class="fas fa-users"></i>
          </div>
        </div>
        
        <div class="stat-card">
          <div class="stat-card-content">
            <div class="stat-card-title">Today's Appointments</div>
            <div class="stat-card-value">{{ stats.todayAppointments }}</div>
          </div>
          <div class="stat-card-icon">
            <i class="fas fa-calendar-day"></i>
          </div>
        </div>
        
        <div class="stat-card">
          <div class="stat-card-content">
            <div class="stat-card-title">Upcoming Appointments</div>
            <div class="stat-card-value">{{ stats.upcomingAppointments }}</div>
          </div>
          <div class="stat-card-icon">
            <i class="fas fa-calendar-alt"></i>
          </div>
        </div>
      </div>
      
      <div class="dashboard-sections">
        <div class="dashboard-section">
          <div class="section-header">
            <h2>Today's Appointments</h2>
            <router-link :to="{ name: 'Appointments' }" class="view-all">View All</router-link>
          </div>
          
          <div v-if="loading" class="loading-indicator">Loading...</div>
          
          <div v-else-if="todayAppointments.length === 0" class="empty-state">
            No appointments scheduled for today.
          </div>
          
          <div v-else class="appointments-list">
            <div v-for="appointment in todayAppointments" :key="appointment.id" class="appointment-card">
              <div class="appointment-time">
                {{ formatTime(appointment.start_time) }}
              </div>
              <div class="appointment-details">
                <div class="patient-name">{{ appointment.patients.first_name }} {{ appointment.patients.last_name }}</div>
                <div class="appointment-type">{{ appointment.appointment_type }}</div>
              </div>
              <div class="appointment-status" :class="getStatusClass(appointment.status)">
                {{ appointment.status }}
              </div>
            </div>
          </div>
        </div>
        
        <div class="dashboard-section">
          <div class="section-header">
            <h2>Recent Patients</h2>
            <router-link :to="{ name: 'Patients' }" class="view-all">View All</router-link>
          </div>
          
          <div v-if="loading" class="loading-indicator">Loading...</div>
          
          <div v-else-if="recentPatients.length === 0" class="empty-state">
            No recent patients.
          </div>
          
          <div v-else class="patients-list">
            <div v-for="patient in recentPatients" :key="patient.id" class="patient-item">
              <div class="patient-initials">
                {{ getInitials(patient.first_name, patient.last_name) }}
              </div>
              <div class="patient-info">
                <div class="patient-name">{{ patient.first_name }} {{ patient.last_name }}</div>
                <div class="patient-details">{{ patient.phone }}</div>
              </div>
              <router-link :to="{ name: 'PatientDetails', params: { id: patient.id } }" class="view-patient-btn">
                View
              </router-link>
            </div>
          </div>
        </div>
      </div>
    </div>
  </template>
  
  <script setup>
  import { ref, onMounted, computed } from 'vue'
  import { supabase } from '../supabase'
  
  const loading = ref(true)
  const todayAppointments = ref([])
  const recentPatients = ref([])
  const stats = ref({
    totalPatients: 0,
    todayAppointments: 0,
    upcomingAppointments: 0
  })
  
  onMounted(async () => {
    await Promise.all([
      fetchTodayAppointments(),
      fetchRecentPatients(),
      fetchStats()
    ])
    loading.value = false
  })
  
  async function fetchTodayAppointments() {
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    
    const tomorrow = new Date(today)
    tomorrow.setDate(tomorrow.getDate() + 1)
    
    const { data, error } = await supabase
      .from('appointments')
      .select(`
        *,
        patients (id, first_name, last_name)
      `)
      .gte('start_time', today.toISOString())
      .lt('start_time', tomorrow.toISOString())
      .order('start_time', { ascending: true })
    
    if (error) {
      console.error('Error fetching today appointments:', error)
    } else {
      todayAppointments.value = data
    }
  }
  
  async function fetchRecentPatients() {
    const { data, error } = await supabase
      .from('patients')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(5)
    
    if (error) {
      console.error('Error fetching recent patients:', error)
    } else {
      recentPatients.value = data
    }
  }
  
  async function fetchStats() {
    // Get total patients
    const { count: patientsCount, error: patientsError } = await supabase
      .from('patients')
      .select('*', { count: 'exact', head: true })
    
    if (patientsError) {
      console.error('Error counting patients:', patientsError)
    } else {
      stats.value.totalPatients = patientsCount
    }
    
    // Get today's appointments count
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    
    const tomorrow = new Date(today)
    tomorrow.setDate(tomorrow.getDate() + 1)
    
    const { count: todayCount, error: todayError } = await supabase
      .from('appointments')
      .select('*', { count: 'exact', head: true })
      .gte('start_time', today.toISOString())
      .lt('start_time', tomorrow.toISOString())
    
    if (todayError) {
      console.error('Error counting today appointments:', todayError)
    } else {
      stats.value.todayAppointments = todayCount
    }
    
    // Get upcoming appointments (excluding today)
    const { count: upcomingCount, error: upcomingError } = await supabase
      .from('appointments')
      .select('*', { count: 'exact', head: true })
      .gt('start_time', tomorrow.toISOString())
    
    if (upcomingError) {
      console.error('Error counting upcoming appointments:', upcomingError)
    } else {
      stats.value.upcomingAppointments = upcomingCount
    }
  }
  
  function formatTime(dateTimeString) {
    const date = new Date(dateTimeString)
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
  }
  
  function getInitials(firstName, lastName) {
    return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase()
  }
  
  function getStatusClass(status) {
    const statusMap = {
      'Scheduled': 'status-scheduled',
      'Confirmed': 'status-confirmed',
      'Completed': 'status-completed',
      'Cancelled': 'status-cancelled',
      'No-Show': 'status-no-show'
    }
    return statusMap[status] || ''
  }
  </script>
  
  <style scoped>
  .dashboard {
    padding: 0.5rem;
  }
  
  .page-title {
    margin-bottom: 1.5rem;
  }
  
  .stats-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
    gap: 1.5rem;
    margin-bottom: 2rem;
  }
  
  .stat-card {
    background-color: white;
    border-radius: 8px;
    box-shadow: 0 2px 6px rgba(0, 0, 0, 0.1);
    padding: 1.5rem;
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
  
  .stat-card-title {
    color: #666;
    font-size: 1rem;
    margin-bottom: 0.5rem;
  }
  
  .stat-card-value {
    font-size: 2rem;
    font-weight: 700;
    color: #333;
  }
  
  .stat-card-icon {
    font-size: 2.5rem;
    color: #3498db;
    opacity: 0.7;
  }
  
  .dashboard-sections {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(450px, 1fr));
    gap: 1.5rem;
  }
  
  .dashboard-section {
    background-color: white;
    border-radius: 8px;
    box-shadow: 0 2px 6px rgba(0, 0, 0, 0.1);
    padding: 1.5rem;
  }
  
  .section-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 1.25rem;
  }
  
  .section-header h2 {
    margin: 0;
    font-size: 1.25rem;
  }
  
  .view-all {
    color: #3498db;
    text-decoration: none;
    font-size: 0.875rem;
  }
  
  .view-all:hover {
    text-decoration: underline;
  }
  
  .loading-indicator {
    text-align: center;
    padding: 2rem 0;
    color: #666;
  }
  
  .empty-state {
    text-align: center;
    padding: 2rem 0;
    color: #666;
  }
  
  .appointments-list {
    display: flex;
    flex-direction: column;
    gap: 0.75rem;
  }
  
  .appointment-card {
    display: flex;
    align-items: center;
    padding: 1rem;
    border: 1px solid #eee;
    border-radius: 4px;
    transition: 0.3s;
  }
  
  .appointment-card:hover {
    background-color: #f9f9f9;
  }
  
  .appointment-time {
    font-weight: 600;
    min-width: 80px;
  }
  
  .appointment-details {
    flex: 1;
  }
  
  .patient-name {
    font-weight: 500;
  }
  
  .appointment-type {
    font-size: 0.875rem;
    color: #666;
  }
  
  .appointment-status {
    font-size: 0.75rem;
    padding: 0.25rem 0.75rem;
    border-radius: 20px;
    font-weight: 500;
    text-transform: uppercase;
  }
  
  .status-scheduled {
    background-color: #e3f2fd;
    color: #1976d2;
  }
  
  .status-confirmed {
    background-color: #e8f5e9;
    color: #2e7d32;
  }
  
  .status-completed {
    background-color: #e0f2f1;
    color: #00796b;
  }
  
  .status-cancelled {
    background-color: #ffebee;
    color: #c62828;
  }
  
  .status-no-show {
    background-color: #fce4ec;
    color: #c2185b;
  }
  
  .patients-list {
    display: flex;
    flex-direction: column;
    gap: 0.75rem;
  }
  
  .patient-item {
    display: flex;
    align-items: center;
    padding: 1rem;
    border: 1px solid #eee;
    border-radius: 4px;
    transition: 0.3s;
  }
  
  .patient-item:hover {
    background-color: #f9f9f9;
  }
  
  .patient-initials {
    width: 40px;
    height: 40px;
    border-radius: 50%;
    background-color: #3498db;
    color: white;
    display: flex;
    align-items: center;
    justify-content: center;
    font-weight: 600;
    margin-right: 1rem;
  }
  
  .patient-info {
    flex: 1;
  }
  
  .patient-details {
    font-size: 0.875rem;
    color: #666;
  }
  
  .view-patient-btn {
    padding: 0.25rem 0.75rem;
    background-color: #e3f2fd;
    color: #1976d2;
    border-radius: 4px;
    text-decoration: none;
    font-size: 0.875rem;
    transition: 0.3s;
  }
  
  .view-patient-btn:hover {
    background-color: #bbdefb;
  }
  </style>