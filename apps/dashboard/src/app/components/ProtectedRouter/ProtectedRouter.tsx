// ProtectedRoute.tsx

import { Navigate, useLocation } from 'react-router';
import { useUser } from '../../../hooks/useUser';
import DashBoardLayout from '../../layout/DashBoardLayout';

export default function ProtectedRoute() {
  const { data: user } = useUser();
  const location = useLocation();

  if (!user) {
    return <Navigate to="/authenticate" replace state={{ from: location }} />; // redirect if not logged in
  }

  return <DashBoardLayout />; // render nested routes
}
