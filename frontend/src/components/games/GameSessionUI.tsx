import type { ReactNode } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { ArrowLeft } from '@phosphor-icons/react'
import { Button } from '@/components/ui/Button'
import { PageContainer } from '@/components/ui/PageContainer'
import { cn } from '@/lib/utils'
import type { Mode } from '@/lib/gameRounds'
import { ko } from '@/i18n'

type GameExitButtonProps = {
  size?: number
  className?: string
}

/** 게임 플레이 화면 상단의 "나가기" 버튼. 클릭 시 진행 상황이 저장되지 않는다는 확인을 거친다. */
export function GameExitButton({ size = 26, className }: GameExitButtonProps) {
  const navigate = useNavigate()

  function handleExit() {
    if (window.confirm(ko.common.exitConfirm)) {
      navigate('/games')
    }
  }

  return (
    <button
      type="button"
      onClick={handleExit}
      className={cn(
        'flex cursor-pointer items-center gap-1 text-xl text-muted-foreground hover:text-foreground hover:underline',
        className,
      )}
    >
      <ArrowLeft size={size} weight="bold" />
      {ko.common.exit}
    </button>
  )
}

type GameResultSummaryProps = {
  mode: Mode
  summaryText: string
  onFinish?: () => void
  showWrongAnswersLink?: boolean
  children?: ReactNode
}

/** 학습/실전 분량 모드가 끝났을 때 보여주는 공용 결과 화면 뼈대. 문제별 결과 목록은 children으로 받는다. */
export function GameResultSummary({
  mode,
  summaryText,
  onFinish,
  showWrongAnswersLink = false,
  children,
}: GameResultSummaryProps) {
  return (
    <PageContainer className="flex flex-col items-center gap-8 py-16">
      <h2 className="text-4xl font-bold text-foreground">
        {mode === 'learn' ? ko.common.learnModeEnd : ko.common.practiceModeEnd}
      </h2>
      <p className="text-xl text-muted-foreground">{summaryText}</p>

      {children}

      <div className="flex flex-wrap items-center justify-center gap-4">
        {onFinish && (
          <Button onClick={onFinish} className="px-8 py-4 text-base">
            {ko.common.restart}
          </Button>
        )}
        <Link to=".." className="text-base text-primary hover:underline">
          {ko.common.backToModeSelect}
        </Link>
        {showWrongAnswersLink && (
          <Link to="/wrong-answers" className="text-base text-primary hover:underline">
            {ko.common.wrongAnswersLink}
          </Link>
        )}
      </div>
    </PageContainer>
  )
}

/** 틀린 문제가 없을 때/있을 때를 공용으로 보여주는 목록 껍데기. */
export function MistakeList<T>({
  mistakes,
  renderItem,
}: {
  mistakes: T[]
  renderItem: (mistake: T, index: number) => ReactNode
}) {
  if (mistakes.length === 0) {
    return <p className="text-lg text-muted-foreground">{ko.common.noMistakes}</p>
  }
  return (
    <div className="grid w-full grid-cols-1 gap-6 sm:grid-cols-2">
      {mistakes.map((mistake, i) => renderItem(mistake, i))}
    </div>
  )
}
