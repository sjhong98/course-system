import { describe, it, expect } from 'vitest'

import { courseListQueryOptions } from '../courseQuery'

type GetNextPageParam = NonNullable<ReturnType<typeof courseListQueryOptions>['getNextPageParam']>
type LastPage = Parameters<GetNextPageParam>[0]

describe('features/course/query/courseQuery', () => {
  describe('courseListQueryOptions', () => {
    it('sort에 따라 queryKey가 달라진다', () => {
      expect(courseListQueryOptions('recent').queryKey).toEqual(['courses', 'recent'])
      expect(courseListQueryOptions('popular').queryKey).toEqual(['courses', 'popular'])
    })

    it('initialPageParam은 0이다', () => {
      expect(courseListQueryOptions('recent').initialPageParam).toBe(0)
    })

    describe('getNextPageParam', () => {
      const getNextPageParam = courseListQueryOptions('recent').getNextPageParam!

      const call = (lastPage: LastPage) => getNextPageParam(lastPage, [] as LastPage[], 0, [])

      it('last가 true면 undefined를 반환한다', () => {
        expect(call({ last: true, pageable: { pageNumber: 0 } } as LastPage)).toBeUndefined()
      })

      it('last가 false면 현재 페이지+1을 반환한다', () => {
        expect(call({ last: false, pageable: { pageNumber: 0 } } as LastPage)).toBe(1)
        expect(call({ last: false, pageable: { pageNumber: 2 } } as LastPage)).toBe(3)
      })

      it('pageable이 없으면 1을 반환한다', () => {
        expect(call({ last: false } as LastPage)).toBe(1)
      })

      it('pageable.pageNumber가 없으면 1을 반환한다', () => {
        expect(call({ last: false, pageable: {} } as LastPage)).toBe(1)
      })
    })
  })
})
