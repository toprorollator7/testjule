import { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { LandingPage } from './pages/LandingPage';
import { RoleSelectionPage } from './pages/RoleSelectionPage';
import { DashboardPage } from './pages/DashboardPage';
import { ListingsPage } from './pages/ListingsPage';
import { ListingDetailPage } from './pages/ListingDetailPage';
import { AgencyStorefrontPage } from './pages/AgencyStorefrontPage';
import { UserRole } from './types';
import { ConvexProvider, ConvexReactClient } from "convex/react";
import { useQuery } from 'convex/react';
import { api } from '../convex/_generated/api';
import { useUser } from '@workos-inc/authkit-react';

const convex = new ConvexReactClient(import.meta.env.VITE_CONVEX_URL as string);

// Scroll to top helper
const ScrollToTop = () => {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
};

const ProtectedRoute = ({ children, user, requiredRole }: { children: React.ReactNode, user: any, requiredRole?: UserRole }) => {
  if (!user) {
    return <Navigate to="/" replace />;
  }
  if (requiredRole && user.role !== requiredRole) {
    return <Navigate to="/" replace />;
  }
  return <>{children}</>;
};

const App = () => {
  const { user, isLoading } = useUser();
  const dbUser = useQuery(api.users.get);

  useEffect(() => {
    if (user && dbUser && !dbUser.role) {
      window.location.href = '/select-role';
    }
  }, [user, dbUser]);

  if (isLoading || dbUser === undefined) {
     return <div className="h-screen w-screen flex items-center justify-center bg-gray-50 text-gray-500">Loading AgentFlow...</div>;
  }

  return (
    <Router>
      <ScrollToTop />
      <div className="flex flex-col min-h-screen">
        <Routes>
          <Route path="/select-role" element={
            user ? <RoleSelectionPage /> : <Navigate to="/" />
          } />

          {/* Main Layout Pages */}
          <Route path="*" element={
            <>
              <Navbar />
              <main className="flex-grow">
                <Routes>
                  <Route path="/" element={<LandingPage />} />
                  <Route path="/browse" element={<ListingsPage />} />
                  <Route path="/listing/:id" element={<ListingDetailPage />} />
                  <Route path="/agency/:agencyId" element={<AgencyStorefrontPage />} />
                  
                  <Route path="/dashboard" element={
                    <ProtectedRoute user={dbUser} requiredRole={UserRole.PROVIDER_ADMIN}>
                      <DashboardPage user={dbUser!} />
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

const AppWrapper = () => {
  return (
    <ConvexProvider client={convex}>
      <App />
    </ConvexProvider>
  )
}

export default AppWrapper;
