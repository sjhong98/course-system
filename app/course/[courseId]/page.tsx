'use server'

import { getCourse } from "@/action/getCourse";

import CourseDetail from "@/features/course/components/CourseDetail";
import PageTitle from "@/shared/components/ui/PageTitle";

export default async function CourseDetailPage({ params }: { params: { courseId: string } }) {
    const { courseId } = await params;
    let course = null;
    let errorMessage: string | null = null;

    try {
        course = await getCourse(Number(courseId));
    } catch (error) {
        errorMessage = error instanceof Error ? error.message : "강의 조회 중 오류가 발생했습니다.";
    }

    return (
        <>
            <PageTitle title="강의 상세" />
            <CourseDetail course={course} errorMessage={errorMessage} />
        </>
    )
}