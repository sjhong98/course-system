'use client'

import Column from "@/component/common/flexBox/Column";
import Row from "@/component/common/flexBox/Row";
import { BottomButton } from "@/component/common/ui/BottomButton";
import Button from "@/component/common/ui/Button";
import CheckBox from "@/component/common/ui/CheckBox";
import { SelectableList } from "@/component/common/ui/SelectableList";
import { cn } from "@/lib/utils/cn";
import { ApiResponse } from "@/lib/utils/typeGenerator";
import { useMemo, useState } from "react";

type CourseListResponse = ApiResponse<"/api/courses", "get">;
export type CourseListSort = 'recent' | 'popular' | 'highRate';

export default function CourseList({ initialCourseListResponse }: { initialCourseListResponse: CourseListResponse }) {
    const [sort, setSort] = useState<CourseListSort>("recent");

    const courseItem = {
        id: 1,
        title: "강의 1",
        description: "강의 1 설명",
        instructorName: "강사 1",
        maxStudents: 100,
        currentStudents: 50,
        availableSeats: 50,
        isFull: false,
        price: 10000,
    }

    const course: ApiResponse<"/api/courses/{courseId}", "get">[] = [
        courseItem
    ]

    const sortList = useMemo(() => (
        [
            { label: "최근 등록순", value: "recent" },
            { label: "신청자 많은순", value: "popular" },
            { label: "신청률 높은순", value: "highRate" },
        ]
    ), [])

    if (!Array.isArray(course)) return null
    return (
        <Column gap={20} className='h-full'>
            <Column className='absolute top-0 right-0 '>
                <Button className='px-3'>강의 개설</Button>
            </Column>
            <Row>
                {sortList.map((item) => (
                    <CheckBox key={item.value} label={item.label} className='flex-1' checked={sort === item.value} onChange={() => {
                        setSort(item.value as CourseListSort)
                        console.log('sort')
                    }} />
                ))}
            </Row>
            <SelectableList.Container className='h-[calc(100vh-240px)] overflow-y-scroll pb-[100px]'>
                {course.map((item) => (
                    <SelectableList.Item key={item.id} disabled={item.isFull}>
                        <Column gap={10} className={cn("w-full h-full border border-neutral-300 rounded-lg p-2", item.isFull ? "opacity-50" : "")}>
                            <Row className='w-full justify-between'>
                                <Column>
                                    <p className='line-clamp-1'>{item.title}</p>
                                    <p className='text-[12px] text-neutral-500 line-clamp-1'>{item.description}</p>
                                </Column>
                                <p>{item.price?.toLocaleString()}원</p>
                            </Row>
                            <Row className='w-full justify-between'>
                                <p>강사 {item.instructorName}</p>
                                <p>수강인원&nbsp;&nbsp;{item.currentStudents} / {item.maxStudents}</p>
                            </Row>
                        </Column>
                    </SelectableList.Item>
                ))}
            </SelectableList.Container>
            <BottomButton.Container>
                <BottomButton.Button>수강 신청</BottomButton.Button>
            </BottomButton.Container>
        </Column>
    )
}