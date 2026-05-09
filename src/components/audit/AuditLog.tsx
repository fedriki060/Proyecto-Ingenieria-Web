import Badge from '../ui/Badge';

type Props = {
  logs: any[];
  users?: any[];
};

const actionConfig: Record<string, { label: string; variant: 'success' | 'danger' | 'warning' | 'info' | 'primary' }> = {
  'CREAR':     { label: 'Creado',     variant: 'primary' },
  'APROBADA':  { label: 'Aprobado',   variant: 'success' },
  'RECHAZADA': { label: 'Rechazado',  variant: 'danger'  },
  'CANCELAR':  { label: 'Cancelado',  variant: 'warning' },
  'NO-SHOW':   { label: 'No-Show',    variant: 'danger'  },
  'BLOQUEO':   { label: 'Bloqueado',  variant: 'danger'  },
  'ACTUALIZAR':{ label: 'Actualizado',variant: 'info'    },
  'ELIMINAR':  { label: 'Eliminado',  variant: 'danger'  },
};

export default function AuditLogComponent({ logs }: Props) {
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
              <th scope="col" className="text-left px-4 py-3 text-xs font-semibold text-muted uppercase hidden md:table-cell">Detalle</th>
              <th scope="col" className="text-left px-4 py-3 text-xs font-semibold text-muted uppercase">Fecha y hora</th>
            </tr>
          </thead>
          <tbody>
            {logs.map((log: any, idx: number) => {
              const config = actionConfig[log.accion?.toUpperCase()];
              return (
                <tr
                  key={`${log.id}-${idx}`}
                  className="border-b border-border hover:bg-page transition-colors"
                >
                  <td className="px-4 py-3 text-sm text-text font-medium">
                    {log.usuarioId?.substring(0, 8) ?? 'Sistema'}
                  </td>
                  <td className="px-4 py-3">
                    <Badge variant={config?.variant ?? 'primary'} className="text-xs">
                      {config?.label ?? log.accion}
                    </Badge>
                  </td>
                  <td className="px-4 py-3 text-sm text-muted hidden md:table-cell">
                    {log.entidad}
                  </td>
                  <td className="px-4 py-3 text-sm text-muted hidden md:table-cell">
                    {log.detalle}
                  </td>
                  <td className="px-4 py-3 text-xs text-muted whitespace-nowrap">
                    {new Date(log.fecha).toLocaleString('es-ES', {
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