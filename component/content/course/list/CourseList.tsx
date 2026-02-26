'use client'

import Column from "@/component/common/flexBox/Column";
import Row from "@/component/common/flexBox/Row";
import { BottomButton } from "@/component/common/ui/BottomButton";
import Button from "@/component/common/ui/Button";
import CheckBox from "@/component/common/ui/CheckBox";
import { SelectableList } from "@/component/common/ui/SelectableList";
import { courseListQueryOptions } from "@/lib/query/courseQuery";
import { cn } from "@/lib/utils/cn";
import { ApiResponse } from "@/lib/utils/typeGenerator";
import { useInfiniteQuery } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { useInView } from "react-intersection-observer";

type CourseListResponse = ApiResponse<"/api/courses", "get">;
type CourseItem = CourseListResponse["content"];
export type CourseListSort = 'recent' | 'popular' | 'highRate';

export default function CourseList() {
    const router = useRouter()
    const { ref, inView } = useInView()

    const [sort, setSort] = useState<CourseListSort>("recent");

    const {
        data: courseListData,
        fetchNextPage,
        hasNextPage,
        isFetchingNextPage
    } = useInfiniteQuery(courseListQueryOptions)

    const courseList = useMemo(() => courseListData?.pages?.flatMap((page) => page.content) ?? [], [courseListData])

    useEffect(() => {
        if (inView && hasNextPage) {
            console.log('inView')
            fetchNextPage()
        }
    }, [inView])

    const sortList = useMemo(() => (
        [
            { label: "최근 등록순", value: "recent" },
            { label: "신청자 많은순", value: "popular" },
            { label: "신청률 높은순", value: "highRate" },
        ]
    ), [])

    if (!Array.isArray(courseList)) return null

    return (
        <Column gap={20} className='h-full'>
            <Column className='absolute top-0 right-0 '>
                <Button className='px-3' onClick={() => router.push('/course/create')}>강의 개설</Button>
            </Column>
            <Row>
                {sortList.map((item) => (
                    <CheckBox key={item.value} label={item.label} className='flex-1' checked={sort === item.value} onChange={() => {
                        setSort(item.value as CourseListSort)
                    }} />
                ))}
            </Row>
            <SelectableList.Container className='h-[calc(100vh-240px)] overflow-y-scroll pb-[100px]'>
                {courseList.map((item) => {
                    if (item === undefined) return null;
                    return (
                        <SelectableList.Item key={item.id} disabled={item.isFull}>
                        <Column gap={10} className={cn("w-full h-full border border-neutral-300 rounded-lg p-2", item.isFull ? "opacity-30" : "")}>
                            <Row className='w-full justify-between'>
                                <Column>
                                    <p className='line-clamp-1'>{item.title}</p>
                                    <p className='text-[12px] text-neutral-500 line-clamp-1'>{item.description}</p>
                                </Column>
                                <p>{Number(item.price)?.toLocaleString()}원</p>
                            </Row>
                            <Row className='w-full justify-between'>
                                <p>강사 {item.instructorName}</p>
                                <p>수강인원&nbsp;&nbsp;{item.currentStudents} / {item.maxStudents}</p>
                            </Row>
                        </Column>
                    </SelectableList.Item>
                    )
                })}
                <SelectableList.Item>
                    <div ref={ref} className='w-full h-5 bg-amber-300' />
                </SelectableList.Item>
            </SelectableList.Container>
            <BottomButton.Container>
                <BottomButton.Button>수강 신청</BottomButton.Button>
            </BottomButton.Container>
        </Column>
    )
}