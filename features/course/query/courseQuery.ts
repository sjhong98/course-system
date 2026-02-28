import { infiniteQueryOptions } from '@tanstack/react-query'

import { getCourseList } from '@/action/getCourseList'
import { apiResponseHandler } from '@/shared/libs/utils/apiResponseHandler'

export const courseListQueryOptions = (sort: string) =>
  infiniteQueryOptions({
    queryKey: ['courses', sort],
    queryFn: async ({ pageParam }) => {
      return await apiResponseHandler(async () => await getCourseList(pageParam, sort))
    },
    staleTime: 5 * 60 * 1000,
    gcTime: 5 * 60 * 1000,
    initialPageParam: 0,
    retry: 3,
    getNextPageParam: (lastPage) => {
      if (!lastPage || lastPage.last) return undefined
      return (lastPage.pageable?.pageNumber ?? 0) + 1
    },
    placeholderData: {
      pages: [],
      pageParams: [0],
    },
    throwOnError: false,
  })
