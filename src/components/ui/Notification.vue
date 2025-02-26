<template>
    <Teleport to="body">
      <transition name="notification">
        <div v-if="show" :class="['notification', `notification-${type}`]">
          <div class="notification-icon">
            <i :class="iconClass"></i>
          </div>
          <div class="notification-content">
            <div v-if="title" class="notification-title">{{ title }}</div>
            <div class="notification-message">{{ message }}</div>
          </div>
          <button v-if="dismissible" class="notification-close" @click="close">&times;</button>
        </div>
      </transition>
    </Teleport>
  </template>
  
  <script setup>
  import { ref, onMounted, computed } from 'vue'
  
  const props = defineProps({
    title: {
      type: String,
      default: ''
    },
    message: {
      type: String,
      required: true
    },
    type: {
      type: String,
      default: 'info',
      validator: (val) => ['success', 'error', 'warning', 'info'].includes(val)
    },
    duration: {
      type: Number,
      default: 5000
    },
    dismissible: {
      type: Boolean,
      default: true
    },
    onClose: {
      type: Function,
      default: () => {}
    }
  })
  
  const show = ref(true)
  let timer = null
  
  const iconClass = computed(() => {
    const icons = {
      success: 'fas fa-check-circle',
      error: 'fas fa-exclamation-circle',
      warning: 'fas fa-exclamation-triangle',
      info: 'fas fa-info-circle'
    }
    return icons[props.type]
  })
  
  function close() {
    show.value = false
    props.onClose()
  }
  
  onMounted(() => {
    if (props.duration > 0) {
      timer = setTimeout(() => {
        close()
      }, props.duration)
    }
  })
  </script>
  
  <style scoped>
  .notification {
    position: fixed;
    top: 1rem;
    right: 1rem;
    z-index: 1000;
    max-width: 350px;
    padding: 1rem;
    border-radius: 4px;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
    display: flex;
    align-items: flex-start;
    gap: 0.75rem;
  }
  
  .notification-success {
    background-color: #d4edda;
    border-left: 4px solid #28a745;
    color: #155724;
  }
  
  .notification-error {
    background-color: #f8d7da;
    border-left: 4px solid #dc3545;
    color: #721c24;
  }
  
  .notification-warning {
    background-color: #fff3cd;
    border-left: 4px solid #ffc107;
    color: #856404;
  }
  
  .notification-info {
    background-color: #d1ecf1;
    border-left: 4px solid #17a2b8;
    color: #0c5460;
  }
  
  .notification-icon {
    font-size: 1.25rem;
    margin-top: 0.125rem;
  }
  
  .notification-content {
    flex: 1;
  }
  
  .notification-title {
    font-weight: bold;
    margin-bottom: 0.25rem;
  }
  
  .notification-close {
    background: none;
    border: none;
    font-size: 1.25rem;
    cursor: pointer;
    opacity: 0.7;
    margin-left: 0.5rem;
    padding: 0;
  }
  
  .notification-close:hover {
    opacity: 1;
  }
  
  .notification-enter-active,
  .notification-leave-active {
    transition: all 0.3s ease;
  }
  
  .notification-enter-from,
  .notification-leave-to {
    opacity: 0;
    transform: translateX(20px);
  }
  </style>