export default defineNuxtPlugin(() => {
  if (process.client) {
    // Load vLIBRAS script
    const script = document.createElement('script')
    script.src = 'https://vlibras.gov.br/app/vlibras-plugin.js'
    script.async = true
    script.onload = () => {
      // Initialize vLIBRAS
      if (window.VLibras) {
        new window.VLibras.Widget('https://vlibras.gov.br/app')
      }
    }
    document.head.appendChild(script)
    
    // Add vLIBRAS widget container
    const widget = document.createElement('div')
    widget.setAttribute('id', 'vlibras-widget')
    widget.setAttribute('data-vlibras', 'true')
    document.body.appendChild(widget)
  }
})

// Extend Window interface for TypeScript
declare global {
  interface Window {
    VLibras: {
      Widget: new (url: string) => void
    }
  }
}
