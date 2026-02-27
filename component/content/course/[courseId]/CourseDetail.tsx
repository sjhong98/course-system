'use client'

import { enrollCourse } from "@/action/enrollCourse";
import PaddingHorizontalOverrideContainer from "@/component/common/container/PaddingHorizontalOverrideContainer";
import Column from "@/component/common/flexBox/Column";
import Row from "@/component/common/flexBox/Row";
import { BottomButton } from "@/component/common/ui/BottomButton";
import Error from "@/component/common/ui/Error";
import { cn } from "@/lib/utils/cn";
import { ApiResponse } from "@/lib/utils/typeGenerator";
import dayjs from "dayjs";
import { useState } from "react";
import { toast } from "react-toastify";

type CourseDetailProps = {
    course: ApiResponse<"/api/courses/{courseId}", "get"> | null;
    errorMessage: string | null;
}

export default function CourseDetail({ course, errorMessage }: CourseDetailProps) {
    const [processing, setProcessing] = useState(false);

    const handleEnroll = async () => {
        try {
            if (!course) return;
            setProcessing(true);
            const result = await enrollCourse(course.id!);
            
            if (result) {
                toast.success("수강 신청이 완료되었습니다.");
            }
        } catch (error) {
            const message = (error as Error).message ?? "수강 신청에 실패했습니다.";
            toast.error(message);
        } finally {
            setProcessing(false);
        }
    }

    return errorMessage || !course ? (
        <Error message={errorMessage ?? undefined} />
    ) : (
        <Column gap={12} className="w-full h-full">
            <PaddingHorizontalOverrideContainer paddingHorizontal className="bg-[var(--background-tertiary)] py-6 flex flex-col gap-8">
                <Column gap={4}>
                    <h1 className="text-3xl font-bold">{course.title}</h1>
                    <p className="text-sm text-gray-500">{course.description}</p>
                </Column>
                <Row className="w-full justify-between">
                    <p className="text-sm">강사 {course.instructorName}</p>
                    <p className="text-sm text-gray-500">{dayjs(course.createdAt).format("M월 D일")} 등록됨</p>
                </Row>
            </PaddingHorizontalOverrideContainer>
            <Column gap={6} className="w-full items-end">
                <p className={cn("text-2xl font-bold", course.isFull ? "opacity-30" : "")}>{course.price?.toLocaleString()}원</p>
                {course.isFull ? (
                    <Column>
                        <p>정원 마감</p>
                    </Column>
                ) : (
                    <p>{course.availableSeats}개 남았습니다.</p>
                )}
            </Column>

            <BottomButton.Container>
                <BottomButton.Button disabled={course.isFull} processing={processing} onClick={handleEnroll}>수강 신청</BottomButton.Button>
            </BottomButton.Container>
        </Column>
    )
}