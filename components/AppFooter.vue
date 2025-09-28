<template lang="pug">
  footer.site-footer
    .container
      .footer-grid
        //- Logo and description
        .footer-section
          .logo
            .logo-icon
              span L
            span.logo-text LATECE
          p.description Laboratório de Tecnologia Assistiva da UFRN
          p.tagline Promovendo inclusão e acessibilidade através da tecnologia

        //- Quick Links
        .footer-section
          h3.footer-title Links Rápidos
          ul.footer-list
            li: NuxtLink.footer-link(to="/about") {{ $t('nav.about') }}
            li: NuxtLink.footer-link(to="/team") {{ $t('nav.team') }}
            li: NuxtLink.footer-link(to="/equipment") {{ $t('nav.equipment') }}
            li: NuxtLink.footer-link(to="/publications") {{ $t('nav.publications') }}
            li: NuxtLink.footer-link(to="/news") {{ $t('nav.news') }}

        //- Resources
        .footer-section
          h3.footer-title Recursos
          ul.footer-list
            li: a.footer-link(href="#", target="_blank", rel="noopener") Documentação
            li: a.footer-link(href="#", target="_blank", rel="noopener") Tutoriais
            li: a.footer-link(href="#", target="_blank", rel="noopener") API
            li: a.footer-link(href="#", target="_blank", rel="noopener") Suporte

        //- Contact
        .footer-section
          h3.footer-title Contato
          .contact-info
            .contact-item
              span UFRN - Campus Central
            .contact-item
              span (84) 3215-0000
            .contact-item
              span latece@ufrn.edu.br

      //- Bottom bar
      .footer-bottom
        p.copyright © {{ new Date().getFullYear() }} LATECE - UFRN. Todos os direitos reservados.
        nav.footer-bottom-links
          a.footer-link(href="#", target="_blank", rel="noopener") Política de Privacidade
          a.footer-link(href="#", target="_blank", rel="noopener") Termos de Uso
          a.footer-link(href="#", target="_blank", rel="noopener") Acessibilidade
</template>

<style scoped lang="scss">
//================================
// Variables
//================================
$primary-blue: #005A9C;
$light-blue: #4D9DE0;
$white: #ffffff;
$gray-200: #e5e7eb; // For primary text on dark background
$gray-300: #d1d5db; // For secondary text on dark background
$gray-600: #4b5563; // For the border on dark background
$radius-lg: 0.5rem;

//================================
// Main Footer Layout
//================================
.site-footer {
  background-color: $primary-blue;
  color: $white;
  padding: 3rem 0;
}

.container {
  width: 100%;
  max-width: 1280px; // Standard container max-width
  margin: 0 auto;
  padding: 0 1rem;
}

.footer-grid {
  display: grid;
  gap: 2rem;
  grid-template-columns: 1fr;
}

// Responsive grid layout
@media (min-width: 768px) {
  .footer-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (min-width: 1024px) {
  .footer-grid {
    grid-template-columns: repeat(4, 1fr);
  }
}

//================================
// Footer Sections
//================================
.footer-section {
  .logo {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    margin-bottom: 1rem;
  }

  .logo-icon {
    width: 2.5rem;
    height: 2.5rem;
    background-color: $white;
    border-radius: $radius-lg;
    display: flex;
    align-items: center;
    justify-content: center;

    span {
      color: $primary-blue;
      font-weight: 700;
      font-size: 1.125rem;
    }
  }

  .logo-text {
    font-size: 1.25rem;
    font-weight: 700;
  }

  .description {
    color: $gray-200;
    margin-bottom: 1rem;
  }

  .tagline {
    font-size: 0.875rem;
    color: $gray-300;
  }
}

//================================
// Titles, Lists, and Links
//================================
.footer-title {
  font-size: 1.125rem;
  font-weight: 600;
  position: relative;
  padding-bottom: 0.5rem;
  margin-bottom: 1rem;

  &::after {
    content: '';
    position: absolute;
    bottom: 0;
    left: 0;
    width: 30px;
    height: 2px;
    background-color: $light-blue;
    border-radius: 1px;
  }
}

.footer-list {
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.footer-link {
  color: $gray-300;
  text-decoration: none;
  transition: color 0.2s ease-in-out;

  &:hover {
    color: $white;
    text-decoration: underline;
  }
}

//================================
// Contact Section
//================================
.contact-info {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  font-size: 0.875rem;
  color: $gray-200;
}

.contact-item {
  display: flex;
  align-items: flex-start;
  gap: 0.5rem;
}

.contact-icon {
  width: 1rem;
  height: 1rem;
  flex-shrink: 0;
  margin-top: 2px; // Fine-tune vertical alignment
}

//================================
// Footer Bottom Bar
//================================
.footer-bottom {
  border-top: 1px solid $gray-600;
  margin-top: 2rem;
  padding-top: 2rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
}

.copyright {
  font-size: 0.875rem;
  color: $gray-300;
  text-align: center;
}

.footer-bottom-links {
  display: flex;
  gap: 1.5rem;
  flex-wrap: wrap; // Allows links to wrap on small screens
  justify-content: center;

  .footer-link {
    font-size: 0.875rem;
  }
}

@media (min-width: 768px) {
  .footer-bottom {
    flex-direction: row;
    gap: 0;
  }
  .copyright {
    text-align: left; 
  }
}
</style>