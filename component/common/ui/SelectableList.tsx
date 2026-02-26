import { cn } from "@/lib/utils/cn";
import Column, { ColumnProps } from "../flexBox/Column";
import Row from "../flexBox/Row";
import CheckBox, { CheckBoxProps } from "./CheckBox";

export namespace SelectableList {
    export type SelectableListContainerProps = ColumnProps & {
        children?: React.ReactNode;
    }

    export type SelectableListItemProps = CheckBoxProps & {
        children?: React.ReactNode;
        selected?: string;
        className?: string;
        onSelect?: (item: string) => void;
        onChange?: (e?: any) => void;
    }

    export function Container({ children, gap = 10, ...rest }: SelectableListContainerProps) {
        return (
            <Column gap={gap} className={cn("scrollbar-thin", rest.className)} {...rest}>
                {children}
            </Column>
        )
    }

    export function Item({ children, selected, onSelect, onChange, ...rest }: SelectableListItemProps) {
        return (
            <Row gap={20} className='cursor-pointer' onClick={() => onChange?.()}>
                <CheckBox {...rest} />
                {children}
            </Row>
        )
    }
}