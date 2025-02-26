<template>
    <button
      :class="['btn', `btn-${variant}`, { 'btn-block': block }]"
      :disabled="loading || disabled"
      @click="$emit('click', $event)"
    >
      <span v-if="loading" class="loading-spinner"></span>
      <slot v-else></slot>
    </button>
  </template>
  
  <script setup>
  defineProps({
    variant: {
      type: String,
      default: 'primary',
      validator: (val) => ['primary', 'secondary', 'danger', 'success', 'outline'].includes(val)
    },
    loading: {
      type: Boolean,
      default: false
    },
    disabled: {
      type: Boolean,
      default: false
    },
    block: {
      type: Boolean,
      default: false
    }
  })
  
  defineEmits(['click'])
  </script>
  
  <style scoped>
  .btn {
    padding: 0.5rem 1rem;
    border-radius: 4px;
    font-weight: 500;
    cursor: pointer;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    transition: 0.3s;
    border: none;
    min-width: 80px;
  }
  
  .btn:disabled {
    opacity: 0.7;
    cursor: not-allowed;
  }
  
  .btn-block {
    display: flex;
    width: 100%;
  }
  
  .btn-primary {
    background-color: #3498db;
    color: white;
  }
  
  .btn-primary:hover:not(:disabled) {
    background-color: #2980b9;
  }
  
  .btn-secondary {
    background-color: #95a5a6;
    color: white;
  }
  
  .btn-secondary:hover:not(:disabled) {
    background-color: #7f8c8d;
  }
  
  .btn-danger {
    background-color: #e74c3c;
    color: white;
  }
  
  .btn-danger:hover:not(:disabled) {
    background-color: #c0392b;
  }
  
  .btn-success {
    background-color: #2ecc71;
    color: white;
  }
  
  .btn-success:hover:not(:disabled) {
    background-color: #27ae60;
  }
  
  .btn-outline {
    background-color: transparent;
    border: 1px solid #ddd;
    color: #333;
  }
  
  .btn-outline:hover:not(:disabled) {
    background-color: #f5f5f5;
  }
  
  .loading-spinner {
    width: 1rem;
    height: 1rem;
    border: 2px solid rgba(255, 255, 255, 0.3);
    border-radius: 50%;
    border-top-color: #fff;
    animation: spin 1s linear infinite;
  }
  
  @keyframes spin {
    to {
      transform: rotate(360deg);
    }
  }
  </style>