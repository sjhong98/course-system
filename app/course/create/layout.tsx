'use client'

import { useRouter } from 'next/navigation'

import PageTitle from '@/shared/components/ui/PageTitle'

export default function CourseListLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter()
  return (
    <>
      <PageTitle title="강의 등록" onBack={() => router.back()} />
      {children}
    </>
  )
}
