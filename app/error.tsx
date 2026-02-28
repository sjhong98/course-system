'use client'

import Error from '@/shared/components/ui/Error'

export default function DefaultError({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return <Error message={error.message} />
}
