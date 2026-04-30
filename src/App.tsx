import { Navigate, Route, Routes } from 'react-router-dom'
import { Layout } from './components/Layout'
import { Home } from './pages/Home'
import { ListeningPage } from './pages/ListeningPage'
import { ReadingPage } from './pages/ReadingPage'
import { SpeakingPage } from './pages/SpeakingPage'
import { WritingPage } from './pages/WritingPage'
import { ScoresPage } from './pages/ScoresPage'

export default function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route index element={<Home />} />
        <Route path="listening" element={<ListeningPage />} />
        <Route path="reading" element={<ReadingPage />} />
        <Route path="writing" element={<WritingPage />} />
        <Route path="speaking" element={<SpeakingPage />} />
        <Route path="scores" element={<ScoresPage />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Route>
    </Routes>
  )
}
