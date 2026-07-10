import { lazy, Suspense } from 'react'
import { Route, Routes } from 'react-router-dom'
import { ko } from '@/i18n'

const Home = lazy(() => import('@/pages/Home'))
const GameSelect = lazy(() => import('@/pages/GameSelect'))
const ModeSelect = lazy(() => import('@/pages/ModeSelect'))
const LearnMode = lazy(() => import('@/pages/LearnMode'))
const PracticeMode = lazy(() => import('@/pages/PracticeMode'))
const ShapeRotateSimulator = lazy(() => import('@/pages/games/ShapeRotateSimulator'))
const SavedShapes = lazy(() => import('@/pages/games/SavedShapes'))
const WrongAnswers = lazy(() => import('@/pages/WrongAnswers'))
const Login = lazy(() => import('@/pages/Login'))
const Signup = lazy(() => import('@/pages/Signup'))
const MyRecords = lazy(() => import('@/pages/MyRecords'))
const NotFound = lazy(() => import('@/pages/NotFound'))

function PageLoading() {
  return (
    <div className="flex min-h-dvh items-center justify-center bg-background">
      <p className="text-muted-foreground">{ko.common.loading}</p>
    </div>
  )
}

function App() {
  return (
    <Suspense fallback={<PageLoading />}>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/games" element={<GameSelect />} />
        <Route path="/games/:gameId" element={<ModeSelect />} />
        <Route path="/games/:gameId/learn" element={<LearnMode />} />
        <Route path="/games/:gameId/practice" element={<PracticeMode />} />
        <Route path="/games/:gameId/simulator" element={<ShapeRotateSimulator />} />
        <Route path="/games/:gameId/simulator/saved" element={<SavedShapes />} />
        <Route path="/wrong-answers" element={<WrongAnswers />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/my-records" element={<MyRecords />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Suspense>
  )
}

export default App
