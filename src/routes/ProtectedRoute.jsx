import { Navigate, useLocation, Outlet } from 'react-router-dom'
import { useSelector } from 'react-redux'
import Spinner from '../shared/components/ui/Spinner'

export default function ProtectedRoute({ requiredRole }) {
    const { user, initialized } = useSelector((s) => s.auth)
    const location = useLocation()

    if (!initialized) {
        return (
            <div className="flex h-screen items-center justify-center">
                <Spinner size="lg" />
            </div>
        )
    }

    if (!user) {
        return <Navigate to="/login" state={{ from: location }} replace />
    }

    if (requiredRole && user.role !== requiredRole) {
        return <Navigate to="/" replace />
    }

    return <Outlet />
}