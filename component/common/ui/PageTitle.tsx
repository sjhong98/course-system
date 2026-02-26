export default function PageTitle({ title }: { title: string }) {
  return <div className='h-[50px] flex items-center justify-start'><p className='text-lg font-semibold'>{title}</p></div>;
} 