import { defineContentScript } from '#imports'
import { sendMessage } from '@/utils/message'

export default defineContentScript({
  matches: ['<all_urls>'],
  main() {
    const media = window.matchMedia('(prefers-color-scheme: dark)')

    const updateIcon = (isDark: boolean) => {
      void sendMessage('updateThemeIcon', { isDark })
    }

    // Initial check
    updateIcon(media.matches)

    // Listen for changes
    media.addEventListener('change', (e) => {
      updateIcon(e.matches)
    })
  },
})
