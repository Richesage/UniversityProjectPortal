import { Navigate, Outlet, useLocation } from 'react-router';
import { useAuth, roleDashboardPath } from '../context/AuthContext';
import type { Role } from '../data/seed';
import { Layout } from '../components/Layout';

function ProtectedRoute({ allowedRole }: { allowedRole: Role }) {
  const { user } = useAuth();
  const location = useLocation();

  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (user.role !== allowedRole) {
    return <Navigate to={roleDashboardPath(user.role)} replace />;
  }

  return (
    <Layout role={allowedRole}>
      <Outlet />
    </Layout>
  );
}

export function RootRedirect() {
  const { user } = useAuth();
  if (!user) return <Navigate to="/login" replace />;
  return <Navigate to={roleDashboardPath(user.role)} replace />;
}

export { ProtectedRoute };
