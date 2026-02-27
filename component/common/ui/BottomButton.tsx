import { PADDING } from "@/lib/constants/constants";
import ButtonComponent, { ButtonProps } from "./Button";

export namespace BottomButton {
    export type BottomButtonContainerProps = ButtonProps & {
        children?: React.ReactNode;
    }

    export type BottomButtonProps = ButtonProps & {
        children?: React.ReactNode;
    }

    export function Container({ children }: BottomButtonContainerProps) {
        return (
            <div className='absolute bottom-0 left-0 w-full' style={{ paddingBottom: `${PADDING + 20}px` }}>
                {children}
            </div>
        )
    }

    export function Button({ children, ...rest }: BottomButtonProps) {
        return (
            <ButtonComponent {...rest}>{children}</ButtonComponent>
        )
    }
}