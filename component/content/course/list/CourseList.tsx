'use client'

import { enrollCourseBatch } from "@/action/enrollCourseBatch";
import Column from "@/component/common/flexBox/Column";
import Row from "@/component/common/flexBox/Row";
import { BottomButton } from "@/component/common/ui/BottomButton";
import Button from "@/component/common/ui/Button";
import CheckBox from "@/component/common/ui/CheckBox";
import { SelectableList } from "@/component/common/ui/SelectableList";
import Skeleton from "@/component/common/ui/Skeleton";
import { courseListQueryOptions } from "@/lib/query/courseQuery";
import { cn } from "@/lib/utils/cn";
import { ApiResponse } from "@/lib/utils/typeGenerator";
import { useInfiniteQuery } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { Fragment, useEffect, useMemo, useState } from "react";
import { useInView } from "react-intersection-observer";

export type CourseListSort = 'recent' | 'popular' | 'rate';

export default function CourseList() {
    const router = useRouter()
    const { ref, inView } = useInView()

    const [sort, setSort] = useState<CourseListSort>("recent");
    const [enrollCourseList, setEnrollCourseList] = useState<number[]>([]);
    const [processing, setProcessing] = useState(false);

    const {
        data: courseListData,
        fetchNextPage,
        hasNextPage,
        isFetching,
        isFetchingNextPage,
    } = useInfiniteQuery(courseListQueryOptions(sort))

    // 결과값 파싱하여 중복 제거
    const courseList = useMemo(() => {
        const list = courseListData?.pages?.flatMap((page) => page.content) ?? [];

        const uniqueById = new Map();

        for (const item of list) {
            if (!item) continue;
            if (!uniqueById.has(item.id)) {
                uniqueById.set(item.id, item);
            }
        }

        return Array.from(uniqueById.values());
    }, [courseListData]);

    useEffect(() => {
        if (inView && hasNextPage) {
            fetchNextPage()
        }
    }, [inView])

    const sortList = useMemo(() => (
        [
            { label: "최근 등록순", value: "recent" },
            { label: "신청자 많은순", value: "popular" },
            { label: "신청률 높은순", value: "rate" },
        ]
    ), [])

    const handleEnrollCourseChange = (id: number) => {
        setEnrollCourseList((prev) => {
            if (prev.includes(id)) {
                return prev.filter((item) => item !== id);
            }
            return [...prev, id];
        });
    }

    const handleEnrollCourse = async () => {
        try {
            setProcessing(true);
            const result = await enrollCourseBatch(enrollCourseList);
            setEnrollCourseList([]);
            // console.log(result.)
            // console.log(result.);


        } catch (error) {
            console.error(error);
        } finally {
            setProcessing(false);
        }
    }

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
            <SelectableList.Container className='h-[calc(100vh-220px)] overflow-y-scroll pb-[100px]'>
                {courseList.map((item, index) => {
                    if (item === undefined) return null;
                    return (
                        <Fragment key={item.id}>
                            {index === courseList.length - 4 && <div ref={ref} key={-1} className='w-full h-5 bg-amber-300' />}
                            <SelectableList.Item selected={enrollCourseList.includes(item.id)} onSelect={() => handleEnrollCourseChange(item.id)}>
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
                        </Fragment>
                    )
                })}
                {(isFetchingNextPage || isFetching) && (
                    <Column gap={10}>
                        <Skeleton height={80} />
                        <Skeleton height={80} />
                        <Skeleton height={80} />
                    </Column>
                )}
                {!hasNextPage && !isFetching && (
                    <Row className='w-full justify-center items-center h-[80px]'>
                        <p className='text-sm'>모든 강의를 불러왔습니다.</p>
                    </Row>
                )}
            </SelectableList.Container>
            <BottomButton.Container>
                <BottomButton.Button onClick={handleEnrollCourse} processing={processing}>수강 신청</BottomButton.Button>
            </BottomButton.Container>
        </Column>
    )
}