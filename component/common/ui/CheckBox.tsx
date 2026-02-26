import Row from "../flexBox/Row";

type CheckBoxProps = React.InputHTMLAttributes<HTMLInputElement> & {
    label: string;
};

export default function CheckBox({ label, className, ...rest }: CheckBoxProps) {
    return (
        <Row gap={8} className={`items-center ${className ?? ""}`}>
            <input type='checkbox' className="w-3 h-3 outline outline-offset-[2px] outline-neutral-300 rounded-lg appearance-none checked:bg-neutral-500 checked:outline-neutral-500 cursor-pointer" {...rest} />
            <label className='text-sm'>{label}</label>
        </Row>
    )
}