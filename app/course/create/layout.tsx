import PageTitle from '@/shared/components/ui/PageTitle'

export default function CourseListLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <PageTitle title="강의 등록" />
      {children}
    </>
  )
}
