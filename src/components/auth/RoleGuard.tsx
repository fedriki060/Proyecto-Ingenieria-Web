import React, { useContext } from 'react';
import { AuthContext } from '../../context/AuthContext';
import { UserRole } from '../../types';
import StateMessage from '../ui/StateMessage';

interface RoleGuardProps {
  allowedRoles: UserRole[];
  children: React.ReactNode;
}

export default function RoleGuard({ allowedRoles, children }: RoleGuardProps) {
  const { currentUser } = useContext(AuthContext);

  if (!currentUser) {
    return (
      <StateMessage
        type="error"
        title="No autenticado"
        description="Debes iniciar sesión para acceder a este contenido."
      />
    );
  }

  if (!allowedRoles.includes(currentUser.role)) {
    return (
      <StateMessage
        type="error"
        title="Acceso denegado"
        description={`Solo ${allowedRoles.join(', ')} pueden acceder a esta sección.`}
      />
    );
  }

  return <>{children}</>;
}