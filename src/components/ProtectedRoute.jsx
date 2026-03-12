import { Navigate, useLocation } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'

function ProtectedRoute({ children }) {
  const location = useLocation()
  const { daDangNhap, coTheVaoNoiBo } = useAuth()

  if (!daDangNhap) {
    return <Navigate to="/internal/login" replace state={{ from: location.pathname }} />
  }

  if (!coTheVaoNoiBo) {
    return <Navigate to="/" replace />
  }

  return children
}

export default ProtectedRoute
