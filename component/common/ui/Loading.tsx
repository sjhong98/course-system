import Column from "../flexBox/Column";

export default function Loading() {
    return (
        <Column gap={10}>
            <div className='w-full h-[25px] bg-neutral-100 rounded-lg animate-pulse' />
            <div className='w-full h-[25px] bg-neutral-100 rounded-lg animate-pulse' />
            <div className='w-full h-[25px] bg-neutral-100 rounded-lg animate-pulse' />
        </Column>
    )
}