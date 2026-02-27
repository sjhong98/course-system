import { usePathname, useRouter } from "next/navigation"
import { useCallback, useEffect } from "react"

export function useQueryParams() {
    const router = useRouter()
    const pathname = usePathname()

    const setParam = useCallback(
        (key: string, value: string | null) => {
            console.log("=== setParam 호출 ===")
            console.log("key:", key, "value:", value)
            console.log("window BEFORE:", window.location.href)

            const params = new URLSearchParams(window.location.search)

            if (value === null) {
                params.delete(key)
            } else {
                params.set(key, value)
            }

            const queryString = params.toString()
            const url = queryString ? `${pathname}?${queryString}` : pathname

            console.log("CURRENT (from hook):", `${pathname}?${window.location.href.toString()}`)
            console.log("NEXT (to replace):", url)

            router.replace(url)

            console.log("window AFTER (직후):", window.location.href)
        },
        [router, pathname]
    )

    useEffect(() => {
}, [])

    return { setParam }
}