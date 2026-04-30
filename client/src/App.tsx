import { Navigate, Route, Routes } from 'react-router-dom'
import { Layout } from './components/Layout'
import { Home } from './pages/Home'
import { ListeningPage } from './pages/ListeningPage'
import { ReadingPage } from './pages/ReadingPage'
import { SpeakingPage } from './pages/SpeakingPage'
import { WritingPage } from './pages/WritingPage'
import { ScoresPage } from './pages/ScoresPage'
import { LoginPage } from './pages/LoginPage'
import { RegisterPage } from './pages/RegisterPage'
import { ProtectedRoute } from './components/ProtectedRoute'

export default function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route
          index
          element={
            <ProtectedRoute>
              <Home />
            </ProtectedRoute>
          }
        />
        <Route
          path="listening"
          element={
            <ProtectedRoute>
              <ListeningPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="reading"
          element={
            <ProtectedRoute>
              <ReadingPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="writing"
          element={
            <ProtectedRoute>
              <WritingPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="speaking"
          element={
            <ProtectedRoute>
              <SpeakingPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="scores"
          element={
            <ProtectedRoute>
              <ScoresPage />
            </ProtectedRoute>
          }
        />
        <Route path="login" element={<LoginPage />} />
        <Route path="register" element={<RegisterPage />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Route>
    </Routes>
  )
}
