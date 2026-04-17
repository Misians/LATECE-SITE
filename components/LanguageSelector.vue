<template lang="pug">
  .language-selector
    button.language-button(@click="toggleDropdown", :aria-expanded="showDropdown", aria-haspopup="true")
      span.language-name {{ currentLanguage.name }}
    
    // Dropdown
    .language-dropdown(v-show="showDropdown", @click.away="closeDropdown")
      ul.language-list
        li(v-for="locale in availableLocales", :key="locale.code")
          button.language-option(
            @click="changeLanguage(locale.code)",
            :class="{ 'is-active': locale.code === currentLocale }"
          )
            .flag {{ getFlagEmoji(locale.code) }}
            span {{ locale.name }}
  </template>

  <script setup lang="ts">
const { locale, setLocale } = useI18n()

const showDropdown = ref(false)

const availableLocales = computed(() => [
  { code: 'pt', name: 'Português' },
  { code: 'en', name: 'English' }
])

const currentLocale = computed(() => locale.value)

const currentLanguage = computed(() => 
  availableLocales.value.find(l => l.code === currentLocale.value) || availableLocales.value[0]
)

const toggleDropdown = () => {
  showDropdown.value = !showDropdown.value
}

const closeDropdown = () => {
  showDropdown.value = false
}

const changeLanguage = async (newLocale: 'pt' | 'en') => {
  await setLocale(newLocale)
  closeDropdown()
}

const getFlagEmoji = (localeCode: string) => {
  switch (localeCode) {
    case 'pt': return '🇧🇷'
    case 'en': return '🇺🇸'
    default: return '🌐'
  }
}

// Close dropdown when route changes
watch(() => useRoute().path, () => {
  closeDropdown()
})
</script>
<style scoped lang="scss">
// Variáveis (ajuste as cores conforme seu design system)
$primary-blue: #1D8A9F;
$gray-100: #f3f4f6;
$gray-200: #e5e7eb;
$gray-300: #d1d5db;
$gray-400: #9ca3af;
$gray-500: #6b7280;
$gray-700: #374151;
$focus-ring-color: rgba(29, 138, 159, 0.4);

.language-selector {
  position: relative;
  display: inline-block;
}

.language-button {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 0.75rem;
  border-radius: 0.5rem;
  border: 1px solid $gray-300;
  background-color: white;
  cursor: pointer;
  transition: background-color 0.2s ease-in-out;
  font-family: inherit;

  &:hover {
    background-color: $gray-100;
  }

  &:focus-visible {
    outline: none;
    box-shadow: 0 0 0 3px $focus-ring-color;
  }

  .language-name {
    font-size: 0.875rem;
    font-weight: 500;
  }

  :deep(svg) {
    width: 1rem;
    height: 1rem;
    color: $gray-500;
  }

  // Seta para baixo
  :deep(svg:last-child) {
    color: $gray-400;
  }
}

.language-dropdown {
  position: absolute;
  right: 0;
  margin-top: 0.5rem;
  width: 12rem;
  background-color: white;
  border-radius: 0.5rem;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -2px rgba(0, 0, 0, 0.1);
  border: 1px solid $gray-200;
  z-index: 50;
  padding: 0.25rem 0;
  animation: slideInDown 0.2s ease-out;
}

.language-list {
  list-style: none;
  margin: 0;
  padding: 0;
}

.language-option {
  width: 100%;
  text-align: left;
  padding: 0.5rem 1rem;
  font-size: 0.875rem;
  color: $gray-700;
  background-color: transparent;
  border: none;
  cursor: pointer;
  transition: background-color 0.2s ease-in-out, color 0.2s ease-in-out;
  display: flex;
  align-items: center;
  gap: 0.75rem;

  &:hover {
    background-color: $gray-100;
  }

  &.is-active {
    background-color: $primary-blue;
    color: white;
  }
}

.flag {
  width: 1.5rem;
  height: 1rem;
  border-radius: 0.125rem;
  border: 1px solid $gray-200;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.75rem;
  font-weight: bold;
}

@keyframes slideInDown {
  from {
    transform: translateY(-10px);
    opacity: 0;
  }
  to {
    transform: translateY(0);
    opacity: 1;
  }
}
</style>