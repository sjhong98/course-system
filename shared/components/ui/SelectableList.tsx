import { cn } from "@/lib/utils/cn";
import Column, { ColumnProps } from "../flexBox/Column";
import Row from "../flexBox/Row";
import CheckBox, { CheckBoxProps } from "./CheckBox";
import { useCallback } from "react";

export namespace SelectableList {
    export type SelectableListContainerProps = ColumnProps & {
        children?: React.ReactNode;
    }

    export type SelectableListItemProps = CheckBoxProps & {
        children?: React.ReactNode;
        selected?: boolean;
        selectable?: boolean;
        className?: string;
        onSelect?: (e?: any) => void;
    }

    export function Container({ children, ...rest }: SelectableListContainerProps) {
        return (
            <Column className={cn("scrollbar-thin flex-shrink-0", rest.className)} {...rest}>
                {children}
            </Column>
        )
    }

    export function Item({ children, selected, selectable = true, onSelect, onChange, ...rest }: SelectableListItemProps) {
        const handleSelect = useCallback(() => {
            if (rest.disabled) return;
            onSelect?.()
        }, [])

        return (
            <Row gap={20} className={cn('transition-all duration-100 mb-[10px]', selectable && rest.disabled ? 'cursor-normal' : 'cursor-pointer')} onClick={handleSelect}>
                {selectable && <CheckBox checked={selected} onChange={handleSelect} {...rest} />}
                {children}
            </Row>
        )
    }
}