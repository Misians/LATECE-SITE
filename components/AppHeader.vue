<template>
  <div class="header">
    <div class="top-bar">
      <div class="container top-bar-content">
        <div class="social-links">
          <a href="#" target="_blank" class="social-link" aria-label="Instagram">
          </a>
          <a href="#" target="_blank" class="social-link" aria-label="Facebook">
          </a>
          <a href="#" target="_blank" class="social-link" aria-label="LinkedIn">
          </a>
        </div>

        <div class="user-links">
          <template v-if="authStore.isAuthenticated">
            <NuxtLink to="/admin" class="user-link">
              <span>Administração</span>
            </NuxtLink>
          </template>
          <template v-else>
            <NuxtLink to="/login" class="user-link">
              <span>Login</span>
            </NuxtLink>
          </template>
          <LanguageSelector />
        </div>
      </div>
    </div>

    <div class="container">
      <div class="header-content">
        <NuxtLink class="logo" to="/">
          <div class="logo-icon">
            <img src="../assets/logo.png" alt="logo latece" width="170">
          </div>
          <div class="logo-text">
            <div class="logo-title">LATECE</div>
            <div class="logo-subtitle">Laboratório de Tecnologia Assistiva</div>
          </div>
        </NuxtLink>

        <nav class="desktop-nav">
          <NuxtLink class="nav-link" to="/">{{ $t('nav.home') }}</NuxtLink>
          <NuxtLink class="nav-link" to="/about">{{ $t('nav.about') }}</NuxtLink>
          <NuxtLink class="nav-link" to="/team">{{ $t('nav.team') }}</NuxtLink>
          <NuxtLink class="nav-link" to="/equipment">{{ $t('nav.equipment') }}</NuxtLink>
          <NuxtLink class="nav-link" to="/publications">{{ $t('nav.publications') }}</NuxtLink>
          <NuxtLink class="nav-link" to="/news">{{ $t('nav.news') }}</NuxtLink>
        </nav>

        <div class="user-section">
          <div class="language-selector">
            <!-- <ClientOnly>
              <LanguageSelector />
            </ClientOnly> -->
          </div>

          <template v-if="authStore.isAuthenticated">
            <div class="user-menu-container">
              <button class="user-menu-button" @click="showUserMenu = !showUserMenu" :aria-expanded="showUserMenu" aria-haspopup="true">
                <div class="user-avatar">
                  <span>{{ authStore.userInitials }}</span>
                </div>
                <div class="user-name">{{ authStore.user?.fullName }}</div>
              </button>
              <div class="dropdown-menu" v-show="showUserMenu" @click.away="showUserMenu = false">
                <div class="dropdown-content">
                  <NuxtLink class="dropdown-item" to="/admin">{{ $t('nav.admin') }}</NuxtLink>
                  <button class="dropdown-item" @click="handleLogout">{{ $t('nav.logout') }}</button>
                </div>
              </div>
            </div>
          </template>
        </div>

        <button class="mobile-menu-button" @click="showMobileMenu = !showMobileMenu" :aria-expanded="showMobileMenu" aria-label="Menu">
        </button>
      </div>
    </div>

    <div class="mobile-menu" v-show="showMobileMenu">
      <div class="container">
        <nav class="mobile-nav">
          <NuxtLink class="mobile-nav-link" to="/">{{ $t('nav.home') }}</NuxtLink>
          <NuxtLink class="mobile-nav-link" to="/about">{{ $t('nav.about') }}</NuxtLink>
          <NuxtLink class="mobile-nav-link" to="/team">{{ $t('nav.team') }}</NuxtLink>
          <NuxtLink class="mobile-nav-link" to="/equipment">{{ $t('nav.equipment') }}</NuxtLink>
          <NuxtLink class="mobile-nav-link" to="/publications">{{ $t('nav.publications') }}</NuxtLink>
          <NuxtLink class="mobile-nav-link" to="/news">{{ $t('nav.news') }}</NuxtLink>
          <div class="mobile-nav-divider"></div>
          <template v-if="authStore.isAuthenticated">
            <NuxtLink class="mobile-nav-link" to="/admin">{{ $t('nav.admin') }}</NuxtLink>
            <button class="mobile-nav-link" @click="handleLogout">{{ $t('nav.logout') }}</button>
          </template>
          <template v-else>
            <NuxtLink class="mobile-nav-link" to="/login">{{ $t('nav.login') }}</NuxtLink>
          </template>
        </nav>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useAuthStore } from '@/stores/auth'

const authStore = useAuthStore()
const showUserMenu = ref(false)
const showMobileMenu = ref(false)

const handleLogout = async () => {
  await authStore.logout()
  showUserMenu.value = false
  showMobileMenu.value = false
}

// Close mobile menu when route changes
watch(() => useRoute().path, () => {
  showMobileMenu.value = false
})
</script>

