'use client'

import { useQueryClient } from '@tanstack/react-query'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { toast } from 'react-toastify'

import { createCourse } from '@/action/createCourse'
import { validateCourseCreateForm } from '@/features/course/validation/createCourse'
import Column from '@/shared/components/flexBox/Column'
import { BottomButton } from '@/shared/components/ui/BottomButton'
import LabelInput from '@/shared/components/ui/LabelInput'
import { errorHandler } from '@/shared/libs/utils/errorHandler'
import parseNumber from '@/shared/libs/utils/parseNumber'
import { ApiRequest } from '@/shared/libs/utils/typeGenerator'
import type { InvalidResult } from '@/shared/validation/types'
import { apiResponseHandler } from '@/shared/libs/utils/apiResponseHandler'
import LabelInputWithSuffixText from '@/shared/components/ui/LabelInputWithSuffixText'

type CourseCreateForm = ApiRequest<'/api/courses', 'post'>

export default function CourseCreateForm() {
  const router = useRouter()
  const queryClient = useQueryClient()

  const [courseCreateForm, setCourseCreateForm] = useState<CourseCreateForm>({
    title: '',
    description: '',
    instructorName: '',
    maxStudents: 1,
    price: 0,
  })
  const [error, setError] = useState<InvalidResult | null>(null)
  const [processing, setProcessing] = useState(false)

  useEffect(() => {
    const role = localStorage.getItem('role')
    if (role !== 'INSTRUCTOR') {
      window.alert('강사만 강의를 개설할 수 있습니다.')
      router.push('/course/list')
    }
    const name = localStorage.getItem('name')
    if (name) {
      setCourseCreateForm({
        ...courseCreateForm,
        instructorName: name,
      })
    }
  }, [])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setCourseCreateForm({
      ...courseCreateForm,
      [e.target.name]:
        e.target.getAttribute('data-type') === 'number'
          ? parseNumber(e as React.ChangeEvent<HTMLInputElement>, Number(courseCreateForm[e.target.name as keyof CourseCreateForm]))
          : e.target.value,
    })
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    const toastId = 'create-course'
    try {
      e.preventDefault()
      setProcessing(true)
      const result = validateCourseCreateForm(courseCreateForm)
      if (result.ok === false) {
        setError(result)
        return
      }
      setError(null)
      apiResponseHandler(async () => await createCourse(result.data), { key: toastId })
      await queryClient.invalidateQueries({ queryKey: ['courses'] })
      router.push('/course/list')
      toast.success('강의 등록에 성공했습니다.')
    } catch (error) {
      errorHandler(error, { key: toastId, message: '강의 등록에 실패했습니다.' })
    } finally {
      setProcessing(false)
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <Column gap={20}>
        <LabelInput label="강의명" name="title" value={courseCreateForm.title} onChange={handleChange} error={error} required />
        <LabelInput
          label="강의 설명"
          name="description"
          elem="textarea"
          value={courseCreateForm.description}
          onChange={handleChange}
          error={error}
        />
        <LabelInputWithSuffixText
          label="수강 인원"
          name="maxStudents"
          data-type="number"
          value={courseCreateForm.maxStudents.toLocaleString()}
          onChange={handleChange}
          error={error}
          suffix="명"
          required
        />
        <LabelInputWithSuffixText
          label="가격"
          name="price"
          data-type="number"
          value={courseCreateForm.price.toLocaleString()}
          onChange={handleChange}
          error={error}
          suffix="원"
          required
        />
      </Column>
      <BottomButton.Container>
        <BottomButton.Button processing={processing}>강의 개설</BottomButton.Button>
      </BottomButton.Container>
    </form>
  )
}
