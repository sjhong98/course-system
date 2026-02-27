'use server'

import { getCourse } from "@/action/getCourse";
import Loading from "@/component/common/ui/Loading";
import PageTitle from "@/component/common/ui/PageTitle";
import CourseDetail from "@/component/content/course/[courseId]/CourseDetail";
import { Suspense } from "react";

export default async function CourseDetailPage({ params }: { params: { courseId: string } }) {
    const { courseId } = await params;
    let course = null;
    let errorMessage: string | null = null;

    try {
        course = await getCourse(Number(courseId));
    } catch (error) {
        console.log(error);
        errorMessage = error instanceof Error ? error.message : "강의 조회 중 오류가 발생했습니다.";
    }

    return (
        <>
            <PageTitle title="강의 상세" />

            <Suspense fallback={<Loading />}>
                <CourseDetail course={course} errorMessage={errorMessage} />
            </Suspense>
        </>
    )
}