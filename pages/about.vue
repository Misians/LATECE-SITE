<template lang="pug">
  .about-page
    // Hero Section
    section.hero
      .container.hero__container
        h1.hero-title {{ $t('about.title') }}
        p.hero-subtitle {{ $t('about.subtitle') }}
    
    // Mission and Vision Section
    section.mission-vision
      .container
        .mission-vision__content
          .mission-vision__grid
            .mission-card.card
              .icon
              h2.card-title {{ $t('about.mission') }}
              p.card-text {{ $t('about.missionText') }}
            
            .vision-card.card
              .icon.icon--vision
              h2.card-title {{ $t('about.vision') }}
              p.card-text {{ $t('about.visionText') }}
    
    // Objectives Section
    section.objectives
      .container
        .objectives__content
          h2.section-title {{ $t('about.objectives') }}
          
          .objectives__grid
            .objective-item.card
              .objective-icon.objective-icon--research
              h3.objective-title {{ $t('about.research') }}
              p.objective-text {{ $t('about.researchText') }}
            
            .objective-item.card
              .objective-icon.objective-icon--education
              h3.objective-title {{ $t('about.education') }}
              p.objective-text {{ $t('about.educationText') }}
            
            .objective-item.card
              .objective-icon.objective-icon--community
              h3.objective-title {{ $t('about.community') }}
              p.objective-text {{ $t('about.communityText') }}
            
            .objective-item.card
              .objective-icon.objective-icon--innovation
              h3.objective-title {{ $t('about.innovation') }}
              p.objective-text {{ $t('about.innovationText') }}
    
    // Justification Section
    section.justification
      .container
        .justification__content
          h2.section-title {{ $t('about.justification') }}
          
          .justification-prose
            p {{ $t('about.justificationText1') }}
            p {{ $t('about.justificationText2') }}
            p {{ $t('about.justificationText3') }}
            
            .highlight-box
              p.highlight-box__title {{ $t('about.highlight') }}
              p {{ $t('about.highlightText') }}
    
    // CTA Section
    section.cta
      .container.cta__container
        h2.cta-title {{ $t('about.cta') }}
        p.cta-text {{ $t('about.ctaText') }}
        .cta-actions
          NuxtLink.btn.btn-secondary.btn-lg(to="/team") {{ $t('about.meetTeam') }}
          NuxtLink.btn.btn-outline.btn-lg(to="/equipment") {{ $t('about.exploreEquipment') }}
</template>

<script setup lang="ts">
// Meta tags
useHead({
  title: 'Sobre o LATECE - Laboratório de Tecnologia Assistiva',
  meta: [
    { name: 'description', content: 'Conheça o Laboratório de Tecnologia Assistiva da UFRN, sua missão, visão e objetivos' }
  ]
})
</script>

<style scoped lang="scss">
//=================================================================
// Variables & Base Styles
//=================================================================
// Colors (assuming these values)
$primary-blue: #005A9C;
$light-blue: #4D9DE0;
$olive-green: #7C982F;
$mustard: #E3B448;
$terracotta: #BD6B45;
$dark-aqua: #368F8B;
$white: #ffffff;
$gray-50: #f9fafb;
$gray-700: #4a5568;

// Gradients
$primary-gradient: linear-gradient(to bottom right, $primary-blue, $light-blue);
$secondary-gradient: linear-gradient(135deg, $primary-blue 0%, $light-blue 100%);

// Transitions
$transition-normal: all 0.3s ease-in-out;

// Base Container
.container {
  width: 100%;
  margin-left: auto;
  margin-right: auto;
  padding-left: 1rem;
  padding-right: 1rem;
}

// Section Base
section {
  padding-top: 4rem;
  padding-bottom: 4rem;
}

.section-title {
  position: relative;
  font-size: 1.875rem;
  font-weight: 700;
  color: $primary-blue;
  margin-bottom: 3rem;
  text-align: center;
  
  &::after {
    content: '';
    position: absolute;
    bottom: -8px;
    left: 50%;
    transform: translateX(-50%);
    width: 60px;
    height: 4px;
    background: $primary-gradient;
    border-radius: 2px;
  }
}

// Card Base
.card {
  padding: 2rem;
  transition: $transition-normal;

  &:hover {
    transform: translateY(-4px);
  }
}

//=================================================================
// Hero Section
//=================================================================
.hero {
  padding-top: 5rem;
  padding-bottom: 5rem;
  background: $primary-gradient;
  color: $white;

  &__container {
    text-align: center;
  }

  .hero-title {
    font-size: 3rem;
    font-weight: 800;
    margin-bottom: 1.5rem;
    text-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  }

  .hero-subtitle {
    font-size: 1.25rem;
    margin-bottom: 2rem;
  }
}

