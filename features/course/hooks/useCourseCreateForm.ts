'use client'

import { useQueryClient } from '@tanstack/react-query'
import { useRouter } from 'next/navigation'
import { useCallback, useEffect, useState } from 'react'
import { toast } from 'react-toastify'

import { createCourse } from '@/action/createCourse'
import { validateCourseCreateForm } from '@/features/course/validation/createCourse'
import { errorHandler } from '@/shared/libs/utils/errorHandler'
import parseNumber from '@/shared/libs/utils/parseNumber'
import { ApiRequest } from '@/shared/libs/utils/typeGenerator'
import type { InvalidResult } from '@/shared/validation/types'
import { apiResponseHandler } from '@/shared/libs/utils/apiResponseHandler'

type CourseCreateForm = ApiRequest<'/api/courses', 'post'>

const initialForm: CourseCreateForm = {
  title: '',
  description: '',
  instructorName: '',
  maxStudents: 1,
  price: 0,
}

export function useCourseCreateForm() {
  const router = useRouter()
  const queryClient = useQueryClient()

  const [courseCreateForm, setCourseCreateForm] = useState<CourseCreateForm>(initialForm)
  const [error, setError] = useState<InvalidResult | null>(null)
  const [processing, setProcessing] = useState(false)

  useEffect(() => {
    const role = typeof window !== 'undefined' ? localStorage.getItem('role') : null
    if (role !== 'INSTRUCTOR') {
      window.alert('강사만 강의를 개설할 수 있습니다.')
      router.push('/course/list')
      return
    }
    const name = typeof window !== 'undefined' ? localStorage.getItem('name') : null
    if (name) {
      setCourseCreateForm((prev) => ({ ...prev, instructorName: name }))
    }
  }, [router])

  const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setCourseCreateForm((prev) => ({
      ...prev,
      [e.target.name]:
        e.target.getAttribute('data-type') === 'number'
          ? parseNumber(e as React.ChangeEvent<HTMLInputElement>, Number(prev[e.target.name as keyof CourseCreateForm]))
          : e.target.value,
    }))
  }, [])

  const handleSubmit = useCallback(
    async (e: React.FormEvent<HTMLFormElement>) => {
      const toastId = 'create-course'
      e.preventDefault()
      try {
        setProcessing(true)
        const result = validateCourseCreateForm(courseCreateForm)
        if (result.ok === false) {
          setError(result)
          return
        } else {
          setError(null)
        }
        await apiResponseHandler(async () => await createCourse(result.data), { key: toastId })
        await queryClient.invalidateQueries({ queryKey: ['courses'] })
        router.push('/course/list')
        toast.success('강의 등록에 성공했습니다.')
      } catch (err) {
        errorHandler(err, { key: toastId, message: '강의 등록에 실패했습니다.' })
      } finally {
        setProcessing(false)
      }
    },
    [courseCreateForm, queryClient, router],
  )

  return {
    courseCreateForm,
    error,
    processing,
    handleChange,
    handleSubmit,
  }
}
