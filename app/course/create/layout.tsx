'use client'

import PageTitle from '@/shared/components/ui/PageTitle'
import { useRouter } from 'next/navigation'

export default function CourseListLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter()
  return (
    <>
      <PageTitle title="강의 등록" onBack={() => router.back()} />
      {children}
    </>
  )
}