//=================================================================
// Mission & Vision Section
//=================================================================
.mission-vision {
  background-color: $white;

  &__content {
    max-width: 72rem;
    margin-left: auto;
    margin-right: auto;
  }

  &__grid {
    display: grid;
    grid-template-columns: 1fr;
    gap: 3rem;
  }

  .card-title {
    font-size: 1.5rem;
    font-weight: 700;
    color: $primary-blue;
    margin-bottom: 1rem;
  }

  .card-text {
    color: $gray-700;
    line-height: 1.625;
  }

  .icon {
    width: 4rem;
    height: 4rem;
    background-color: $primary-blue;
    border-radius: 9999px;
    display: flex;
    align-items: center;
    justify-content: center;
    margin-bottom: 1.5rem;

    &--vision {
      background-color: $light-blue;
    }
    
    &__svg {
      width: 2rem;
      height: 2rem;
      color: $white;
    }
  }
}

//=================================================================
// Objectives Section
//=================================================================
.objectives {
  background-color: $gray-50;
  
  &__content {
    max-width: 56rem;
    margin-left: auto;
    margin-right: auto;
    text-align: center;
  }
  
  &__grid {
    display: grid;
    grid-template-columns: 1fr;
    gap: 2rem;
    text-align: left;
  }

  .objective-item {
    padding: 1.5rem;
  }
  
  .objective-icon {
    width: 3rem;
    height: 3rem;
    border-radius: 0.5rem;
    display: flex;
    align-items: center;
    justify-content: center;
    margin-bottom: 1rem;

    &--research { background-color: $olive-green; }
    &--education { background-color: $mustard; }
    &--community { background-color: $terracotta; }
    &--innovation { background-color: $dark-aqua; }
    
    &__svg {
      width: 1.5rem;
      height: 1.5rem;
      color: $white;
    }
  }
  
  .objective-title {
    font-size: 1.25rem;
    font-weight: 600;
    color: $primary-blue;
    margin-bottom: 0.75rem;
  }
  
  .objective-text {
    color: $gray-700;
  }
}

//=================================================================
// Justification Section
//=================================================================
.justification {
  background-color: $white;
  
  &__content {
    max-width: 56rem;
    margin-left: auto;
    margin-right: auto;
  }
  
  &-prose {
    p {
      font-size: 1.125rem;
      color: $gray-700;
      margin-bottom: 1.5rem;
      
      &:last-of-type {
        margin-bottom: 2rem;
      }
    }
  }
  
  .highlight-box {
    background: rgba($light-blue, 0.1);
    border-left: 4px solid $primary-blue;
    padding: 1.5rem;
    border-top-right-radius: 0.5rem;
    border-bottom-right-radius: 0.5rem;
    
    &__title {
      font-size: 1.125rem;
      font-weight: 500;
      color: $primary-blue;
      margin-bottom: 0.5rem;
    }
  }
}

//=================================================================
// CTA Section
//=================================================================
.cta {
  background: $secondary-gradient;
  color: $white;

  &__container {
    text-align: center;
  }

  .cta-title {
    font-size: 1.875rem;
    font-weight: 700;
    margin-bottom: 1.5rem;
  }
  
  .cta-text {
    font-size: 1.25rem;
    margin-bottom: 2rem;
  }

  .cta-actions {
    display: flex;
    flex-direction: column;
    gap: 1rem;
    justify-content: center;
    align-items: center;
  }
}

//=================================================================
// Buttons
//=================================================================
.btn {
  display: inline-block;
  padding: 0.75rem 1.5rem;
  border-radius: 0.5rem;
  font-weight: 600;
  text-decoration: none;
  transition: $transition-normal;
  cursor: pointer;
  border: 2px solid transparent;

  &.btn-lg {
    padding: 1rem 2rem;
    font-size: 1.125rem;
  }

  &.btn-secondary {
    background-color: $white;
    color: $primary-blue;
    
    &:hover {
      background-color: rgba($white, 0.9);
      transform: translateY(-2px);
    }
  }

  &.btn-outline {
    background-color: transparent;
    border-color: $white;
    color: $white;

    &:hover {
      background-color: $white;
      color: $primary-blue;
      transform: translateY(-2px);
    }
  }
}

//=================================================================
// Media Queries (Responsiveness)
//=================================================================
// Small screens (sm)
@media (min-width: 640px) {
  .cta-actions {
    flex-direction: row;
  }
}

// Medium screens (md)
@media (min-width: 768px) {
  .objectives__grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

// Large screens (lg)
@media (min-width: 1024px) {
  .mission-vision__grid {
    grid-template-columns: repeat(2, 1fr);
  }
}
</style>