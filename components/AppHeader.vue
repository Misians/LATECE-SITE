<template>
  <div class="header-wrapper">
    <!-- Top Bar -->
    <div class="top-bar">
      <div class="container top-bar-content">
        <div class="contact-info">
          <a href="mailto:latece@ufrn.br" class="info-link">
            <span class="icon">📧</span>
            <span>latece@ufrn.br</span>
          </a>
          <a href="tel:+558412345678" class="info-link">
            <span class="icon">📞</span>
            <span>(84) 1234-5678</span>
          </a>
        </div>

        <div class="top-bar-right">
          <!-- <div class="social-links">
            <a href="#" target="_blank" class="social-link" aria-label="Instagram">
              <span class="icon">📷</span>
            </a>
            <a href="#" target="_blank" class="social-link" aria-label="Facebook">
              <span class="icon">👥</span>
            </a>
            <a href="#" target="_blank" class="social-link" aria-label="LinkedIn">
              <span class="icon">💼</span>
            </a>
          </div> -->

          <div class="divider"></div>

          <div class="user-links">
            <template v-if="authStore.isAuthenticated">
              <NuxtLink to="/admin" class="user-link">
                <span class="icon"></span>
                <span>Administração</span>
              </NuxtLink>
            </template>
            <template v-else>
              <NuxtLink to="/login" class="user-link">
                <span class="icon"></span>
                <span>Login</span>
              </NuxtLink>
            </template>
            <LanguageSelector />
          </div>
        </div>
      </div>
    </div>

    <!-- Main Header -->
    <header class="main-header" :class="{ 'scrolled': isScrolled }">
      <div class="container">
        <div class="header-content">
          <!-- Logo -->
          <NuxtLink class="logo" to="/">
            <div class="logo-icon">
              <img src="../assets/logo.png" alt="logo latece" width="170">
            </div>
            <div class="logo-text">
              <div class="logo-title">LATECE</div>
              <div class="logo-subtitle">Laboratório de Tecnologia Assistiva</div>
            </div>
          </NuxtLink>

          <!-- Desktop Navigation -->
          <nav class="desktop-nav">
            <NuxtLink class="nav-link" to="/">
              <span class="nav-icon"></span>
              <span>{{ $t('nav.home') }}</span>
            </NuxtLink>
            <NuxtLink class="nav-link" to="/about">
              <span class="nav-icon"></span>
              <span>{{ $t('nav.about') }}</span>
            </NuxtLink>
            <NuxtLink class="nav-link" to="/team">
              <span class="nav-icon"></span>
              <span>{{ $t('nav.team') }}</span>
            </NuxtLink>
            <NuxtLink class="nav-link" to="/equipment">
              <span class="nav-icon"></span>
              <span>{{ $t('nav.equipment') }}</span>
            </NuxtLink>
            <NuxtLink class="nav-link" to="/publications">
              <span class="nav-icon"></span>
              <span>{{ $t('nav.publications') }}</span>
            </NuxtLink>
            <NuxtLink class="nav-link" to="/news">
              <span class="nav-icon"></span>
              <span>{{ $t('nav.news') }}</span>
            </NuxtLink>
          </nav>

          <!-- User Section (Desktop) -->
          <div class="user-section">
            <template v-if="authStore.isAuthenticated">
              <div class="user-menu-container">
                <button 
                  class="user-menu-button" 
                  @click="showUserMenu = !showUserMenu" 
                  :aria-expanded="showUserMenu" 
                  aria-haspopup="true"
                >
                  <div class="user-avatar">
                    <span>{{ authStore.userInitials }}</span>
                  </div>
                  <div class="user-info">
                    <div class="user-name">{{ authStore.user?.fullName }}</div>
                    <div class="user-role">Administrador</div>
                  </div>
                  <span class="dropdown-arrow" :class="{ 'open': showUserMenu }">▼</span>
                </button>
                
                <Transition name="dropdown">
                  <div class="dropdown-menu" v-show="showUserMenu" @click.away="showUserMenu = false">
                    <div class="dropdown-header">
                      <div class="dropdown-user-avatar">
                        <span>{{ authStore.userInitials }}</span>
                      </div>
                      <div class="dropdown-user-info">
                        <div class="dropdown-user-name">{{ authStore.user?.fullName }}</div>
                        <div class="dropdown-user-email">{{ authStore.user?.email }}</div>
                      </div>
                    </div>
                    <div class="dropdown-divider"></div>
                    <div class="dropdown-content">
                      <NuxtLink class="dropdown-item" to="/admin">
                        <span class="item-icon">⚙️</span>
                        <span>{{ $t('nav.admin') }}</span>
                      </NuxtLink>
                      <NuxtLink class="dropdown-item" to="/profile">
                        <span class="item-icon">👤</span>
                        <span>Meu Perfil</span>
                      </NuxtLink>
                      <button class="dropdown-item logout" @click="handleLogout">
                        <span class="item-icon">🚪</span>
                        <span>{{ $t('nav.logout') }}</span>
                      </button>
                    </div>
                  </div>
                </Transition>
              </div>
            </template>
          </div>

          <!-- Mobile Menu Button -->
          <button 
            class="mobile-menu-button" 
            @click="showMobileMenu = !showMobileMenu" 
            :class="{ 'active': showMobileMenu }"
            :aria-expanded="showMobileMenu" 
            aria-label="Menu"
          >
            <span class="hamburger">
              <span class="line"></span>
              <span class="line"></span>
              <span class="line"></span>
            </span>
          </button>
        </div>
      </div>
    </header>

    <!-- Mobile Menu -->
    <Transition name="slide-down">
      <div class="mobile-menu" v-show="showMobileMenu">
        <div class="container">
          <nav class="mobile-nav">
            <NuxtLink class="mobile-nav-link" to="/" @click="showMobileMenu = false">
              <span class="nav-icon">🏠</span>
              <span>{{ $t('nav.home') }}</span>
            </NuxtLink>
            <NuxtLink class="mobile-nav-link" to="/about" @click="showMobileMenu = false">
              <span class="nav-icon">ℹ️</span>
              <span>{{ $t('nav.about') }}</span>
            </NuxtLink>
            <NuxtLink class="mobile-nav-link" to="/team" @click="showMobileMenu = false">
              <span class="nav-icon">👥</span>
              <span>{{ $t('nav.team') }}</span>
            </NuxtLink>
            <NuxtLink class="mobile-nav-link" to="/equipment" @click="showMobileMenu = false">
              <span class="nav-icon">🔧</span>
              <span>{{ $t('nav.equipment') }}</span>
            </NuxtLink>
            <NuxtLink class="mobile-nav-link" to="/publications" @click="showMobileMenu = false">
              <span class="nav-icon">📚</span>
              <span>{{ $t('nav.publications') }}</span>
            </NuxtLink>
            <NuxtLink class="mobile-nav-link" to="/news" @click="showMobileMenu = false">
              <span class="nav-icon">📰</span>
              <span>{{ $t('nav.news') }}</span>
            </NuxtLink>
            
            <div class="mobile-nav-divider"></div>
            
            <template v-if="authStore.isAuthenticated">
              <NuxtLink class="mobile-nav-link" to="/admin" @click="showMobileMenu = false">
                <span class="nav-icon">⚙️</span>
                <span>{{ $t('nav.admin') }}</span>
              </NuxtLink>
              <button class="mobile-nav-link" @click="handleLogout">
                <span class="nav-icon">🚪</span>
                <span>{{ $t('nav.logout') }}</span>
              </button>
            </template>
            <template v-else>
              <NuxtLink class="mobile-nav-link" to="/login" @click="showMobileMenu = false">
                <span class="nav-icon">🔐</span>
                <span>{{ $t('nav.login') }}</span>
              </NuxtLink>
            </template>
          </nav>
        </div>
      </div>
    </Transition>
  </div>
