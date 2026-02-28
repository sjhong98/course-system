export type CourseListSort = 'recent' | 'popular' | 'rate'

export function parseCourseListSort(searchParams: URLSearchParams): CourseListSort {
  const sort = ['recent', 'popular', 'rate'].includes(searchParams.get('sort') ?? '')
    ? (searchParams.get('sort') as CourseListSort)
    : 'recent'

  return sort
}
