import type { AuditLog, User } from '../../types';
import { AuditAction } from '../../types';
import Badge from '../ui/Badge';

type Props = {
  logs: AuditLog[];
  users?: User[];
};

const actionConfig: Record<AuditAction, { label: string; variant: 'success' | 'danger' | 'warning' | 'info' | 'primary' }> = {
  [AuditAction.RESERVATION_CREATED]:   { label: 'Reserva creada',    variant: 'primary'  },
  [AuditAction.RESERVATION_APPROVED]:  { label: 'Reserva aprobada',  variant: 'success'  },
  [AuditAction.RESERVATION_REJECTED]:  { label: 'Reserva rechazada', variant: 'danger'   },
  [AuditAction.RESERVATION_CANCELLED]: { label: 'Reserva cancelada', variant: 'warning'  },
  [AuditAction.SPACE_CREATED]:         { label: 'Espacio creado',    variant: 'info'     },
  [AuditAction.SPACE_UPDATED]:         { label: 'Espacio editado',   variant: 'info'     },
  [AuditAction.SPACE_DELETED]:         { label: 'Espacio eliminado', variant: 'danger'   },
  [AuditAction.USER_BLOCKED]:          { label: 'Usuario bloqueado', variant: 'danger'   },
  [AuditAction.USER_UNBLOCKED]:        { label: 'Usuario desbloqueado', variant: 'success' },
};

export default function AuditLogComponent({ logs, users = [] }: Props) {
  const getUserName = (userId: number) =>
    users.find((u) => u.id === userId)?.name ?? `Usuario #${userId}`;

  if (logs.length === 0) {
    return (
      <div className="rounded-card border border-border bg-surface p-8 text-center text-muted">
        No hay registros de auditoria todavia.
      </div>
    );
  }

  return (
    <div className="rounded-card border border-border bg-surface shadow-card overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full" aria-label="Registro de auditoria">
          <thead className="bg-page border-b border-border">
            <tr>
              <th scope="col" className="text-left px-4 py-3 text-xs font-semibold text-muted uppercase">Usuario</th>
              <th scope="col" className="text-left px-4 py-3 text-xs font-semibold text-muted uppercase">Accion</th>
              <th scope="col" className="text-left px-4 py-3 text-xs font-semibold text-muted uppercase hidden md:table-cell">Entidad</th>
              <th scope="col" className="text-left px-4 py-3 text-xs font-semibold text-muted uppercase">Fecha y hora</th>
            </tr>
          </thead>
          <tbody>
            {logs.map((log, idx) => {
              const config = actionConfig[log.action];
              return (
                <tr
                  key={`${log.id}-${idx}`}
                  className="border-b border-border hover:bg-page transition-colors"
                >
                  <td className="px-4 py-3 text-sm text-text font-medium">
                    {getUserName(log.userId)}
                  </td>
                  <td className="px-4 py-3">
                    <Badge variant={config?.variant ?? 'primary'} className="text-xs">
                      {config?.label ?? log.action}
                    </Badge>
                  </td>
                  <td className="px-4 py-3 text-sm text-muted hidden md:table-cell">
                    {log.entityType} #{log.entityId}
                  </td>
                  <td className="px-4 py-3 text-xs text-muted whitespace-nowrap">
                    {new Date(log.timestamp).toLocaleString('es-ES', {
                      day: '2-digit',
                      month: '2-digit',
                      year: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
