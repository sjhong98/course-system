import { getCourseList } from "@/action/getCourseList"
import { infiniteQueryOptions, keepPreviousData } from "@tanstack/react-query"

export const courseListQueryOptions = (sort: string) =>
    infiniteQueryOptions({
        queryKey: ["courses", sort],
        queryFn: async ({ pageParam }) => {
            return await getCourseList(pageParam, sort);
        },
        staleTime: 5 * 60 * 1000,
        gcTime: 5 * 60 * 1000,
        initialPageParam: 0,
        getNextPageParam: (lastPage) => {
            if (lastPage.last) return undefined
            return (lastPage.pageable?.pageNumber ?? 0) + 1
        },
        placeholderData: {
            pages: [],
            pageParams: [0],
          },
    })