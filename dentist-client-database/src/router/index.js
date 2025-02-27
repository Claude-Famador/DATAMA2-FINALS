import { createRouter, createWebHistory } from 'vue-router'
import { supabase } from '../supabase'

// Pages
import Dashboard from '../pages/Dashboard.vue'
import Patients from '../pages/Patients.vue'
import PatientDetails from '../pages/PatientDetails.vue'
import Appointments from '../pages/Appointments.vue'
import AppointmentForm from '../pages/AppointmentForm.vue'
import Settings from '../pages/Settings.vue'

const routes = [
  {
    path: '/',
    name: 'Dashboard',
    component: Dashboard,
    meta: { requiresAuth: true }
  },
  {
    path: '/patients',
    name: 'Patients',
    component: Patients,
    meta: { requiresAuth: true }
  },
  {
    path: '/patients/:id',
    name: 'PatientDetails',
    component: PatientDetails,
    meta: { requiresAuth: true }
  },
  {
    path: '/appointments',
    name: 'Appointments',
    component: Appointments,
    meta: { requiresAuth: true }
  },
  {
    path: '/appointments/new',
    name: 'NewAppointment',
    component: AppointmentForm,
    meta: { requiresAuth: true }
  },
  {
    path: '/appointments/:id/edit',
    name: 'EditAppointment',
    component: AppointmentForm,
    meta: { requiresAuth: true }
  },
  {
    path: '/settings',
    name: 'Settings',
    component: Settings,
    meta: { requiresAuth: true }
  },
  {
    path: '/login',
    name: 'Login',
    component: () => import('../pages/Login.vue')
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

// Navigation guard to check authentication
router.beforeEach(async (to, from, next) => {
  const { data: { session } } = await supabase.auth.getSession()
  const requiresAuth = to.matched.some(record => record.meta.requiresAuth)

  if (requiresAuth && !session) {
    next({ name: 'Login', query: { redirect: to.fullPath } })
  } else {
    next()
  }
})

export default router