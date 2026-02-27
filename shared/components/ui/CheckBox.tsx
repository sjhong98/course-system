import Row from "../flexBox/Row";

export type CheckBoxProps = React.InputHTMLAttributes<HTMLInputElement> & {
    label?: string;
    onChange?: (e?: any) => void;
};

export default function CheckBox({ label, className, onChange, ...rest }: CheckBoxProps) {
    return (
        <Row gap={8} className={`items-center ${className ?? ""}`} onClick={() => onChange?.()}>
            <input type='checkbox' className="w-4 h-4 p-0.5 border border-neutral-300 rounded-lg appearance-none checked:bg-[var(--background-secondary)] checked:border-[var(--background-secondary)] checked:bg-clip-content cursor-pointer" {...rest} onChange={(e) => onChange?.(e)} />
            {label && <label className='text-sm cursor-pointer'>{label}</label>}
        </Row>
    )
}