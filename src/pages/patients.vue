<template>
    <div>
      <div class="flex justify-between items-center mb-6">
        <h1 class="text-2xl font-bold text-gray-800">Patients</h1>
        <router-link 
          to="/patients/new" 
          class="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm font-medium flex items-center"
        >
          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
          </svg>
          Add Patient
        </router-link>
      </div>
      
      <div class="bg-white shadow rounded-lg overflow-hidden">
        <div class="flex flex-col sm:flex-row justify-between items-center p-4 border-b">
          <div class="w-full sm:w-auto mb-4 sm:mb-0">
            <div class="relative w-full sm:w-64">
              <input
                v-model="searchQuery"
                type="text"
                placeholder="Search patients..."
                class="w-full border rounded-md px-3 py-2 pr-10 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                @input="handleSearch"
              />
              <button
                v-if="searchQuery"
                class="absolute right-2 top-2 text-gray-400 hover:text-gray-600"
                @click="clearSearch"
              >
                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          </div>
          
          <div class="flex space-x-2">
            <button
              class="px-3 py-2 border rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
              @click="exportPatients"
            >
              Export
            </button>
            <select
              v-model="sortBy"
              class="border rounded-md px-2 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="last_name">Sort by Last Name</option>
              <option value="first_name">Sort by First Name</option>
              <option value="created_at">Sort by Date Added</option>
            </select>
          </div>
        </div>
        
        <div v-if="isLoading" class="p-8 text-center">
          <svg class="animate-spin h-8 w-8 text-blue-600 mx-auto" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          <p class="mt-2 text-gray-600">Loading patients...</p>
        </div>
        
        <div v-else-if="filteredPatients.length === 0" class="p-8 text-center">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-12 w-12 text-gray-400 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <p class="mt-2 text-gray-600">No patients found</p>
          <p v-if="searchQuery" class="text-sm text-gray-500">Try adjusting your search</p>
          <router-link
            v-else
            to="/patients/new"
            class="mt-4 inline-block bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm font-medium"
          >
            Add Your First Patient
          </router-link>
        </div>
        
        <div v-else>
          <table class="min-w-full divide-y divide-gray-200">
            <thead class="bg-gray-50">
              <tr>
                <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Patient
                </th>
                <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Contact
                </th>
                <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Date of Birth
                </th>
                <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Last Visit
                </th>
                <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Next Appointment
                </th>
                <th scope="col" class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody class="bg-white divide-y divide-gray-200">
              <tr v-for="patient in paginatedPatients" :key="patient.id" class="hover:bg-gray-50">
                <td class="px-6 py-4 whitespace-nowrap">
                  <div class="flex items-center">
                    <div class="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-800 font-medium">
                      {{ getInitials(patient.first_name, patient.last_name) }}
                    </div>
                    <div class="ml-4">
                      <div class="text-sm font-medium text-gray-900">
                        {{ patient.first_name }} {{ patient.last_name }}
                      </div>
                      <div class="text-xs text-gray-500">
                        ID: {{ formatPatientId(patient.id) }}
                      </div>
                    </div>
                  </div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <div class="text-sm text-gray-900">{{ patient.phone || 'N/A' }}</div>
                  <div class="text-xs text-gray-500">{{ patient.email || 'No email provided' }}</div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {{ formatDate(patient.date_of_birth) || 'N/A' }}
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {{ getLastVisitDate(patient) || 'No visits yet' }}
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <div v-if="getNextAppointment(patient)" class="text-sm">
                    <div class="font-medium text-gray-900">
                      {{ formatDateTime(getNextAppointment(patient).appointment_date) }}
                    </div>
                    <div class="text-xs text-gray-500">
                      {{ getNextAppointment(patient).treatment_type || 'General checkup' }}
                    </div>
                  </div>
                  <div v-else class="text-sm text-gray-500">None scheduled</div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <div class="flex justify-end space-x-2">
                    <router-link
                      :to="`/patients/${patient.id}`"
                      class="text-blue-600 hover:text-blue-900"
                    >
                      View
                    </router-link>
                    <button
                      @click="openDeleteConfirmation(patient)"
                      class="text-red-600 hover:text-red-900"
                    >
                      Delete
                    </button>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
          
          <!-- Pagination -->
          <div class="flex items-center justify-between px-4 py-3 border-t border-gray-200 sm:px-6">
            <div class="flex-1 flex justify-between sm:hidden">
              <button
                :disabled="currentPage === 1"
                @click="currentPage--"
                class="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
                :class="{ 'opacity-50 cursor-not-allowed': currentPage === 1 }"
              >
                Previous
              </button>
              <button
                :disabled="currentPage >= totalPages"
                @click="currentPage++"
                class="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
                :class="{ 'opacity-50 cursor-not-allowed': currentPage >= totalPages }"
              >
                Next
              </button>
            </div>
            <div class="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
              <div>
                <p class="text-sm text-gray-700">
                  Showing
                  <span class="font-medium">{{ (currentPage - 1) * itemsPerPage + 1 }}</span>
                  to
                  <span class="font-medium">{{ Math.min(currentPage * itemsPerPage, filteredPatients.length) }}</span>
                  of
                  <span class="font-medium">{{ filteredPatients.length }}</span>
                  results
                </p>
              </div>
              <div>
                <nav class="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
                  <button
                    :disabled="currentPage === 1"
                    @click="currentPage = 1"
                    class="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50"
                    :class="{ 'opacity-50 cursor-not-allowed': currentPage === 1 }"
                  >
                    <span class="sr-only">First</span>
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                      <path fill-rule="evenodd" d="M15.707 15.707a1 1 0 01-1.414 0l-5-5a1 1 0 010-1.414l5-5a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 010 1.414z" clip-rule="evenodd" />
                      <path fill-rule="evenodd" d="M7.707 15.707a1 1 0 01-1.414 0l-5-5a1 1 0 010-1.414l5-5a1 1 0 111.414 1.414L3.414 10l4.293 4.293a1 1 0 010 1.414z" clip-rule="evenodd" />
                    </svg>
                  </button>
                  <button
                    :disabled="currentPage === 1"
                    @click="currentPage--"
                    class="relative inline-flex items-center px-2 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50"
                    :class="{ 'opacity-50 cursor-not-allowed': currentPage === 1 }"
                  >
                    <span class="sr-only">Previous</span>
                    <svg class="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                      <path fill-rule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clip-rule="evenodd" />
                    </svg>
                  </button>
                  
                  <!-- Page numbers -->
                  <template v-for="page in displayedPages" :key="page">
                    <button
                      v-if="page !== '...'"
                      @click="currentPage = page"
                      class="relative inline-flex items-center px-4 py-2 border text-sm font-medium"
                      :class="currentPage === page ? 'z-10 bg-blue-50 border-blue-500 text-blue-600' : 'bg-white border-gray-300 text-gray-500 hover:bg-gray-50'"
                    >
                      {{ page }}
                    </button>
                    <span
                      v-else
                      class="relative inline-flex items-center px-4 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-700"
                    >
                      ...
                    </span>
                  </template>