</template>

<script setup lang="ts">
import { useAuthStore } from '@/stores/auth'

const authStore = useAuthStore()
const showUserMenu = ref(false)
const showMobileMenu = ref(false)
const isScrolled = ref(false)

const handleLogout = async () => {
  await authStore.logout()
  showUserMenu.value = false
  showMobileMenu.value = false
}

// Close mobile menu when route changes
watch(() => useRoute().path, () => {
  showMobileMenu.value = false
})

// Handle scroll effect
onMounted(() => {
  const handleScroll = () => {
    isScrolled.value = window.scrollY > 10
  }
  window.addEventListener('scroll', handleScroll)
  
  onUnmounted(() => {
    window.removeEventListener('scroll', handleScroll)
  })
})
</script>

<style scoped lang="scss">
$primary-blue: #005A9C;
$primary-gradient: linear-gradient(135deg, #005A9C 0%, #4D9DE0 100%);
$transition-fast: all 0.2s ease-in-out;
$transition-smooth: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);

.container {
  max-width: 1280px;
  margin: 0 auto;
  padding: 0 1.5rem;
}

/* =================================
   TOP BAR
   ================================= */
.top-bar {
  background: linear-gradient(135deg, #487fff 0%, #003791 100%);
  color: white;
  padding: 0.625rem 0;
  font-size: 0.8125rem;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  
  @media (max-width: 768px) {
    display: none;
  }
}

.top-bar-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.top-bar-right {
  display: flex;
  align-items: center;
  gap: 1.5rem;
}

.contact-info {
  display: flex;
  align-items: center;
  gap: 2rem;
}

.info-link {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: rgba(255, 255, 255, 0.85);
  transition: $transition-fast;
  font-weight: 500;
  
  &:hover {
    color: white;
    transform: translateY(-1px);
  }
  
  .icon {
    font-size: 1rem;
  }
}

.social-links {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.social-link {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 50%;
  color: rgba(255, 255, 255, 0.85);
  transition: $transition-smooth;
  backdrop-filter: blur(10px);
  
  &:hover {
    background: rgba(255, 255, 255, 0.2);
    color: white;
    transform: translateY(-2px);
  }
  
  .icon {
    font-size: 1rem;
  }
}

.divider {
  width: 1px;
  height: 20px;
  background: rgba(255, 255, 255, 0.2);
}

.user-links {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.user-link {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: rgba(255, 255, 255, 0.85);
  transition: $transition-fast;
  padding: 0.375rem 0.75rem;
  border-radius: 6px;
  font-weight: 500;
  
  &:hover {
    color: white;
    background: rgba(255, 255, 255, 0.1);
  }
  
  .icon {
    font-size: 1rem;
  }
}

/* =================================
   MAIN HEADER
   ================================= */
.header-wrapper {
  position: sticky;
  top: 0;
  z-index: 1000;
}

.main-header {
  background: white;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
  transition: $transition-smooth;
  
  &.scrolled {
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
    
    .logo-icon img {
      width: 150px;
    }
  }
}

.header-content {
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 80px;
  gap: 2rem;
  
  @media (max-width: 1024px) {
    height: 70px;
  }
}

/* =================================
   LOGO
   ================================= */
.logo {
  display: flex;
  align-items: center;
  gap: 1rem;
  transition: $transition-smooth;
  z-index: 10;
  
  &:hover {
    transform: scale(1.02);
  }
  
  .logo-icon img {
    transition: $transition-smooth;
  }
  
  .logo-text {
    display: none;
    
    @media (min-width: 640px) {
      display: block;
    }
    
    .logo-title {
      font-size: 1.5rem;
      font-weight: 900;
      background: $primary-gradient;
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
      letter-spacing: -0.02em;
    }
    
    .logo-subtitle {
      font-size: 0.8125rem;
      color: #64748b;
      font-weight: 500;
      margin-top: 2px;
    }
  }
}

/* =================================
   DESKTOP NAVIGATION
   ================================= */
.desktop-nav {
  display: none;
  align-items: center;
  gap: 0.5rem;
  flex: 1;
  justify-content: center;
  
  @media (min-width: 1024px) {
    display: flex;
  }
  
  .nav-link {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    padding: 0.75rem 1rem;
    color: #475569;
    font-weight: 600;
    font-size: 0.9375rem;
    border-radius: 10px;
    transition: $transition-smooth;
    position: relative;
    
    .nav-icon {
      font-size: 1.125rem;
      opacity: 0.8;
      transition: $transition-fast;
    }
    
    &::before {
      content: '';
      position: absolute;
      bottom: 0;
      left: 50%;
      transform: translateX(-50%);
      width: 0;
      height: 3px;
      background: $primary-gradient;
      border-radius: 3px 3px 0 0;
      transition: width 0.3s ease;
    }
    
    &:hover {
      color: $primary-blue;
      background: rgba(37, 99, 235, 0.05);
      
      .nav-icon {
        opacity: 1;
        transform: scale(1.1);
      }
      
      &::before {
        width: 60%;
      }
    }
    
    &.router-link-active {
      color: $primary-blue;
      background: rgba(37, 99, 235, 0.08);
      
      .nav-icon {
        opacity: 1;
      }
      
      &::before {
        width: 60%;
      }
    }
  }
}

/* =================================
   USER SECTION
   ================================= */
.user-section {
  display: none;
  
  @media (min-width: 1024px) {
    display: flex;
    align-items: center;
    gap: 1rem;
  }
}

.user-menu-container {
  position: relative;
}

.user-menu-button {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.5rem 1rem;
  border-radius: 12px;
  background: linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%);
  border: 1px solid #e2e8f0;
  cursor: pointer;
  transition: $transition-smooth;
  
  &:hover {
    background: white;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
    transform: translateY(-1px);
  }
  
  .user-avatar {
    width: 38px;
    height: 38px;
    background: $primary-gradient;
    border-radius: 10px;
    display: flex;
    align-items: center;
    justify-content: center;
    box-shadow: 0 2px 8px rgba(37, 99, 235, 0.2);
    
    span {
      color: white;
      font-size: 0.9375rem;
      font-weight: 700;
    }
  }
  
  .user-info {
    text-align: left;
    
    .user-name {
      font-size: 0.9375rem;
      font-weight: 600;
      color: #0f172a;
      line-height: 1.3;
    }
    
    .user-role {
      font-size: 0.75rem;
      color: #64748b;
      font-weight: 500;
    }
  }
  
  .dropdown-arrow {
    font-size: 0.625rem;
    color: #94a3b8;
    transition: transform 0.3s ease;
    
    &.open {
      transform: rotate(180deg);
    }
  }
}

.dropdown-menu {
  position: absolute;
  right: 0;
  top: calc(100% + 0.75rem);
  width: 280px;
  background: white;
  border-radius: 16px;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.15);
  border: 1px solid #e2e8f0;
  overflow: hidden;
  
  .dropdown-header {
    display: flex;
    align-items: center;
    gap: 0.75rem;
    padding: 1.25rem;
    background: linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%);
    
    .dropdown-user-avatar {
      width: 48px;
      height: 48px;
      background: $primary-gradient;
      border-radius: 12px;
      display: flex;
      align-items: center;
      justify-content: center;
      box-shadow: 0 4px 12px rgba(37, 99, 235, 0.25);
      flex-shrink: 0;
      
      span {
        color: white;
        font-size: 1.125rem;
        font-weight: 700;
      }
    }
    
    .dropdown-user-info {
      flex: 1;
      min-width: 0;
      
      .dropdown-user-name {
        font-size: 0.9375rem;
        font-weight: 700;
        color: #0f172a;
        margin-bottom: 2px;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
      }
      
      .dropdown-user-email {
        font-size: 0.8125rem;
        color: #64748b;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
      }
    }
  }
  
  .dropdown-divider {
    height: 1px;
    background: #e2e8f0;
  }
  
  .dropdown-content {
    padding: 0.5rem;
  }
  
  .dropdown-item {
    display: flex;
    align-items: center;
    gap: 0.75rem;
    width: 100%;
    text-align: left;
    padding: 0.875rem 1rem;
    font-size: 0.9375rem;
    font-weight: 500;
    color: #475569;
    background: none;
    border: none;
    border-radius: 10px;
    cursor: pointer;
    transition: $transition-fast;
    
    .item-icon {
      font-size: 1.125rem;
      opacity: 0.8;
    }
    
    &:hover {
      background: rgba(37, 99, 235, 0.05);
      color: $primary-blue;
      
      .item-icon {
        opacity: 1;
      }
    }
    
    &.logout {
      color: #dc2626;
      
      &:hover {
        background: rgba(220, 38, 38, 0.05);
      }
    }
  }
}

