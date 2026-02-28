import { CourseListSort } from '../hooks/useCourseList'

export function parseCourseListSort(searchParams: URLSearchParams): CourseListSort {
  const sort = ['recent', 'popular', 'rate'].includes(searchParams.get('sort') ?? '')
    ? (searchParams.get('sort') as CourseListSort)
    : 'recent'

  return sort
}
