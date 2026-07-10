import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ChartBar, ClockCountdown, ListChecks } from '@phosphor-icons/react'
import { Button } from '@/components/ui/Button'
import { PageContainer } from '@/components/ui/PageContainer'
import { logOut, onAuthStateChange, type AuthUser } from '@/lib/auth'
import { ko } from '@/i18n'

const featureIcons = [ClockCountdown, ListChecks, ChartBar]
const features = ko.home.features.map((feature, i) => ({ ...feature, icon: featureIcons[i] }))

export default function Home() {
  const navigate = useNavigate()
  const [user, setUser] = useState<AuthUser | null>(null)

  useEffect(() => {
    return onAuthStateChange(setUser)
  }, [])

  async function handleLogout() {
    await logOut()
  }

  return (
    <div className="relative flex min-h-dvh flex-col items-center justify-center gap-14 bg-background px-8 py-20 text-center">
      <div className="absolute right-8 top-8 flex items-center gap-4 text-base">
        {user ? (
          <>
            <span className="text-muted-foreground">{ko.home.greeting(user.email)}</span>
            <button type="button" onClick={handleLogout} className="cursor-pointer text-primary hover:underline">
              {ko.home.logout}
            </button>
          </>
        ) : (
          <>
            <button
              type="button"
              onClick={() => navigate('/login')}
              className="cursor-pointer text-muted-foreground hover:underline"
            >
              {ko.home.login}
            </button>
            <button
              type="button"
              onClick={() => navigate('/signup')}
              className="cursor-pointer text-primary hover:underline"
            >
              {ko.home.signup}
            </button>
          </>
        )}
      </div>

      <div className="flex flex-col items-center gap-8">
        <h1 className="max-w-4xl text-4xl font-bold tracking-tight text-foreground sm:text-6xl lg:text-7xl">
          {ko.home.titlePrefix} <span className="text-primary">{ko.home.titleHighlight}</span> {ko.home.titleSuffix}
        </h1>
        <p className="max-w-2xl text-2xl text-muted-foreground">{ko.home.description}</p>
        <div className="flex flex-wrap items-center justify-center gap-4">
          <Button onClick={() => navigate('/games')} className="px-14 py-6 text-xl">
            {ko.home.start}
          </Button>
        </div>
      </div>

      <PageContainer className="grid grid-cols-1 gap-8 sm:grid-cols-3">
        {features.map((feature) => (
          <div
            key={feature.title}
            className="flex flex-col items-center gap-4 rounded-2xl border border-border bg-card p-12"
          >
            <span className="flex h-20 w-20 items-center justify-center rounded-full bg-primary/10 text-primary">
              <feature.icon size={40} weight="bold" />
            </span>
            <h2 className="text-xl font-semibold text-foreground">{feature.title}</h2>
            <p className="text-base text-muted-foreground">{feature.description}</p>
          </div>
        ))}
      </PageContainer>
    </div>
  )
}
