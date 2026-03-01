import React from 'react'

import Column from '@/shared/components/flexBox/Column'
import { InvalidResult } from '@/shared/validation/types'

type BaseProps = {
  label: string
  error?: InvalidResult | null
  className?: string
  required?: boolean
  inputWrapper?: (content: React.ReactNode) => React.ReactNode
}

export type LabelInputProps = BaseProps &
  (
    | ({ elem?: 'input' } & React.InputHTMLAttributes<HTMLInputElement>)
    | ({ elem: 'textarea' } & React.TextareaHTMLAttributes<HTMLTextAreaElement>)
  )

const inputClassName =
  'w-full p-2 border border-[var(--background-quaternary)] outline-none focus:border-[var(--background-secondary)] rounded-lg'

const labelId = (name: string | undefined) => (name ? `label-${name}` : undefined)

export default function LabelInput({ label, className, error, elem = 'input', inputWrapper, required = false, ...rest }: LabelInputProps) {
  const resolvedClassName = `${inputClassName} ${className ?? ''}`
  const id = labelId(rest.name as string)

  const inputOrTextarea =
    elem === 'textarea' ? (
      <textarea
        autoComplete="off"
        className={resolvedClassName}
        id={id}
        aria-labelledby={id}
        {...(rest as React.TextareaHTMLAttributes<HTMLTextAreaElement>)}
      />
    ) : (
      <input
        autoComplete="off"
        className={resolvedClassName}
        id={id}
        aria-labelledby={id}
        {...(rest as React.InputHTMLAttributes<HTMLInputElement>)}
      />
    )

  return (
    <Column gap={6} className="relative">
      <label id={id} className="text-sm" htmlFor={id}>
        {label}
        {required && <span className="text-red-500 ml-0.5">*</span>}
      </label>
      {inputWrapper ? inputWrapper(inputOrTextarea) : inputOrTextarea}
      {error?.errors?.[rest.name as string] && (
        <p className="text-[12px] text-red-500 absolute bottom-[-18px]">{error.errors[rest.name as string]}</p>
      )}
    </Column>
  )
}
