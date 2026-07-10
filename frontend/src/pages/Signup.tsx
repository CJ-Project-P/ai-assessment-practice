import { useState, type FormEvent } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Button } from '@/components/ui/Button'
import { signUp } from '@/lib/auth'
import { ko } from '@/i18n'

export default function Signup() {
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [submitting, setSubmitting] = useState(false)
  const [confirmationSent, setConfirmationSent] = useState(false)

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    setError(null)
    setSubmitting(true)
    const result = await signUp(email, password)
    setSubmitting(false)
    if (!result.ok) {
      setError(result.error)
      return
    }
    if (result.needsEmailConfirmation) {
      setConfirmationSent(true)
      return
    }
    navigate('/')
  }

  if (confirmationSent) {
    return (
      <div className="flex min-h-dvh flex-col items-center justify-center gap-6 bg-background px-6 py-20 text-center">
        <h1 className="text-3xl font-bold text-foreground">{ko.auth.needsEmailConfirmation}</h1>
        <Link to="/login" className="text-base text-primary hover:underline">
          {ko.signup.loginLink}
        </Link>
      </div>
    )
  }

  return (
    <div className="flex min-h-dvh flex-col items-center justify-center gap-10 bg-background px-6 py-20">
      <h1 className="text-4xl font-bold text-foreground">{ko.signup.title}</h1>
      <form onSubmit={handleSubmit} className="flex w-full max-w-md flex-col gap-5">
        <input
          type="email"
          placeholder={ko.signup.emailPlaceholder}
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          autoComplete="email"
          className="rounded-xl border border-border bg-card px-5 py-4 text-lg text-foreground focus:border-primary focus:outline-none"
        />
        <input
          type="password"
          placeholder={ko.signup.passwordPlaceholder}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          autoComplete="new-password"
          className="rounded-xl border border-border bg-card px-5 py-4 text-lg text-foreground focus:border-primary focus:outline-none"
        />
        {error && <p className="text-base text-destructive">{error}</p>}
        <Button type="submit" disabled={submitting} className="mt-2 px-8 py-4 text-lg">
          {submitting ? ko.signup.submitting : ko.signup.submit}
        </Button>
      </form>
      <p className="text-base text-muted-foreground">
        {ko.signup.hasAccount}{' '}
        <Link to="/login" className="text-primary hover:underline">
          {ko.signup.loginLink}
        </Link>
      </p>
      <Link to="/" className="text-base text-muted-foreground hover:underline">
        {ko.signup.home}
      </Link>
    </div>
  )
}
