import { useRef } from 'react'
import Row from '../flexBox/Row'

export type CheckBoxProps = React.InputHTMLAttributes<HTMLInputElement> & {
  label?: string
  name?: string
  onChange?: (e?: any) => void
  'aria-label'?: string
}

const checkboxId = (name: string | undefined) => (name ? `checkbox-${name}` : undefined)

export default function CheckBox({ label, name, className, onChange, 'aria-label': ariaLabel, ...rest }: CheckBoxProps) {
  const inputRef = useRef<HTMLInputElement>(null)
  const id = checkboxId(name)
  return (
    <Row
      gap={8}
      className={`items-center ${className ?? ''}`}
      onClick={(e) => {
        if (e.target === e.currentTarget) inputRef.current?.click()
      }}
    >
      <input
        ref={inputRef}
        id={id}
        name={name}
        type="checkbox"
        role="checkbox"
        aria-label={ariaLabel ?? label ?? name}
        className="w-4 h-4 p-0.5 border border-neutral-300 rounded-lg appearance-none checked:bg-[var(--background-secondary)] checked:border-[var(--background-secondary)] checked:bg-clip-content cursor-pointer"
        {...rest}
        onChange={(e) => onChange?.(e)}
      />
      {label && (
        <label htmlFor={id} className="text-sm cursor-pointer">
          {label}
        </label>
      )}
    </Row>
  )
}
