import { defineNuxtPlugin } from '#imports'
import { routeRuleOgImage as setup } from '../../utils/plugins'

export default defineNuxtPlugin({
  setup(nuxtApp) {
    if (import.meta.dev || import.meta.prerender) {
      setup(nuxtApp)
    }
  },
})
