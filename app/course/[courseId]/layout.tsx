'use client'

import { useRouter } from 'next/navigation'

import PageTitle from '@/shared/components/ui/PageTitle'

export default function CourseDetailLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter()
  return (
    <>
      <PageTitle title="강의 상세" onBack={() => router.back()} />
      {children}
    </>
  )
}
