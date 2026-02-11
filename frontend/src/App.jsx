import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';

// Pages - Auth
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';

// Pages - User (PWD_USER)
import UserDashboard from './pages/user/Dashboard';
import ApplyForCertificate from './pages/user/ApplyForCertificate';
import ApplicationStatus from './pages/user/ApplicationStatus';
import MyCertificate from './pages/user/MyCertificate';
import WelfareSchemes from './pages/user/WelfareSchemes';
import AssistiveEquipment from './pages/user/AssistiveEquipment';

// Pages - Admin
import AdminDashboard from './pages/admin/AdminDashboard';
import ApplicationReview from './pages/admin/ApplicationReview';

// Pages - Doctor
import DoctorDashboard from './pages/doctor/DoctorDashboard';
import CaseAssessment from './pages/doctor/CaseAssessment';

// Pages - Public
import VerifyCertificate from './pages/VerifyCertificate';
import Home from './pages/Home';

// Protected Route Component
const ProtectedRoute = ({ children, allowedRoles }) => {
    const { user, loading } = useAuth();

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="skeleton" style={{ width: '200px', height: '40px' }}></div>
            </div>
        );
    }

    if (!user) {
        return <Navigate to="/login" replace />;
    }

    if (allowedRoles && !allowedRoles.includes(user.role)) {
        return <Navigate to="/" replace />;
    }

    return children;
};

function App() {
    return (
        <Router>
            <AuthProvider>
                <Routes>
                    {/* Public Routes */}
                    <Route path="/" element={<Home />} />
                    <Route path="/login" element={<Login />} />
                    <Route path="/register" element={<Register />} />
                    <Route path="/verify" element={<VerifyCertificate />} />
                    <Route path="/verify/:certificateNumber" element={<VerifyCertificate />} />

                    {/* User Routes (PWD_USER) */}
                    <Route
                        path="/dashboard"
                        element={
                            <ProtectedRoute allowedRoles={['PWD_USER']}>
                                <UserDashboard />
                            </ProtectedRoute>
                        }
                    />
                    <Route
                        path="/apply"
                        element={
                            <ProtectedRoute allowedRoles={['PWD_USER']}>
                                <ApplyForCertificate />
                            </ProtectedRoute>
                        }
                    />
                    <Route
                        path="/application/:id"
                        element={
                            <ProtectedRoute allowedRoles={['PWD_USER']}>
                                <ApplicationStatus />
                            </ProtectedRoute>
                        }
                    />
                    <Route
                        path="/certificate"
                        element={
                            <ProtectedRoute allowedRoles={['PWD_USER']}>
                                <MyCertificate />
                            </ProtectedRoute>
                        }
                    />
                    <Route
                        path="/schemes"
                        element={
                            <ProtectedRoute allowedRoles={['PWD_USER']}>
                                <WelfareSchemes />
                            </ProtectedRoute>
                        }
                    />
                    <Route
                        path="/equipment"
                        element={
                            <ProtectedRoute allowedRoles={['PWD_USER']}>
                                <AssistiveEquipment />
                            </ProtectedRoute>
                        }
                    />

                    {/* Admin Routes */}
                    <Route
                        path="/admin"
                        element={
                            <ProtectedRoute allowedRoles={['ADMIN']}>
                                <AdminDashboard />
                            </ProtectedRoute>
                        }
                    />
                    <Route
                        path="/admin/application/:id"
                        element={
                            <ProtectedRoute allowedRoles={['ADMIN']}>
                                <ApplicationReview />
                            </ProtectedRoute>
                        }
                    />

                    {/* Doctor Routes */}
                    <Route
                        path="/doctor"
                        element={
                            <ProtectedRoute allowedRoles={['DOCTOR']}>
                                <DoctorDashboard />
                            </ProtectedRoute>
                        }
                    />
                    <Route
                        path="/doctor/case/:id"
                        element={
                            <ProtectedRoute allowedRoles={['DOCTOR']}>
                                <CaseAssessment />
                            </ProtectedRoute>
                        }
                    />

                    {/* 404 */}
                    <Route path="*" element={<Navigate to="/" replace />} />
                </Routes>
            </AuthProvider>
        </Router>
    );
}

export default App;
