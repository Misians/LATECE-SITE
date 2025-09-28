<template lang="pug">
  .accessibility-controls
    // Painel de Controles (inicialmente escondido)
    .control-panel(v-show="showControls")
      .panel-header
        h3.panel-title Controles de Acessibilidade
        button.close-button(@click="showControls = !showControls", :aria-expanded="showControls")
  
      .controls
        // Alto Contraste
        .control-item
          label.control-label
            input(type="checkbox", v-model="highContrast", @change="toggleHighContrast")
            span {{ $t('accessibility.highContrast') }}
  
        // Tamanho da Fonte
        .control-item
          .font-size-header
            span.control-label Tamanho da Fonte
            span.font-size-display {{ fontSize }}px
          .button-group
            button.font-size-btn(@click="decreaseFontSize", :disabled="fontSize <= 14") A-
            button.font-size-btn(@click="increaseFontSize", :disabled="fontSize >= 24") A+
            button.font-size-btn.reset(@click="resetFontSize") Reset
  
        // Leitor de Tela
        .control-item
          button.screen-reader-btn(@click="announceToScreenReader")
            span {{ $t('accessibility.screenReader') }}
  
        // Atalhos
        .control-item
          .keyboard-shortcuts
            h4.shortcuts-title Atalhos do Teclado
            ul.shortcuts-list
              li.shortcut
                span Alt + M
                span Pular para conteúdo
              li.shortcut
                span Alt + C
                span Alto contraste
              li.shortcut
                span Alt + +
                span Aumentar fonte
              li.shortcut
                span Alt + -
                span Diminuir fonte
              li.shortcut
                span Alt + 0
                span Resetar fonte
  
    // Botão flutuante para abrir/fechar o painel
    button.toggle-button(@click="showControls = !showControls", :aria-expanded="showControls", aria-label="Controles de Acessibilidade")
  </template>

<script setup lang="ts">
const showControls = ref(false)
const highContrast = ref(false)
const fontSize = ref(16)

// High contrast toggle
const toggleHighContrast = () => {
  if (process.client) {
    document.documentElement.classList.toggle('high-contrast', highContrast.value)
    localStorage.setItem('high-contrast', highContrast.value.toString())
  }
}

// Font size controls
const increaseFontSize = () => {
  if (fontSize.value < 24) {
    fontSize.value += 2
    updateFontSize()
  }
}

const decreaseFontSize = () => {
  if (fontSize.value > 14) {
    fontSize.value -= 2
    updateFontSize()
  }
}

const resetFontSize = () => {
  fontSize.value = 16
  updateFontSize()
}

const updateFontSize = () => {
  if (process.client) {
    document.documentElement.style.fontSize = `${fontSize.value}px`
    localStorage.setItem('font-size', fontSize.value.toString())
  }
}

// Screen reader announcement
const announceToScreenReader = () => {
  if (process.client) {
    const announcement = document.createElement('div')
    announcement.setAttribute('aria-live', 'polite')
    announcement.setAttribute('aria-atomic', 'true')
    announcement.className = 'sr-only'
    announcement.textContent = 'Controles de acessibilidade ativados. Use Tab para navegar pelos elementos da página.'
    
    document.body.appendChild(announcement)
    
    setTimeout(() => {
      document.body.removeChild(announcement)
    }, 1000)
  }
}

// Initialize settings from localStorage
onMounted(() => {
  if (process.client) {
    // Load high contrast setting
    const savedHighContrast = localStorage.getItem('high-contrast')
    if (savedHighContrast === 'true') {
      highContrast.value = true
      document.documentElement.classList.add('high-contrast')
    }
    
    // Load font size setting
    const savedFontSize = localStorage.getItem('font-size')
    if (savedFontSize) {
      fontSize.value = parseInt(savedFontSize)
      document.documentElement.style.fontSize = `${fontSize.value}px`
    }
  }
})
</script>
<style scoped lang="scss">
// Variáveis de Cor (assumindo que você as tenha definidas globalmente)
$light-blue: #64B8D1;
$gray-100: #f3f4f6;
$gray-200: #e5e7eb;
$gray-500: #6b7280;
$gray-600: #4b5563;
$gray-700: #374151;

// Configurações de transição e sombra
$transition-fast: all 0.2s ease-in-out;
$focus-ring: 0 0 0 2px rgba(96, 165, 250, 0.5);

// Container principal
.accessibility-controls {
  position: fixed;
  bottom: 1rem;
  right: 1rem;
  z-index: 50;
  font-family: sans-serif;
}

// Botão flutuante
.toggle-button {
  width: 3rem;
  height: 3rem;
  background-color: #1D8A9F;
  color: white;
  border-radius: 9999px;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -2px rgba(0, 0, 0, 0.1);
  transition: $transition-fast;
  display: flex;
  align-items: center;
  justify-content: center;
  border: none;
  cursor: pointer;

  &:hover {
    background-color: $light-blue;
    transform: scale(1.05);
  }

  :deep(svg) {
    width: 1.5rem;
    height: 1.5rem;
  }
}

// Painel de controles
.control-panel {
  background-color: white;
  border-radius: 0.5rem;
  box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -4px rgba(0, 0, 0, 0.1);
  border: 1px solid $gray-200;
  padding: 1rem;
  width: 100%;
  max-width: 20rem;
  margin-bottom: 1rem; // Espaço entre o painel e o botão flutuante
  animation: slideInUp 0.3s ease-out;
}

.panel-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 1rem;
}

.panel-title {
  font-size: 1.125rem;
  font-weight: 600;
  color: #1D8A9F;
}

.close-button {
  padding: 0.25rem;
  border-radius: 0.25rem;
  background: none;
  border: none;
  cursor: pointer;

  &:hover {
    background-color: $gray-100;
  }

  :deep(svg) {
    width: 1.25rem;
    height: 1.25rem;
  }
}

.controls {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.control-item {
  font-size: 0.875rem;
  font-weight: 500;
}

.control-label {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  cursor: pointer;
}

// Botões de tamanho de fonte
.font-size-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 0.5rem;
}

.font-size-display {
  font-size: 0.75rem;
  color: $gray-500;
}

.button-group {
  display: flex;
  gap: 0.5rem;
}

.font-size-btn {
  padding: 0.25rem 0.75rem;
  background-color: $gray-100;
  border: none;
  border-radius: 0.25rem;
  font-size: 0.875rem;
  cursor: pointer;
  transition: $transition-fast;

  &:hover:not(:disabled) {
    background-color: $gray-200;
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }

  &.reset {
    background-color: #1D8A9F;
    color: white;

    &:hover {
      background-color: #0d515f;
    }
  }
}

// Botão do leitor de tela
.screen-reader-btn {
  width: 100%;
  padding: 0.5rem 0.75rem;
  background-color: $light-blue;
  color: white;
  border: none;
  border-radius: 0.25rem;
  font-size: 0.875rem;
  cursor: pointer;
  transition: $transition-fast;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;

  &:hover {
    background-color: #1D8A9F;
  }

  :deep(svg) {
    width: 1rem;
    height: 1rem;
  }
}

// Atalhos do teclado
.shortcuts-title {
  font-size: 0.875rem;
  font-weight: 600;
  color: $gray-700;
  margin-bottom: 0.5rem;
}

.shortcuts-list {
  font-size: 0.75rem;
  color: $gray-600;
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.shortcut {
  display: flex;
  justify-content: space-between;
}

// Animações
@keyframes slideInUp {
  from {
    transform: translateY(20px);
    opacity: 0;
  }
  to {
    transform: translateY(0);
    opacity: 1;
  }
}
</style>