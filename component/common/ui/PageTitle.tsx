export default function PageTitle({ title }: { title: string }) {
  return <div className='h-[50px] flex items-center justify-start'><p className='text-xl'>{title}</p></div>;
} 