import { usePathname, useRouter } from 'next/navigation'
import { useCallback } from 'react'

export function useQueryParams() {
  const router = useRouter()
  const pathname = usePathname()

  const setParam = useCallback(
    (key: string, value: string | null) => {
      const params = new URLSearchParams(window.location.search)

      if (value === null) {
        params.delete(key)
      } else {
        params.set(key, value)
      }

      const queryString = params.toString()
      const url = queryString ? `${pathname}?${queryString}` : pathname

      router.replace(url)
    },
    [router, pathname],
  )

  return { setParam }
}
