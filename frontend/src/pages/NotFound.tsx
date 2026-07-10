import { Link } from 'react-router-dom'
import { ko } from '@/i18n'

export default function NotFound() {
  return (
    <div className="flex min-h-dvh flex-col items-center justify-center gap-3 bg-background px-6 text-center">
      <h1 className="text-4xl font-bold text-foreground">{ko.notFound.title}</h1>
      <p className="text-muted-foreground">{ko.notFound.description}</p>
      <Link to="/" className="text-sm text-primary hover:underline">
        {ko.notFound.backHome}
      </Link>
    </div>
  )
}
