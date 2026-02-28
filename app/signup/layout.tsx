import PageTitle from '@/shared/components/ui/PageTitle'

export default function CourseListLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <PageTitle title="회원가입" />
      {children}
    </>
  )
}
