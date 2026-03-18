import type { Reservation, Space } from '../../types';
import { ReservationStatus } from '../../types';
import _Button from '../ui/Button';
import Badge from '../ui/Badge';
import { FiCalendar, FiClock, FiUsers, FiTrash2 } from 'react-icons/fi';

type Props = {
  reservation: Reservation;
  space?: Space;
  onCancel?: () => void;
};

const statusColors: Record<ReservationStatus, 'success' | 'danger' | 'warning' | 'info'> = {
  [ReservationStatus.APPROVED]: 'success',
  [ReservationStatus.PENDING]: 'warning',
  [ReservationStatus.REJECTED]: 'danger',
  [ReservationStatus.CANCELLED]: 'info',
};

const statusLabels: Record<ReservationStatus, string> = {
  [ReservationStatus.APPROVED]: '✅ Aprobada',
  [ReservationStatus.PENDING]: '⏳ Pendiente',
  [ReservationStatus.REJECTED]: '❌ Rechazada',
  [ReservationStatus.CANCELLED]: '🚫 Cancelada',
};

export default function ReservationCard({ reservation, space, onCancel }: Props) {
  return (
    <div className="rounded-card border border-border bg-surface p-4 shadow-card">
      {/* Header */}
      <div className="flex items-start justify-between gap-3 mb-3">
        <div>
          <h3 className="text-lg font-semibold text-text m-0">
            {space?.name || `Espacio ${reservation.spaceId}`}
          </h3>
          <p className="text-sm text-muted m-0 mt-1">{reservation.purpose}</p>
        </div>
        <Badge variant={statusColors[reservation.status]}>
          {statusLabels[reservation.status]}
        </Badge>
      </div>

      {/* Details */}
      <div className="space-y-2 mb-4 text-sm">
        {/* Fecha */}
        <div className="flex items-center gap-2 text-text">
          <FiCalendar size={16} className="text-muted" />
          <span>{new Date(reservation.date).toLocaleDateString('es-ES')}</span>
        </div>

        {/* Hora */}
        <div className="flex items-center gap-2 text-text">
          <FiClock size={16} className="text-muted" />
          <span>
            {reservation.startTime} - {reservation.endTime}
          </span>
        </div>

        {/* Asistentes */}
        <div className="flex items-center gap-2 text-text">
          <FiUsers size={16} className="text-muted" />
          <span>{reservation.attendeeCount} personas</span>
        </div>
      </div>

      {/* Motivo de rechazo (si aplica) */}
      {reservation.status === ReservationStatus.REJECTED && reservation.rejectionReason && (
        <div className="bg-danger-50 border border-danger-200 rounded-card p-2 mb-4">
          <p className="text-xs text-danger-700 m-0">
            <strong>Motivo:</strong> {reservation.rejectionReason}
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