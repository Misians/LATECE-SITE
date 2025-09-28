<template>
  <div class="login-page">
    <div class="login-container">
      <header class="login-header">
        <div class="logo"><span>L</span></div>
        <h2 class="login-title">LATECE</h2>
        <p class="login-subtitle">Laboratório de Tecnologia Assistiva</p>
        <p class="login-description">Acesso ao painel administrativo</p>
      </header>

      <div class="login-form">
        <form @submit.prevent="handleLogin">
          <div class="form-group">
            <label class="form-label" for="username">{{ $t('auth.username') }}</label>
            <input class="form-control" id="username" v-model="loginForm.username" type="text" :placeholder="$t('auth.usernamePlaceholder')" required :disabled="isLoading" :class="{ 'is-invalid': errors.username }" />
            <div class="error-message" v-if="errors.username">{{ errors.username }}</div>
          </div>

          <div class="form-group">
            <label class="form-label" for="password">{{ $t('auth.password') }}</label>
            <div class="password-input">
              <input class="form-control" id="password" v-model="loginForm.password" :type="showPassword ? 'text' : 'password'" :placeholder="$t('auth.passwordPlaceholder')" required :disabled="isLoading" :class="{ 'is-invalid': errors.password }" />
              <button class="password-toggle" type="button" @click="togglePasswordVisibility" :aria-label="showPassword ? 'Ocultar senha' : 'Mostrar senha'">
                 <Icon :name="showPassword ? 'mdi:eye-off' : 'mdi:eye'" />
              </button>
            </div>
            <div class="error-message" v-if="errors.password">{{ errors.password }}</div>
          </div>

          <div class="form-group">
            <button class="submit-btn" type="submit" :disabled="isLoading">
              <div class="loading-spinner" v-if="isLoading"></div>
              <span>{{ isLoading ? $t('auth.loggingIn') : $t('auth.login') }}</span>
            </button>
          </div>

          <div class="form-group" v-if="errorMessage">
            <div class="error-box">
              <span>{{ errorMessage }}</span>
            </div>
          </div>
        </form>
      </div>

      <footer class="login-footer">
        <p>© {{ new Date().getFullYear() }} LATECE - UFRN</p>
        <p>Laboratório de Tecnologia Assistiva</p>
      </footer>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useAuthStore } from '@/stores/auth'

useHead({
  title: 'Login - Portal LATECE',
  meta: [{ name: 'description', content: 'Acesso ao painel administrativo do Portal LATECE' }]
})

const authStore = useAuthStore()
const router = useRouter()

const loginForm = ref({ username: '', password: '' })
const showPassword = ref(false)
const isLoading = ref(false)
const errorMessage = ref('')
const errors = ref({ username: '', password: '' })

const togglePasswordVisibility = () => {
  showPassword.value = !showPassword.value
}

const handleLogin = async () => {
  // Validação simples (pode ser melhorada)
  if (!loginForm.value.username || !loginForm.value.password) {
    errorMessage.value = 'Por favor, preencha todos os campos.'
    return
  }

  isLoading.value = true
  errorMessage.value = ''
  
  // CORRIGIDO: Trata a resposta da action da store
  const result = await authStore.login({
    username: loginForm.value.username,
    password: loginForm.value.password
  })
  
  if (result.success) {
    await router.push('/admin')
  } else {
    errorMessage.value = result.error || 'Ocorreu um erro inesperado.'
  }
  
  isLoading.value = false
}

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