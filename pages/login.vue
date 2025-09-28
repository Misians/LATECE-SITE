<template lang="pug">
  .login-page
    .login-container
      // Header
      header.login-header
        .logo
          span L
        h2.login-title LATECE
        p.login-subtitle Laboratório de Tecnologia Assistiva
        p.login-description Acesso ao painel administrativo
      
      // Login Form
      .login-form
        form(@submit.prevent="handleLogin")
          // Username Field
          .form-group
            label.form-label(for="username") {{ $t('auth.username') }}
            input.form-control(
              id="username",
              v-model="loginForm.username",
              type="text",
              :placeholder="$t('auth.usernamePlaceholder')",
              required,
              :disabled="isLoading",
              :class="{ 'is-invalid': errors.username }"
            )
            .error-message(v-if="errors.username") {{ errors.username }}
          
          // Password Field
          .form-group
            label.form-label(for="password") {{ $t('auth.password') }}
            .password-input
              input.form-control(
                id="password",
                v-model="loginForm.password",
                :type="showPassword ? 'text' : 'password'",
                :placeholder="$t('auth.passwordPlaceholder')",
                required,
                :disabled="isLoading",
                :class="{ 'is-invalid': errors.password }"
              )
              button.password-toggle(
                type="button",
                @click="togglePasswordVisibility",
                :aria-label="showPassword ? 'Ocultar senha' : 'Mostrar senha'"
              )
            .error-message(v-if="errors.password") {{ errors.password }}
          
          // Remember Me & Forgot Password
          .form-group-inline
            label.remember-me
              input.remember-checkbox(
                id="remember",
                v-model="loginForm.remember",
                type="checkbox",
                :disabled="isLoading"
              )
              span.remember-label {{ $t('auth.rememberMe') }}
            a.forgot-link(href="#", @click.prevent="handleForgotPassword") {{ $t('auth.forgotPassword') }}
          
          // Submit Button
          .form-group
            button.submit-btn(type="submit", :disabled="isLoading")
              .loading-spinner(v-if="isLoading")
              span {{ isLoading ? $t('auth.loggingIn') : $t('auth.login') }}
          
          // Error Message
          .form-group(v-if="errorMessage")
            .error-box
              span {{ errorMessage }}
      
      // Footer
      footer.login-footer
        p © {{ new Date().getFullYear() }} LATECE - UFRN
        p Laboratório de Tecnologia Assistiva
  </template>

<script setup lang="ts">
import { useAuthStore } from '@/stores/auth'
// Meta tags
useHead({
  title: 'Login - Portal LATECE',
  meta: [
    { name: 'description', content: 'Acesso ao painel administrativo do Portal LATECE' }
  ]
})

// Stores
const authStore = useAuthStore()
const router = useRouter()

// Reactive data
const loginForm = ref({
  username: '',
  password: '',
  remember: false
})

const showPassword = ref(false)
const isLoading = ref(false)
const errorMessage = ref('')
const errors = ref({
  username: '',
  password: ''
})

// Methods
const togglePasswordVisibility = () => {
  showPassword.value = !showPassword.value
}

const validateForm = () => {
  errors.value = {
    username: '',
    password: ''
  }
  
  let isValid = true
  
  if (!loginForm.value.username.trim()) {
    errors.value.username = 'Nome de usuário é obrigatório'
    isValid = false
  }
  
  if (!loginForm.value.password) {
    errors.value.password = 'Senha é obrigatória'
    isValid = false
  } else if (loginForm.value.password.length < 6) {
    errors.value.password = 'Senha deve ter pelo menos 6 caracteres'
    isValid = false
  }
  
  return isValid
}

const handleLogin = async () => {
  if (!validateForm()) {
    return
  }
  
  isLoading.value = true
  errorMessage.value = ''
  
  try {
    await authStore.login({
      username: loginForm.value.username,
      password: loginForm.value.password
    })
    
    // Redirect to admin panel
    await router.push('/admin')
  } catch (error: any) {
    errorMessage.value = error.message || 'Erro ao fazer login. Tente novamente.'
  } finally {
    isLoading.value = false
  }
}

const handleForgotPassword = () => {
  // TODO: Implement forgot password functionality
  alert('Funcionalidade de recuperação de senha será implementada em breve.')
}

// Redirect if already authenticated
onMounted(() => {
  if (authStore.isAuthenticated) {
    router.push('/admin')
  }
})
</script>

