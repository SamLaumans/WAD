import { Navigate, Outlet } from 'react-router-dom';

interface AdminRouteProps {
  user: any; 
  isLoading: boolean;
}

const AdminRoute: React.FC<AdminRouteProps> = ({ user, isLoading }) => {
  if (isLoading) return <div>Laden...</div>;

  if (!user || user.role !==  1) {
    return <Navigate to="/unauthorized" replace />;
  }
  return <Outlet />;
};

export default AdminRoute;