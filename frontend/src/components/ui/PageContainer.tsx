import type { HTMLAttributes } from 'react'
import { cn } from '@/lib/utils'

type PageContainerProps = HTMLAttributes<HTMLDivElement>

/** 화면 너비를 꽉 채우는 공통 컨텐츠 컨테이너. 4K 이상 초대형 모니터만 대비해 넉넉한 상한선을 둔다. */
export function PageContainer({ className, ...props }: PageContainerProps) {
  return <div className={cn('mx-auto w-full max-w-[1800px]', className)} {...props} />
}