<style scoped lang="scss">
// Variáveis (ajuste conforme seu design system)
$primary-blue: #1D8A9F;
$light-blue: #64B8D1;
$gray-50: #f9fafb;
$gray-400: #9ca3af;
$gray-500: #6b7280;
$gray-600: #4b5563;
$gray-700: #374151;
$gray-900: #111827;
$red-500: #ef4444;
$red-700: #b91c1c;
$shadow-lg: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);
$focus-ring: 0 0 0 2px rgba(29, 138, 159, 0.5);

.login-page {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  background-color: $gray-50;
  padding: 1rem;
}

.login-container {
  width: 100%;
  max-width: 28rem; // Equivalente a max-w-md
}

.login-header {
  text-align: center;
  margin-bottom: 2rem;
}

.logo {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 4rem;
  height: 4rem;
  background: linear-gradient(to bottom right, $primary-blue, $light-blue);
  border-radius: 0.5rem;
  margin: 0 auto 1rem;

  span {
    color: white;
    font-weight: bold;
    font-size: 1.5rem;
  }
}

.login-title {
  font-size: 1.875rem;
  font-weight: 800;
  color: $gray-900;
}

.login-subtitle {
  font-size: 1.125rem;
  color: $gray-600;
}

.login-description {
  margin-top: 0.5rem;
  font-size: 0.875rem;
  color: $gray-500;
}

.login-form {
  background-color: white;
  padding: 2rem 1.5rem;
  border-radius: 0.5rem;
  box-shadow: $shadow-lg;
  
  form {
    display: flex;
    flex-direction: column;
    gap: 1.5rem;
  }
}

.form-group {
  display: flex;
  flex-direction: column;
}

.form-label {
  display: block;
  font-size: 0.875rem;
  font-weight: 500;
  color: $gray-700;
  margin-bottom: 0.5rem;
}

.form-control {
  width: 100%;
  padding: 0.75rem 1rem;
  border: 1px solid #d1d5db;
  border-radius: 0.375rem;
  transition: box-shadow 0.2s, border-color 0.2s;
  font-size: 1rem;

  &:focus {
    outline: none;
    border-color: $primary-blue;
    box-shadow: $focus-ring;
  }

  &.is-invalid {
    border-color: $red-500;
  }
}

.password-input {
  position: relative;
}

.password-toggle {
  position: absolute;
  right: 0.75rem;
  top: 50%;
  transform: translateY(-50%);
  background: none;
  border: none;
  cursor: pointer;
  color: $gray-400;

  &:hover {
    color: $gray-600;
  }

  :deep(svg) {
    width: 1.25rem;
    height: 1.25rem;
  }
}

.form-group-inline {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.remember-me {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.remember-label {
  font-size: 0.875rem;
  color: $gray-700;
}

.forgot-link {
  font-size: 0.875rem;
  color: $primary-blue;
  text-decoration: none;

  &:hover {
    text-decoration: underline;
    color: $light-blue;
  }
}

.submit-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  padding: 0.75rem 1rem;
  border: none;
  border-radius: 0.375rem;
  background-color: $primary-blue;
  color: white;
  font-size: 0.875rem;
  font-weight: 500;
  cursor: pointer;
  transition: background-color 0.2s;
  gap: 0.5rem;

  &:hover:not(:disabled) {
    background-color: $light-blue;
  }
  
  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }

  :deep(svg) {
    width: 1rem;
    height: 1rem;
  }
}

.loading-spinner {
  width: 1rem;
  height: 1rem;
  border: 2px solid white;
  border-top-color: transparent;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

.error-message {
  color: $red-500;
  font-size: 0.875rem;
  margin-top: 0.25rem;
}

.error-box {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 1rem;
  border: 1px solid #fca5a5;
  border-radius: 0.375rem;
  background-color: #fef2f2;
  color: $red-700;
  font-size: 0.875rem;
  
  :deep(svg) {
    width: 1.25rem;
    height: 1.25rem;
    color: #f87171;
  }
}

.login-footer {
  text-align: center;
  margin-top: 2rem;
  
  p:first-child {
    font-size: 0.875rem;
    color: $gray-500;
  }

  p:last-child {
    font-size: 0.75rem;
    color: $gray-400;
    margin-top: 0.25rem;
  }
}

@keyframes spin {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}
</style>