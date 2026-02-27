import { PAGE_TITLE_HEIGHT } from "@/lib/constants/constants";

export default function PageTitle({ title }: { title: string }) {
  return <div className='flex items-center justify-start' style={{ height: `${PAGE_TITLE_HEIGHT}px` }}><p className='text-lg font-semibold'>{title}</p></div>;
} 