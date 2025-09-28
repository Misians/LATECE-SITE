export default defineNuxtPlugin(() => {
  if (process.client) {
    // Keyboard navigation support
    const handleKeydown = (event: KeyboardEvent) => {
      // Skip to main content with Alt + M
      if (event.altKey && event.key === 'm') {
        event.preventDefault()
        const mainContent = document.getElementById('main-content')
        if (mainContent) {
          mainContent.focus()
          mainContent.scrollIntoView({ behavior: 'smooth' })
        }
      }
      
      // Toggle high contrast with Alt + C
      if (event.altKey && event.key === 'c') {
        event.preventDefault()
        toggleHighContrast()
      }
      
      // Increase font size with Alt + Plus
      if (event.altKey && event.key === '+') {
        event.preventDefault()
        increaseFontSize()
      }
      
      // Decrease font size with Alt + Minus
      if (event.altKey && event.key === '-') {
        event.preventDefault()
        decreaseFontSize()
      }
      
      // Reset font size with Alt + 0
      if (event.altKey && event.key === '0') {
        event.preventDefault()
        resetFontSize()
      }
    }
    
    // High contrast toggle
    const toggleHighContrast = () => {
      const isHighContrast = document.documentElement.classList.contains('high-contrast')
      if (isHighContrast) {
        document.documentElement.classList.remove('high-contrast')
        localStorage.setItem('high-contrast', 'false')
      } else {
        document.documentElement.classList.add('high-contrast')
        localStorage.setItem('high-contrast', 'true')
      }
    }
    
    // Font size controls
    const increaseFontSize = () => {
      const currentSize = parseInt(document.documentElement.style.fontSize) || 16
      const newSize = Math.min(currentSize + 2, 24)
      document.documentElement.style.fontSize = `${newSize}px`
      localStorage.setItem('font-size', newSize.toString())
    }
    
    const decreaseFontSize = () => {
      const currentSize = parseInt(document.documentElement.style.fontSize) || 16
      const newSize = Math.max(currentSize - 2, 14)
      document.documentElement.style.fontSize = `${newSize}px`
      localStorage.setItem('font-size', newSize.toString())
    }
    
    const resetFontSize = () => {
      document.documentElement.style.fontSize = '16px'
      localStorage.setItem('font-size', '16')
    }
    
    // Focus management for modals
    const trapFocus = (element: HTMLElement) => {
      const focusableElements = element.querySelectorAll(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
      )
      const firstElement = focusableElements[0] as HTMLElement
      const lastElement = focusableElements[focusableElements.length - 1] as HTMLElement
      
      const handleTabKey = (e: KeyboardEvent) => {
        if (e.key === 'Tab') {
          if (e.shiftKey) {
            if (document.activeElement === firstElement) {
              lastElement.focus()
              e.preventDefault()
            }
          } else {
            if (document.activeElement === lastElement) {
              firstElement.focus()
              e.preventDefault()
            }
          }
        }
      }
      
      element.addEventListener('keydown', handleTabKey)
      
      return () => {
        element.removeEventListener('keydown', handleTabKey)
      }
    }
    
    // Announce changes to screen readers
    const announceToScreenReader = (message: string) => {
      const announcement = document.createElement('div')
      announcement.setAttribute('aria-live', 'polite')
      announcement.setAttribute('aria-atomic', 'true')
      announcement.className = 'sr-only'
      announcement.textContent = message
      
      document.body.appendChild(announcement)
      
      setTimeout(() => {
        document.body.removeChild(announcement)
      }, 1000)
    }
    
    // Initialize accessibility features
    const initializeAccessibility = () => {
      // Load saved preferences
      const savedHighContrast = localStorage.getItem('high-contrast')
      if (savedHighContrast === 'true') {
        document.documentElement.classList.add('high-contrast')
      }
      
      const savedFontSize = localStorage.getItem('font-size')
      if (savedFontSize) {
        document.documentElement.style.fontSize = `${savedFontSize}px`
      }
      
      // Add keyboard event listener
      document.addEventListener('keydown', handleKeydown)
      
      // Add focus indicators
      document.addEventListener('keydown', (e) => {
        if (e.key === 'Tab') {
          document.body.classList.add('keyboard-navigation')
        }
      })
      
      document.addEventListener('mousedown', () => {
        document.body.classList.remove('keyboard-navigation')
      })
    }
    
    // Initialize when DOM is ready
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', initializeAccessibility)
    } else {
      initializeAccessibility()
    }
    
    // Provide accessibility utilities
    return {
      provide: {
        accessibility: {
          toggleHighContrast,
          increaseFontSize,
          decreaseFontSize,
          resetFontSize,
          trapFocus,
          announceToScreenReader
        }
      }
    }
  }
})
