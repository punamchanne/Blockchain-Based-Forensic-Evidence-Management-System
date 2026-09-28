import { BrowserRouter as Router, Routes, Route, Outlet, useLocation } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Features from './pages/Features';
import HowItWorks from './pages/HowItWorks';
import Home from './pages/Home';
import Login from './pages/Login';
import SuperAdminDashboard from './pages/SuperAdminDashboard';
import AdminDashboard from './pages/AdminDashboard';
import CreateCase from './pages/CreateCase';
import UploadEvidence from './pages/UploadEvidence';
import VerifyEvidence from './pages/VerifyEvidence';
import CaseDetails from './pages/CaseDetails';
import GenerateSketch from './pages/GenerateSketch';
import FaceAuth from './pages/FaceAuth';
import CriminalDatabase from './pages/CriminalDatabase';
import AddCriminal from './pages/AddCriminal';
import CriminalDetails from './pages/CriminalDetails';
import FaceSetup from './pages/FaceSetup';
import InitialSetup from './pages/InitialSetup';
import AdminNews from './pages/AdminNews';
import AdminHistory from './pages/AdminHistory';
import ProtectedRoute from './components/ProtectedRoute';

// Layout for Public Pages (with Navbar & Conditional Footer)
const PublicLayout = () => {
  const location = useLocation();
  const hideFooter = location.pathname === '/login' || location.pathname === '/register';

  return (
    <div className="flex flex-col min-h-screen bg-white selection:bg-emerald-100/30 selection:text-emerald-900 font-sans">
      <Navbar />
      <main className="flex-grow">
        <Outlet />
      </main>
      {!hideFooter && <Footer />}
    </div>
  );
};

// Layout for Dashboard Pages (Full Screen)
const DashboardLayout = () => (
  <div className="bg-white min-h-screen font-sans selection:bg-emerald-100/30 selection:text-emerald-900">
    <Outlet />
  </div>
);

function App() {
  return (
    <Router>
      <Routes>
        {/* PUBLIC ROUTES */}
        <Route element={<PublicLayout />}>
          <Route path="/" element={<Home />} />
          <Route path="/features" element={<Features />} />
          <Route path="/how-it-works" element={<HowItWorks />} />
          <Route path="/login" element={<Login />} />
          <Route path="/verify" element={<VerifyEvidence />} />
          <Route path="/setup" element={<InitialSetup />} />
        </Route>

        {/* DASHBOARD ROUTES */}
        <Route element={<DashboardLayout />}>
          <Route path="/super-admin" element={
            <ProtectedRoute roles={['super_admin']}>
              <SuperAdminDashboard />
            </ProtectedRoute>
          } />

          <Route path="/admin" element={
            <ProtectedRoute roles={['admin']}>
              <AdminDashboard />
            </ProtectedRoute>
          } />

          <Route path="/admin/news" element={
            <ProtectedRoute roles={['admin']}>
              <AdminNews />
            </ProtectedRoute>
          } />

          <Route path="/admin/history" element={
            <ProtectedRoute roles={['admin']}>
              <AdminHistory />
            </ProtectedRoute>
          } />

          <Route path="/create-case" element={
            <ProtectedRoute roles={['admin']}>
              <CreateCase />
            </ProtectedRoute>
          } />

          <Route path="/upload-evidence/:caseId" element={
            <ProtectedRoute roles={['admin']}>
              <UploadEvidence />
            </ProtectedRoute>
          } />

          <Route path="/generate-sketch" element={
            <ProtectedRoute roles={['admin']}>
              <GenerateSketch />
            </ProtectedRoute>
          } />

          <Route path="/case/:id" element={
            <ProtectedRoute roles={['admin', 'super_admin']}>
              <CaseDetails />
            </ProtectedRoute>
          } />

          <Route path="/face-auth" element={<FaceAuth />} />

          <Route path="/criminals" element={
            <ProtectedRoute roles={['admin', 'super_admin']}>
              <CriminalDatabase />
            </ProtectedRoute>
          } />

          <Route path="/add-criminal" element={
            <ProtectedRoute roles={['admin']}>
              <AddCriminal />
            </ProtectedRoute>
          } />

          <Route path="/criminals/:id" element={
            <ProtectedRoute roles={['admin', 'super_admin']}>
              <CriminalDetails />
            </ProtectedRoute>
          } />

          <Route path="/face-setup" element={
            <ProtectedRoute roles={['super_admin']}>
              <FaceSetup />
            </ProtectedRoute>
          } />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
