import {parseURL, withBase, withoutTrailingSlash} from 'ufo'
import { renderSSRHead } from '@unhead/ssr'
import { createHeadCore } from '@unhead/vue'
import { defineEventHandler, sendRedirect } from 'h3'
import { fetchPayload, renderIsland, useHostname } from '../../utils'
import { height, width } from '#nuxt-og-image/config'

export default defineEventHandler(async (e) => {
  const path = parseURL(e.path).pathname
  if (!path.endsWith('__og_image__/html'))
    return

  const basePath = withoutTrailingSlash(path.replace('__og_image__/html', ''))

  // extract the payload from the original path
  const payload = await fetchPayload(basePath)

  // for screenshots just return the base path
  if (payload.provider === 'browser')
    return sendRedirect(e, withBase(basePath, useHostname(e)))

  const component = payload.component || 'OgImageTemplate'
  delete payload.component

  // using Nuxt Island, generate the og:image HTML
  const island = await renderIsland(component, payload)

  const head = createHeadCore()
  head.push(island.head)
  head.push({
    style: [
      {
        innerHTML: 'body { font-family: \'Inter\', sans-serif; }',
      },
    ],
    link: [
      {
        // reset css to match svg output
        href: 'https://cdn.jsdelivr.net/npm/gardevoir',
        rel: 'stylesheet',
      },
      {
        href: 'https://fonts.googleapis.com/css2?family=Inter:wght@400;700&display=swap',
        rel: 'stylesheet',
      },
    ],
  })
  const headChunk = await renderSSRHead(head)
  return `<!DOCTYPE html>
<html ${headChunk.htmlAttrs}>
<head>${headChunk.headTags}</head>
<body ${headChunk.bodyAttrs}>${headChunk.bodyTagsOpen}<div style="width: ${width}px; height: ${height}px; display: flex; margin: 0 auto;">${island.html}</div>${headChunk.bodyTags}</body>
</html>`
})