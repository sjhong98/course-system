export type CourseListSort = 'recent' | 'popular' | 'rate'

// 강의 목록 정렬 파싱
export function parseCourseListSort(searchParams: URLSearchParams): CourseListSort {
  const sort = ['recent', 'popular', 'rate'].includes(searchParams.get('sort') ?? '')
    ? (searchParams.get('sort') as CourseListSort)
    : 'recent'

  return sort
}
