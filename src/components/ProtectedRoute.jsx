import { Navigate, useLocation } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'

function ProtectedRoute({ children }) {
  const location = useLocation()
  const { isAuthenticated, canAccessInternal } = useAuth()

  if (!isAuthenticated) {
    return <Navigate to="/internal/login" replace state={{ from: location.pathname }} />
  }

  if (!canAccessInternal) {
    return <Navigate to="/" replace />
  }

  return children
}

export default ProtectedRoute