/* =================================
   MOBILE MENU BUTTON
   ================================= */
.mobile-menu-button {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 48px;
  height: 48px;
  background: none;
  border: none;
  border-radius: 12px;
  cursor: pointer;
  transition: $transition-smooth;
  
  @media (min-width: 1024px) {
    display: none;
  }
  
  &:hover {
    background: rgba(37, 99, 235, 0.05);
  }
  
  &.active {
    .line:nth-child(1) {
      transform: translateY(8px) rotate(45deg);
    }
    
    .line:nth-child(2) {
      opacity: 0;
      transform: translateX(-10px);
    }
    
    .line:nth-child(3) {
      transform: translateY(-8px) rotate(-45deg);
    }
  }
  
  .hamburger {
    display: flex;
    flex-direction: column;
    gap: 6px;
    width: 24px;
    
    .line {
      width: 100%;
      height: 3px;
      background: $primary-blue;
      border-radius: 2px;
      transition: $transition-smooth;
    }
  }
}

/* =================================
   MOBILE MENU
   ================================= */
.mobile-menu {
  background: white;
  border-top: 1px solid #e2e8f0;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
  max-height: calc(100vh - 70px);
  overflow-y: auto;
  
  @media (min-width: 1024px) {
    display: none;
  }
  
  .container {
    padding: 1.5rem;
  }
  
  .mobile-nav {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
  }
  
  .mobile-nav-link {
    display: flex;
    align-items: center;
    gap: 1rem;
    width: 100%;
    text-align: left;
    padding: 1rem 1.25rem;
    color: #475569;
    font-weight: 600;
    background: none;
    border: none;
    border-radius: 12px;
    transition: $transition-fast;
    font-size: 1rem;
    
    .nav-icon {
      font-size: 1.25rem;
      opacity: 0.8;
    }
    
    &:hover {
      color: $primary-blue;
      background: rgba(37, 99, 235, 0.05);
      transform: translateX(4px);
      
      .nav-icon {
        opacity: 1;
      }
    }
    
    &.router-link-active {
      color: $primary-blue;
      background: rgba(37, 99, 235, 0.08);
      font-weight: 700;
      
      .nav-icon {
        opacity: 1;
      }
    }
  }
  
  .mobile-nav-divider {
    height: 1px;
    background: #e2e8f0;
    margin: 0.75rem 0;
  }
}

/* =================================
   TRANSITIONS
   ================================= */
.dropdown-enter-active,
.dropdown-leave-active {
  transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
}

.dropdown-enter-from,
.dropdown-leave-to {
  opacity: 0;
  transform: translateY(-10px);
}

.slide-down-enter-active,
.slide-down-leave-active {
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.slide-down-enter-from,
.slide-down-leave-to {
  opacity: 0;
  transform: translateY(-20px);
}

/* =================================
   SCROLL BAR STYLING
   ================================= */
.mobile-menu::-webkit-scrollbar {
  width: 8px;
}

.mobile-menu::-webkit-scrollbar-track {
  background: #f8fafc;
}

.mobile-menu::-webkit-scrollbar-thumb {
  background: #cbd5e1;
  border-radius: 4px;
  
  &:hover {
    background: #94a3b8;
  }
}
</style>