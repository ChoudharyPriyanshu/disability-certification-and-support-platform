import { Navigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

const ProtectedRoute = ({ children, roles }) => {
    const { isAuthenticated, role } = useAuth()

    if (!isAuthenticated) {
        return <Navigate to="/login" replace />
    }

    if (roles && !roles.includes(role)) {
        // Redirect to appropriate dashboard
        const redirectMap = {
            PWD_USER: '/dashboard',
            ADMIN: '/admin/dashboard',
            DOCTOR: '/doctor/dashboard',
        }
        return <Navigate to={redirectMap[role] || '/login'} replace />
    }

    return children
}

export default ProtectedRoute