<style scoped lang="scss">
// Assumindo que estas variáveis estão definidas globalmente ou em um arquivo importado
$primary-blue: #005A9C;
$primary-gradient: linear-gradient(to bottom right, $primary-blue, #4D9DE0);
$transition-fast: all 0.2s ease-in-out;

/* =================================
   NOVA FAIXA SUPERIOR (TOP BAR)
   ================================= */
.top-bar {
  background-color: #186775;
  color: rgb(25, 70, 104);
  padding: 0.5rem 0;
  display: none; // Escondido em telas pequenas por padrão

  @media (min-width: 768px) { // Aparece em telas a partir de 768px
    display: block;
  }
}

.top-bar-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.social-links, .user-links {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.social-link, .user-link {
  color: rgba(255, 255, 255, 0.8);
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.875rem;
  transition: color $transition-fast;

  &:hover {
    color: white;
  }

  :deep(.icon) {
    font-size: 1.25rem;
  }
}

/* =================================
   ESTILOS DO HEADER EXISTENTE
   ================================= */
.header {
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
  position: sticky;
  background-color: #e9e9e9;
  top: 0;
  z-index: 100;
}

.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 1rem;
}
/*    aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa */
.header-content {
  display: flex;
  width: 100%;
  justify-content: space-between;
  align-items: center;
  height: 4.5rem; // Aumentei um pouco para melhor espaçamento
}

// Logo
.logo {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  transition: transform $transition-fast;
  
  &:hover {
    transform: scale(1.02);
  }
  
  .logo-icon {
    display: flex;
    align-items: center;
    justify-content: center;
  }
  
  .logo-text {
    display: none;
    
    @media (min-width: 640px) {
      display: block;
    }
    
    .logo-title {
      font-size: 1.25rem;
      font-weight: 900;
      color: $primary-blue;
    }
    
    .logo-subtitle {
      font-size: 0.875rem;
      color: #6b7280;
    }
  }
}

// Navegação Desktop
.desktop-nav {
  display: none;
  align-items: center;
  gap: 2rem;
  
  @media (min-width: 1024px) { // Aparece em telas maiores
    display: flex;
  }
  
  .nav-link {
    color: #374151;
    font-weight: 500;
    transition: color 0.2s;
    position: relative;
    padding-bottom: 0.25rem;
    
    &::after {
      content: '';
      position: absolute;
      bottom: 0;
      left: 0;
      width: 0;
      height: 2px;
      background-color: $primary-blue;
      transition: width 0.3s;
    }

    &:hover::after, &.router-link-active::after {
      width: 100%;
    }
    
    &.router-link-active {
      color: $primary-blue;
      font-weight: 600;
    }
  }
}

// Seção do Usuário
.user-section {
  display: flex;
  align-items: center;
  gap: 1rem;
  
  .language-selector {
    display: none;
    
    @media (min-width: 640px) {
      display: block;
    }
  }
  
  .user-menu-container {
    position: relative;
  }
  
  .user-menu-button {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    padding: 0.5rem 0.75rem;
    border-radius: 0.5rem;
    background: none;
    border: none;
    cursor: pointer;
    transition: background-color 0.2s;
    
    &:hover {
      background-color: #f3f4f6;
    }
    
    .user-avatar {
      width: 2rem;
      height: 2rem;
      background: $primary-blue;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      
      span {
        color: white;
        font-size: 0.875rem;
        font-weight: 600;
      }
    }
    
    .user-name {
      display: none;
      font-size: 0.875rem;
      font-weight: 500;
      
      @media (min-width: 640px) {
        display: block;
      }
    }
  }
  
  .dropdown-menu {
    position: absolute;
    right: 0;
    top: 100%;
    margin-top: 0.5rem;
    width: 12rem;
    background: white;
    border-radius: 0.5rem;
    box-shadow: 0 10px 15px rgba(0, 0, 0, 0.1);
    border: 1px solid #e5e7eb;
    z-index: 50;
    
    .dropdown-content {
      padding: 0.25rem 0;
    }
    
    .dropdown-item {
      display: block;
      width: 100%;
      text-align: left;
      padding: 0.5rem 1rem;
      font-size: 0.875rem;
      color: #374151;
      background: none;
      border: none;
      cursor: pointer;
      transition: background-color 0.2s;
      
      &:hover {
        background-color: #f3f4f6;
      }
    }
  }
}

// Botão do Menu Móvel
.mobile-menu-button {
  display: block;
  padding: 0.5rem;
  border-radius: 0.5rem;
  background: none;
  border: none;
  cursor: pointer;
  
  @media (min-width: 1024px) { // Desaparece quando o menu desktop aparece
    display: none;
  }
  
  :deep(.icon) {
    font-size: 1.5rem;
    color: #374151;
  }
}

// Menu Móvel
.mobile-menu {
  display: block;
  background: white;
  border-top: 1px solid #e5e7eb;
  position: absolute;
  width: 100%;
  
  @media (min-width: 1024px) { // Desaparece quando o menu desktop aparece
    display: none;
  }
  
  .container {
    padding: 1rem;
  }
  
  .mobile-nav {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
  }
  
  .mobile-nav-link {
    display: block;
    width: 100%;
    text-align: left;
    padding: 0.75rem 1rem;
    color: #374151;
    text-decoration: none;
    border-radius: 0.5rem;
    transition: all 0.2s;
    background-color: transparent;
    border: none;
    font-size: 1rem;
    
    &:hover {
      color: $primary-blue;
      background-color: #f3f4f6;
    }
    
    &.router-link-active {
      color: $primary-blue;
      background-color: #f3f4f6;
      font-weight: 600;
    }
  }
  
  .mobile-nav-divider {
    border-top: 1px solid #e5e7eb;
    padding-top: 0.5rem;
    margin-top: 0.5rem;
  }
}
</style>