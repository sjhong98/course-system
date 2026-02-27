'use client'

import { enrollCourseBatch } from "@/action/enrollCourseBatch";
import Column from "@/component/common/flexBox/Column";
import Row from "@/component/common/flexBox/Row";
import { BottomButton } from "@/component/common/ui/BottomButton";
import Button from "@/component/common/ui/Button";
import CheckBox from "@/component/common/ui/CheckBox";
import { SelectableList } from "@/component/common/ui/SelectableList";
import Skeleton from "@/component/common/ui/Skeleton";
import { HEADER_HEIGHT, PAGE_TITLE_HEIGHT } from "@/lib/constants/constants";
import { courseListQueryOptions } from "@/lib/query/courseQuery";
import { cn } from "@/lib/utils/cn";
import { useInfiniteQuery } from "@tanstack/react-query";
import { FilterIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import { Fragment, ReactNode, useCallback, useEffect, useMemo, useState } from "react";
import { useInView } from "react-intersection-observer";
import { toast } from "react-toastify";

export type CourseListSort = 'recent' | 'popular' | 'rate';
const COURSE_LIST_HEIGHT = `calc(100vh - ${HEADER_HEIGHT}px - ${PAGE_TITLE_HEIGHT}px)`

type CourseHeaderButtonProps = {
    children: ReactNode;
    onClick: () => void;
    active?: boolean;
};

function CourseHeaderButton({ children, onClick, active }: CourseHeaderButtonProps) {
    return (
        <Button
            className={cn(
                'p-1 px-1.5 text-sm whitespace-nowrap ',
                active ? '!bg-[var(--foreground)] !text-[var(--background-tertiary)]' : '!bg-[var(--background-tertiary)] !text-[var(--foreground)]'
            )}
            onClick={onClick}
        >
            {children}
        </Button>
    );
}

export default function CourseList() {
    const router = useRouter()
    const { ref: upperTriggerRef, inView: upperInView } = useInView()
    const { ref: lowerTriggerRef, inView: lowerInView } = useInView()

    const [sort, setSort] = useState<CourseListSort>("recent");
    const [enrollCourseList, setEnrollCourseList] = useState<number[]>([]);
    const [isFilterOpen, setIsFilterOpen] = useState(false);
    const [isSelectable, setIsSelectable] = useState(false);
    const [processing, setProcessing] = useState(false);

    const {
        data: courseListData,
        fetchNextPage: fetchNextPageCourseList,
        hasNextPage: hasNextPageCourseList,
        isFetching: isFetchingCourseList,
        isFetchingNextPage: isFetchingNextPageCourseList,
        refetch: refetchCourseList,
    } = useInfiniteQuery(courseListQueryOptions(sort))

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

            if (result.failed && result.failed.length > 0) {
                result.failed.forEach((item) => {
                    toast.error(item.reason ?? `강의 수강 신청에 실패했습니다: ${item.courseId}`);
                });
            }
            if (result.success && result.success.length > 0) {
                toast.success(`${result.success.length}개의 강의를 수강 신청했습니다.`);
                refetchCourseList();
                setIsSelectable(false);
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
            <Row gap={4} className='absolute top-2 right-0'>
                <CourseHeaderButton onClick={() => setIsFilterOpen(!isFilterOpen)} active={isFilterOpen}>
                    <FilterIcon className='w-4 h-4' />
                </CourseHeaderButton>
                <CourseHeaderButton onClick={() => setIsSelectable(!isSelectable)} active={isSelectable}>수강 신청</CourseHeaderButton>
                <CourseHeaderButton onClick={() => router.push('/course/create')} active>강의 개설</CourseHeaderButton>
            </Row>
            {isFilterOpen && (
                <Row className='absolute right-0 w-full py-2 bg-[var(--background)] z-[100] border-b border-[var(--background-tertiary)]' style={{ top: `${PAGE_TITLE_HEIGHT}px` }}>
                    {sortList.map((item) => (
                        <CheckBox key={item.value} label={item.label} className='flex-1' checked={sort === item.value} onChange={() => {
                            setSort(item.value as CourseListSort)
                        }} />
                    ))}
                </Row>
            )}
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
                {(isFetchingNextPageCourseList || isFetchingCourseList) && (
                    <Column gap={10}>
                        <Skeleton height={80} />
                        <Skeleton height={80} />
                        <Skeleton height={80} />
                    </Column>
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