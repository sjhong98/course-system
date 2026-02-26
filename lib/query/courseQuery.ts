import { getCourses } from "@/action/getCourses"
import { infiniteQueryOptions } from "@tanstack/react-query"


export const courseListQueryOptions = infiniteQueryOptions({
    queryKey: ["courses"],
    queryFn: ({ pageParam }) => {
        return getCourses(pageParam)
    },
    initialPageParam: 0,
    getNextPageParam: (lastPage) => {
        if (lastPage.last) return undefined
        return (lastPage.pageable?.pageNumber ?? 0) + 1
      }
})