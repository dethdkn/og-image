import { getQuery } from 'h3'
import { defineCachedEventHandler } from '#internal/nitro'

// copied from vercel/satori
export default defineCachedEventHandler(async (e) => {
  const { name, weight } = getQuery(e)

  const css = await (
    await $fetch(`https://fonts.googleapis.com/css2?family=${name || 'Inter'}:wght@${weight || 400}`, {
      headers: {
        // Make sure it returns TTF.
        'User-Agent':
          'Mozilla/5.0 (Macintosh; U; Intel Mac OS X 10_6_8; de-at) AppleWebKit/533.21.1 (KHTML, like Gecko) Version/5.0.5 Safari/533.21.1',
      },
    })
  )

  const resource = css.match(/src: url\((.+)\) format\('(opentype|truetype)'\)/)

  if (!resource)
    return
  return resource[1]
})