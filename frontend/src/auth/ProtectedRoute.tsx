import { ReactNode } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from './AuthContext';
import { PerfilAcesso } from '../types/api.types';

interface ProtectedRouteProps {
  children: ReactNode;
  allowedRoles?: PerfilAcesso[];
}

export function ProtectedRoute({ children, allowedRoles }: ProtectedRouteProps) {
  const { user } = useAuth();
  const location = useLocation();

  if (!user) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  if (allowedRoles && !allowedRoles.includes(user.perfilAcesso)) {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
}