import { Navigate, useNavigate } from 'react-router';
import { Login } from '../components/Login';
import { useAuth, roleDashboardPath } from '../context/AuthContext';

export function LoginPage() {
  const navigate = useNavigate();
  const { user } = useAuth();

  if (user) {
    return <Navigate to={roleDashboardPath(user.role)} replace />;
  }

  return (
    <Login
      onLoginSuccess={(role) => {
        navigate(roleDashboardPath(role));
      }}
    />
  );
}
