<template>
  <div class="patients-page">
    <div class="page-header">
      <h1 class="page-title">Patients</h1>
      <Button @click="showAddPatientModal = true">
        <i class="fas fa-plus"></i> Add Patient
      </Button>
    </div>
    
    <div class="filters-section">
      <div class="search-box">
        <input 
          type="text" 
          v-model="searchQuery" 
          placeholder="Search patients..."
          @input="handleSearch"
        />
        <i class="fas fa-search search-icon"></i>
      </div>
      
      <div class="filters">
        <select v-model="sortBy" @change="loadPatients">
          <option value="last_name">Name</option>
          <option value="created_at">Date Added</option>
          <option value="appointment_count">Appointment Count</option>
        </select>
      </div>
    </div>
    
    <div v-if="loading" class="loading-indicator">
      Loading patients...
    </div>
    
    <div v-else-if="filteredPatients.length === 0" class="empty-state">
      <i class="fas fa-users empty-icon"></i>
      <h3>No patients found</h3>
      <p v-if="searchQuery">Try adjusting your search query</p>
      <Button v-else @click="showAddPatientModal = true" variant="primary">
        Add Your First Patient
      </Button>
    </div>
    
    <div v-else class="patients-table-container">
      <table class="patients-table">
        <thead>
          <tr>
            <th>Name</th>
            <th>Email</th>
            <th>Phone</th>
            <th>Last Visit</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="patient in filteredPatients" :key="patient.id">
            <td class="patient-name-cell">
              <div class="patient-initials">
                {{ getInitials(