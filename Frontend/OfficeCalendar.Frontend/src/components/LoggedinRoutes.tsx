import { Navigate, Outlet } from 'react-router-dom';

interface AdminRouteProps {
  user: any; 
  isLoading: boolean;
}

const LoggedinRoute: React.FC<AdminRouteProps> = ({ user, isLoading }) => {
  if (isLoading) return <div>Laden...</div>;

  if (!user) {
    return <Navigate to="/login" replace />;
  }
  return <Outlet />;
};

export default LoggedinRoute;