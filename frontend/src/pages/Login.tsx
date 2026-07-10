import { useState, type FormEvent } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Button } from '@/components/ui/Button'
import { logIn } from '@/lib/auth'
import { ko } from '@/i18n'

export default function Login() {
  const navigate = useNavigate()
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)

  function handleSubmit(e: FormEvent) {
    e.preventDefault()
    const result = logIn(username, password)
    if (!result.ok) {
      setError(result.error)
      return
    }
    navigate('/')
  }

  return (
    <div className="flex min-h-dvh flex-col items-center justify-center gap-10 bg-background px-6 py-20">
      <h1 className="text-4xl font-bold text-foreground">{ko.login.title}</h1>
      <form onSubmit={handleSubmit} className="flex w-full max-w-md flex-col gap-5">
        <input
          type="text"
          placeholder={ko.login.idPlaceholder}
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          autoComplete="username"
          className="rounded-xl border border-border bg-card px-5 py-4 text-lg text-foreground focus:border-primary focus:outline-none"
        />
        <input
          type="password"
          placeholder={ko.login.passwordPlaceholder}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          autoComplete="current-password"
          className="rounded-xl border border-border bg-card px-5 py-4 text-lg text-foreground focus:border-primary focus:outline-none"
        />
        {error && <p className="text-base text-destructive">{error}</p>}
        <Button type="submit" className="mt-2 px-8 py-4 text-lg">
          {ko.login.submit}
        </Button>
      </form>
      <p className="text-base text-muted-foreground">
        {ko.login.noAccount}{' '}
        <Link to="/signup" className="text-primary hover:underline">
          {ko.login.signupLink}
        </Link>
      </p>
      <Link to="/" className="text-base text-muted-foreground hover:underline">
        {ko.login.home}
      </Link>
    </div>
  )
}
