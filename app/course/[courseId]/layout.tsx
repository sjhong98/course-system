import PageTitle from "@/shared/components/ui/PageTitle";

export default function CourseDetailLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <PageTitle title="강의 상세" />
      {children}
    </>
  )
}