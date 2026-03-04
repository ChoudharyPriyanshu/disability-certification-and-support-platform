import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import { AuthProvider, useAuth } from './context/AuthContext'
import ProtectedRoute from './components/ProtectedRoute'

// Auth pages
import Login from './pages/auth/Login'
import Register from './pages/auth/Register'

// PwD user pages
import UserDashboard from './pages/user/UserDashboard'
import ApplicationForm from './pages/user/ApplicationForm'
import MyApplications from './pages/user/MyApplications'
import ApplicationDetail from './pages/user/ApplicationDetail'
import MyCertificates from './pages/user/MyCertificates'
import SchemesHub from './pages/user/SchemesHub'
import AssistiveEquipment from './pages/user/AssistiveEquipment'

// Admin pages
import AdminDashboard from './pages/admin/AdminDashboard'
import AdminApplications from './pages/admin/AdminApplications'
import AdminApplicationDetail from './pages/admin/AdminApplicationDetail'

// Doctor pages
import DoctorDashboard from './pages/doctor/DoctorDashboard'
import CaseDetail from './pages/doctor/CaseDetail'

// Public pages
import VerifyCertificate from './pages/public/VerifyCertificate'

// Root redirect based on role
const RootRedirect = () => {
  const { isAuthenticated, role } = useAuth()
  if (!isAuthenticated) return <Navigate to="/login" replace />
  const redirectMap = { PWD_USER: '/dashboard', ADMIN: '/admin/dashboard', DOCTOR: '/doctor/dashboard' }
  return <Navigate to={redirectMap[role] || '/login'} replace />
}

const App = () => {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* Root */}
          <Route path="/" element={<RootRedirect />} />

          {/* Auth */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* Public */}
          <Route path="/verify" element={<VerifyCertificate />} />
          <Route path="/verify/:hash" element={<VerifyCertificate />} />

          {/* PwD User */}
          <Route path="/dashboard" element={
            <ProtectedRoute roles={['PWD_USER']}><UserDashboard /></ProtectedRoute>
          } />
          <Route path="/apply" element={
            <ProtectedRoute roles={['PWD_USER']}><ApplicationForm /></ProtectedRoute>
          } />
          <Route path="/my-applications" element={
            <ProtectedRoute roles={['PWD_USER']}><MyApplications /></ProtectedRoute>
          } />
          <Route path="/my-applications/:id" element={
            <ProtectedRoute roles={['PWD_USER']}><ApplicationDetail /></ProtectedRoute>
          } />
          <Route path="/my-certificates" element={
            <ProtectedRoute roles={['PWD_USER']}><MyCertificates /></ProtectedRoute>
          } />
          <Route path="/schemes" element={
            <ProtectedRoute roles={['PWD_USER']}><SchemesHub /></ProtectedRoute>
          } />
          <Route path="/equipment" element={
            <ProtectedRoute roles={['PWD_USER']}><AssistiveEquipment /></ProtectedRoute>
          } />

          {/* Admin */}
          <Route path="/admin/dashboard" element={
            <ProtectedRoute roles={['ADMIN']}><AdminDashboard /></ProtectedRoute>
          } />
          <Route path="/admin/applications" element={
            <ProtectedRoute roles={['ADMIN']}><AdminApplications /></ProtectedRoute>
          } />
          <Route path="/admin/applications/:id" element={
            <ProtectedRoute roles={['ADMIN']}><AdminApplicationDetail /></ProtectedRoute>
          } />

          {/* Doctor */}
          <Route path="/doctor/dashboard" element={
            <ProtectedRoute roles={['DOCTOR']}><DoctorDashboard /></ProtectedRoute>
          } />
          <Route path="/doctor/cases" element={
            <ProtectedRoute roles={['DOCTOR']}><DoctorDashboard /></ProtectedRoute>
          } />
          <Route path="/doctor/cases/:id" element={
            <ProtectedRoute roles={['DOCTOR']}><CaseDetail /></ProtectedRoute>
          } />

          {/* Fallback */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>

        <Toaster
          position="top-right"
          toastOptions={{
            duration: 3500,
            style: {
              fontFamily: 'var(--font-sans)',
              fontSize: '14px',
              borderRadius: '8px',
              border: '1px solid var(--border-color)',
              boxShadow: 'var(--shadow-md)',
            },
            success: {
              iconTheme: { primary: 'var(--color-green-700)', secondary: '#fff' },
            },
          }}
        />
      </BrowserRouter>
    </AuthProvider>
  )
}

export default App
