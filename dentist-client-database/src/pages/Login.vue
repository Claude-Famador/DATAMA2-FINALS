<template>
    <div class="auth-container">
      <div class="auth-form-container">
        <div class="auth-logo">
          <img src="/logo.svg" alt="Dental Clinic Logo" />
          <h1>Dental Clinic</h1>
        </div>
        <form @submit.prevent="handleLogin" class="auth-form">
          <h2>Login to Your Account</h2>
          
          <div v-if="error" class="error-message">{{ error }}</div>
          
          <div class="form-group">
            <label for="email">Email</label>
            <input 
              id="email"
              type="email" 
              v-model="email" 
              required
              placeholder="Enter your email"
            />
          </div>
          
          <div class="form-group">
            <label for="password">Password</label>
            <input 
              id="password"
              type="password" 
              v-model="password" 
              required
              placeholder="Enter your password"
            />
          </div>
          
          <Button type="submit" variant="primary" :loading="loading" block>
            Login
          </Button>
          
          <div class="auth-links">
            <router-link :to="{ name: 'Register' }">
              Don't have an account? Register
            </router-link>
          </div>
        </form>
      </div>
    </div>
  </template>
  
  <script setup>
  import { ref } from 'vue'
  import { useRouter } from 'vue-router'
  import { useAuthStore } from '../stores/auth'
  import Button from '../components/ui/Button.vue'
  
  const router = useRouter()
  const authStore = useAuthStore()
  
  const email = ref('')
  const password = ref('')
  const error = ref('')
  const loading = ref(false)
  
  async function handleLogin() {
    error.value = ''
    loading.value = true
    
    try {
      await authStore.login(email.value, password.value)
      router.push({ name: 'Dashboard' })
    } catch (err) {
      error.value = err.message || 'Failed to login'
    } finally {
      loading.value = false
    }
  }
  </script>
  
  <style scoped>
  .auth-container {
    min-height: 100vh;
    display: flex;
    align-items: center;
    justify-content: center;
    background-color: #f5f5f5;
    padding: 1rem;
  }
  
  .auth-form-container {
    width: 100%;
    max-width: 400px;
    background-color: white;
    border-radius: 8px;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
    overflow: hidden;
  }
  
  .auth-logo {
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 2rem 1rem;
    background-color: #2c3e50;
    color: white;
  }
  
  .auth-logo img {
    height: 60px;
    margin-bottom: 1rem;
  }
  
  .auth-logo h1 {
    margin: 0;
    font-size: 1.5rem;
  }
  
  .auth-form {
    padding: 2rem;
  }
  
  .auth-form h2 {
    text-align: center;
    margin-top: 0;
    margin-bottom: 1.5rem;
    color: #333;
  }
  
  .form-group {
    margin-bottom: 1.25rem;
  }
  
  .form-group label {
    display: block;
    margin-bottom: 0.5rem;
    font-weight: 500;
    color: #555;
  }
  
  .form-group input {
    width: 100%;
    padding: 0.75rem;
    border: 1px solid #ddd;
    border-radius: 4px;
    transition: border-color 0.3s;
  }
  
  .form-group input:focus {
    border-color: #3498db;
    outline: none;
  }
  
  .error-message {
    background-color: #f8d7da;
    color: #721c24;
    padding: 0.75rem;
    border-radius: 4px;
    margin-bottom: 1rem;
  }
  
  .auth-links {
    margin-top: 1.5rem;
    text-align: center;
  }
  
  .auth-links a {
    color: #3498db;
    text-decoration: none;
  }
  
  .auth-links a:hover {
    text-decoration: underline;
  }
  </style>