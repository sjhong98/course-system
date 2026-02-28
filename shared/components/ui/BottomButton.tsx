import { PADDING } from '@/shared/libs/constants/constants'
import { cn } from '@/shared/libs/utils/cn'
import ButtonComponent, { ButtonProps } from './Button'

export namespace BottomButton {
  export type BottomButtonContainerProps = ButtonProps & {
    children?: React.ReactNode
  }

  export type BottomButtonProps = ButtonProps & {
    className?: string
    children?: React.ReactNode
  }

  export function Container({ children }: BottomButtonContainerProps) {
    return (
      <div className="absolute bottom-0 left-0 w-full" style={{ paddingBottom: `${PADDING + 20}px` }}>
        {children}
      </div>
    )
  }

  export function Button({ children, className, ...rest }: BottomButtonProps) {
    return (
      <ButtonComponent className={cn(className, 'min-h-[40px]')} {...rest}>
        {children}
      </ButtonComponent>
    )
  }
}
