import Badge from '../ui/Badge';
import { FiCalendar, FiClock, FiTrash2, FiMessageSquare } from 'react-icons/fi';

type Props = {
  reservation: any;
  space?: any;
  onCancel?: () => void;
};

const statusColors: Record<string, 'success' | 'danger' | 'warning' | 'info'> = {
  'Aprobada': 'success',
  'Pendiente': 'warning',
  'Rechazada': 'danger',
  'Cancelada': 'info',
  'NoShow': 'danger',
};

const statusLabels: Record<string, string> = {
  'Aprobada': '✅ Aprobada',
  'Pendiente': '⏳ Pendiente',
  'Rechazada': '❌ Rechazada',
  'Cancelada': '🚫 Cancelada',
  'NoShow': '🚷 No-Show',
};

export default function ReservationCard({ reservation, space, onCancel }: Props) {
  const fechaInicio = new Date(reservation.fechaInicio);
  const fechaFin = new Date(reservation.fechaFin);

  return (
    <div className="rounded-card border border-border bg-surface p-4 shadow-card">
      <div className="flex items-start justify-between gap-3 mb-3">
        <div>
          <h3 className="text-lg font-semibold text-text m-0">
            {reservation.nombreSala || space?.nombre || `Espacio ${reservation.salaId}`}
          </h3>
          <p className="text-sm text-muted m-0 mt-1">{reservation.proposito}</p>
        </div>
        <Badge variant={statusColors[reservation.estado] ?? 'info'}>
          {statusLabels[reservation.estado] ?? reservation.estado}
        </Badge>
      </div>

      <div className="space-y-2 mb-4 text-sm">
        <div className="flex items-center gap-2 text-text">
          <FiCalendar size={16} className="text-muted" />
          <span>{fechaInicio.toLocaleDateString('es-ES')}</span>
        </div>

        <div className="flex items-center gap-2 text-text">
          <FiClock size={16} className="text-muted" />
          <span>
            {fechaInicio.toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' })} - {fechaFin.toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' })}
          </span>
        </div>
      </div>

      {reservation.estado === 'Rechazada' && reservation.comentarioStaff && (
        <div className="bg-danger-50 border border-danger-200 rounded-card p-2 mb-4">
          <p className="text-xs text-danger-700 m-0 flex items-center gap-1">
            <FiMessageSquare size={12} />
            <strong>Motivo:</strong> {reservation.comentarioStaff}
          </p>
        </div>
      )}

      {onCancel && (
        <button
          type="button"
          onClick={onCancel}
          className="cursor-pointer w-full flex items-center justify-center gap-2 px-3 py-1 font-semibold rounded-btn bg-red-600 text-white hover:bg-red-700 transition-all duration-200"
        >
          <FiTrash2 size={16} /> Cancelar Reserva
        </button>
      )}
    </div>
  );
}