import type { OgImageOptions } from '../../src/types'
import { host, path, refreshTime } from '~/util/logic'
export async function fetchOptions() {
  const { data: options } = await useAsyncData<OgImageOptions>(() => {
    return $fetch('/api/og-image-options', {
      baseURL: host,
      query: { path: path.value },
    })
  }, {
    watch: [path, refreshTime],
  })
  return options
}

export async function fetchVNodes() {
  const { data: options } = await useAsyncData<OgImageOptions>(() => {
    return $fetch('/api/og-image-vnode', {
      query: { path: path.value },
      baseURL: host,
    })
  }, {
    watch: [path, refreshTime],
  })
  return options
}