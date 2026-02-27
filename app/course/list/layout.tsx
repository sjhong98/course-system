import Column from "@/component/common/flexBox/Column"
import Loading from "@/component/common/ui/Loading"
import PageTitle from "@/component/common/ui/PageTitle"
import { PAGE_HEIGHT } from "@/lib/constants/constants"
import { Suspense } from "react"

export default function CourseListLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <Column className='relative' style={{ height: PAGE_HEIGHT, maxHeight: PAGE_HEIGHT }}>
            <PageTitle title="강의 목록" />
            <Suspense fallback={<Loading />}>
                {children}
            </Suspense>
        </Column>
    )
}
