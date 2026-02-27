'use client'

import { useQueryClient, useSuspenseInfiniteQuery } from "@tanstack/react-query";
import { useRouter, useSearchParams } from "next/navigation";
import { Fragment, useCallback, useEffect, useMemo, useState } from "react";
import { useInView } from "react-intersection-observer";
import { toast } from "react-toastify";

import { enrollCourseBatch } from "@/action/enrollCourseBatch";
import { courseListQueryOptions } from "@/features/course/query/courseQuery";
import Column from "@/shared/components/flexBox/Column";
import Row from "@/shared/components/flexBox/Row";
import { BottomButton } from "@/shared/components/ui/BottomButton";
import { SelectableList } from "@/shared/components/ui/SelectableList";
import { HEADER_HEIGHT, PAGE_TITLE_HEIGHT } from "@/shared/libs/constants/constants";
import { cn } from "@/shared/libs/utils/cn";
import CourseListSkeleton from "./CourseListSkeleton";
import { useQueryParams } from "@/shared/hooks/useQueryParams";

export type CourseListSort = 'recent' | 'popular' | 'rate';
const COURSE_LIST_HEIGHT = `calc(100vh - ${HEADER_HEIGHT}px - ${PAGE_TITLE_HEIGHT}px)`

export default function CourseList() {
    const router = useRouter()
    const { setParam } = useQueryParams()
    const searchParams = useSearchParams()
    const sort = searchParams.get("sort") as CourseListSort
    const isSelectable = searchParams.get("select") === "true"

    const { ref: upperTriggerRef, inView: upperInView } = useInView()
    const { ref: lowerTriggerRef, inView: lowerInView } = useInView()

    const [enrollCourseList, setEnrollCourseList] = useState<number[]>([]);
    const [processing, setProcessing] = useState(false);

    const {
        data: courseListData,
        fetchNextPage: fetchNextPageCourseList,
        hasNextPage: hasNextPageCourseList,
        isFetching: isFetchingCourseList,
        isFetchingNextPage: isFetchingNextPageCourseList,
        refetch: refetchCourseList,
    } = useSuspenseInfiniteQuery(courseListQueryOptions(sort))
    const queryClient = useQueryClient()

    // 결과값 중복 발생 -> 결과값 파싱하여 중복 제거
    const courseList = useMemo(() => {
        if (!courseListData) return [];
        const list = courseListData.pages.flatMap((page) => page?.content) ?? [];

        const uniqueById = new Map();

        for (const item of list) {
            if (!item) continue;
            if ("id" in item) {
                uniqueById.set(item.id, item);
            }
        }

        return Array.from(uniqueById.values());
    }, [courseListData]);

    useEffect(() => {
        if ((upperInView || lowerInView) && hasNextPageCourseList) {
            fetchNextPageCourseList()
        }
    }, [upperInView, lowerInView])

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

            if (result.failed && result.failed.length > 0) {
                result.failed.forEach((item) => {
                    toast.error(item.reason ?? `강의 수강 신청에 실패했습니다: ${item.courseId}`);
                });
            }
            if (result.success && result.success.length > 0) {
                toast.success(`${result.success.length}개의 강의를 수강 신청했습니다.`);
                setParam("select", null)

                queryClient.setQueryData(courseListQueryOptions(sort).queryKey, (old: any) => {
                    return {
                        ...old,
                        pages: old.pages.map((page: any) => {
                            return { ...page, content: page.content.map((item: any) => {
                                const successItem = result.success.find((success: any) => success.courseId === item.id)
                                if (!successItem) return item;
                                const currentStudents = item.currentStudents + 1;
                                const isFull = currentStudents >= item.maxStudents;
                                return { ...item, currentStudents, isFull  }
                            }) }
                        })
                    }
                })
            }

        } catch (error) {
            console.error(error);
        } finally {
            setProcessing(false);
        }
    }

    const handleClickCourseItem = useCallback((id: number) => {
        if (isSelectable) {
            handleEnrollCourseChange(id);
        } else {
            router.push(`/course/${id}`);
        }
    }, [isSelectable])

    if (!Array.isArray(courseList)) return null

    return (
        <Column gap={20} style={{ height: COURSE_LIST_HEIGHT, maxHeight: COURSE_LIST_HEIGHT }}>
            
            <SelectableList.Container
                className={cn(
                    'overflow-y-scroll pb-[100px] flex-shrink-0 h-full relative',
                )}
                style={{ marginRight: 'calc(var(--scrollbar-width) * -1)' }}
            >
                {courseList.map((item, index) => {
                    if (item === undefined) return null;
                    return (
                        <Fragment key={item.id}>
                            {index === courseList.length - 4 && <div key={-1} ref={upperTriggerRef} className='w-full h-1' />}
                            <SelectableList.Item
                                key={isSelectable ? 'selectable' : 'unselectable'}
                                selected={enrollCourseList.includes(item.id)}
                                selectable={isSelectable}
                                disabled={isSelectable && item.isFull}
                                onSelect={() => handleClickCourseItem(item.id)}
                            >
                                <Column gap={10} className={cn("w-full h-full border border-neutral-300 rounded-lg p-2 select-none", item.isFull ? "opacity-30" : "")}>
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
                <div key={-1} ref={lowerTriggerRef} className='w-full h-5' />
                {(isFetchingNextPageCourseList) && (
                    <CourseListSkeleton />
                )}
                {!hasNextPageCourseList && !isFetchingCourseList && (
                    <Row className='w-full justify-center items-center h-[80px]'>
                        <p className='text-sm'>모든 강의를 불러왔습니다.</p>
                    </Row>
                )}
            </SelectableList.Container>
            {isSelectable && (
                <BottomButton.Container>
                    <BottomButton.Button onClick={handleEnrollCourse} processing={processing}>수강 신청</BottomButton.Button>
                </BottomButton.Container>
            )}
        </Column>
    )
}