import React, { useEffect, useState } from 'react';
import { HashRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { LandingPage } from './pages/LandingPage';
import { AuthPage } from './pages/AuthPage';
import { RoleSelectionPage } from './pages/RoleSelectionPage';
import { DashboardPage } from './pages/DashboardPage';
import { ListingsPage } from './pages/ListingsPage';
import { ListingDetailPage } from './pages/ListingDetailPage';
import { AgencyStorefrontPage } from './pages/AgencyStorefrontPage';
import { mockApi } from './lib/mockApi';
import { User, UserRole } from './types';

// Scroll to top helper
const ScrollToTop = () => {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
};

const ProtectedRoute = ({ children, user, requiredRole }: { children: React.ReactNode, user: User | null, requiredRole?: UserRole }) => {
  if (!user) {
    return <Navigate to="/auth" replace />;
  }
  if (requiredRole && user.role !== requiredRole) {
    return <Navigate to="/" replace />;
  }
  return <>{children}</>;
};

const App = () => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  const checkAuth = async () => {
    const currentUser = await mockApi.getCurrentUser();
    setUser(currentUser);
    setLoading(false);
  };

  useEffect(() => {
    checkAuth();
  }, []);

  if (loading) {
     return <div className="h-screen w-screen flex items-center justify-center bg-gray-50 text-gray-500">Loading AgentFlow...</div>;
  }

  return (
    <Router>
      <ScrollToTop />
      <div className="flex flex-col min-h-screen">
        <Routes>
          {/* Auth Pages have no Navbar */}
          <Route path="/auth" element={<AuthPage onLogin={checkAuth} />} />
          
          <Route path="/select-role" element={
            user ? <RoleSelectionPage userId={user.id} onRoleUpdate={checkAuth} /> : <Navigate to="/auth" />
          } />

          {/* Main Layout Pages */}
          <Route path="*" element={
            <>
              <Navbar user={user} onLogout={() => setUser(null)} />
              <main className="flex-grow">
                <Routes>
                  <Route path="/" element={<LandingPage />} />
                  <Route path="/browse" element={<ListingsPage />} />
                  <Route path="/listing/:id" element={<ListingDetailPage />} />
                  <Route path="/agency/:agencyId" element={<AgencyStorefrontPage />} />
                  
                  <Route path="/dashboard" element={
                    <ProtectedRoute user={user} requiredRole={UserRole.PROVIDER_ADMIN}>
                      <DashboardPage user={user!} />
                    </ProtectedRoute>
                  } />
                </Routes>
              </main>
              <Footer />
            </>
          } />
        </Routes>
      </div>
    </Router>
  );
};

export default App;