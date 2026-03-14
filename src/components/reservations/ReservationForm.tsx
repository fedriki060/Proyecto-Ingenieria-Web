import React, { useState, useContext, useMemo } from 'react';
import type { Space, Reservation } from '../../types';
import { AuthContext } from '../../context/AuthContext';
import { useAppStore } from '../../context/AppStoreContext';
import { useToast } from '../../context/ToastContext';
import { detectConflicts } from '../../services/conflictService';
import { UserRole } from '../../types';
import Button from '../ui/Button';
import Card from '../ui/Card';
import ConflictAlert from './ConflictAlert';
import { FiCalendar, FiClock, FiUsers, FiFileText } from 'react-icons/fi';

interface ReservationFormProps {
  space: Space;
  initialSlot?: { date: string; startTime: string; endTime: string } | null;
  onSuccess?: (reservation: Reservation) => void;
  onCancel?: () => void;
}

export default function ReservationForm({ space, initialSlot, onSuccess, onCancel }: ReservationFormProps) {
  const { currentUser } = useContext(AuthContext);
  const { reservations, createReservation } = useAppStore();
  const { showToast } = useToast();

  const [formData, setFormData] = useState({
    date: initialSlot?.date ?? new Date().toISOString().split('T')[0],
    startTime: initialSlot?.startTime ?? '09:00',
    endTime: initialSlot?.endTime ?? '10:00',
    purpose: '',
    attendeeCount: 5,
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!currentUser) return null;

  const isNotAuthorized =
    space.allowedPrograms?.length > 0 &&
    currentUser.role === UserRole.STUDENT &&
    (!currentUser.program || !space.allowedPrograms.includes(currentUser.program));

  const conflict = useMemo(() => {
    if (!formData.date || !formData.startTime || !formData.endTime) return null;
    return detectConflicts(space.id, formData.date, formData.startTime, formData.endTime, reservations);
  }, [formData.date, formData.startTime, formData.endTime, space.id, reservations]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === 'attendeeCount' ? parseInt(value) : value,
    }));
    setError(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (currentUser.isBlocked) {
      setError('Estas bloqueado y no puedes hacer reservas.');
      return;
    }
    if (formData.attendeeCount > space.capacity) {
      setError(`Numero de asistentes (${formData.attendeeCount}) excede capacidad (${space.capacity})`);
      return;
    }
    if (!formData.purpose.trim()) {
      setError('Debes especificar el proposito de la reserva');
      return;
    }
    if (conflict?.hasConflict) {
      setError('Hay un conflicto de horario. Por favor selecciona otro slot.');
      return;
    }
    if (isNotAuthorized) {
      setError(`Tu programa (${currentUser.program ?? 'sin programa'}) no esta autorizado para este espacio.`);
      return;
    }

    setIsSubmitting(true);
    try {
      const reservation = await createReservation(
        {
          spaceId: space.id,
          date: formData.date,
          startTime: formData.startTime,
          endTime: formData.endTime,
          purpose: formData.purpose,
          attendeeCount: formData.attendeeCount,
        },
        currentUser.id,
        space
      );
      showToast(
        space.requiresApproval
          ? 'Reserva enviada — pendiente de aprobacion'
          : 'Reserva creada y aprobada',
        space.requiresApproval ? 'warning' : 'success'
      );
      onSuccess?.(reservation);
    } catch {
      showToast('Error al crear la reserva', 'error');
      setError('Error al crear la reserva. Intenta de nuevo.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card className="w-full max-w-2xl">
      <h2 className="text-xl font-semibold text-text mb-4">
        Nueva Reserva — {space.name}
      </h2>

      {space.requiresApproval && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-card p-3 mb-4" role="note">
          <p className="text-sm text-yellow-800">
            Esta reserva requiere aprobacion del administrador
          </p>
        </div>
      )}

      {isNotAuthorized && (
        <div className="bg-red-50 border border-red-200 rounded-card p-3 mb-4" role="alert">
          <p className="text-sm text-red-800 font-semibold">
            Tu programa ({currentUser.program ?? 'sin programa'}) no esta autorizado para reservar este espacio.
          </p>
          <p className="text-xs text-red-700 mt-1">
            Programas autorizados: {space.allowedPrograms.join(', ')}
          </p>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4" noValidate>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label htmlFor="res-date" className="block text-sm font-semibold text-text mb-2">
              <FiCalendar className="inline mr-1" aria-hidden="true" />
              Fecha
            </label>
            <input
              id="res-date"
              type="date"
              name="date"
              value={formData.date}
              onChange={handleChange}
              min={new Date().toISOString().split('T')[0]}
              required
              className="w-full px-3 py-2 rounded-input border border-border bg-surface text-text focus:ring-2 focus:ring-brand-300 outline-none"
            />
          </div>
          <div>
            <label htmlFor="res-start" className="block text-sm font-semibold text-text mb-2">
              <FiClock className="inline mr-1" aria-hidden="true" />
              Hora inicio
            </label>
            <input
              id="res-start"
              type="time"
              name="startTime"
              value={formData.startTime}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 rounded-input border border-border bg-surface text-text focus:ring-2 focus:ring-brand-300 outline-none"
            />
          </div>
          <div>
            <label htmlFor="res-end" className="block text-sm font-semibold text-text mb-2">
              <FiClock className="inline mr-1" aria-hidden="true" />
              Hora fin
            </label>
            <input
              id="res-end"
              type="time"
              name="endTime"
              value={formData.endTime}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 rounded-input border border-border bg-surface text-text focus:ring-2 focus:ring-brand-300 outline-none"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="res-attendees" className="block text-sm font-semibold text-text mb-2">
              <FiUsers className="inline mr-1" aria-hidden="true" />
              Cantidad de asistentes
            </label>
            <input
              id="res-attendees"
              type="number"
              name="attendeeCount"
              value={formData.attendeeCount}
              onChange={handleChange}
              min={1}
              max={space.capacity}
              required
              aria-describedby="capacity-hint"
              className="w-full px-3 py-2 rounded-input border border-border bg-surface text-text focus:ring-2 focus:ring-brand-300 outline-none"
            />
            <p id="capacity-hint" className="text-xs text-muted mt-1">
              Capacidad maxima: {space.capacity}
            </p>
          </div>
          <div>
            <label htmlFor="res-purpose" className="block text-sm font-semibold text-text mb-2">
              <FiFileText className="inline mr-1" aria-hidden="true" />
              Proposito
            </label>
            <input
              id="res-purpose"
              type="text"
              name="purpose"
              value={formData.purpose}
              onChange={handleChange}
              placeholder="ej: Taller de Python"
              required
              className="w-full px-3 py-2 rounded-input border border-border bg-surface text-text focus:ring-2 focus:ring-brand-300 outline-none"
            />
          </div>
        </div>

        {conflict?.hasConflict && (
          <ConflictAlert
            conflict={conflict}
            onSelectSlot={(startTime, endTime) =>
              setFormData((prev) => ({ ...prev, startTime, endTime }))
            }
          />
        )}

        {error && (
          <div className="bg-red-50 border border-red-200 rounded-card p-3" role="alert">
            <p className="text-sm text-red-800">{error}</p>
          </div>
        )}

        <div className="bg-page rounded-card p-3 space-y-1 text-xs text-muted">
          <p className="font-semibold text-text text-sm">Resumen</p>
          <p>{space.name} — {formData.date}</p>
          <p>{formData.startTime} a {formData.endTime} | {formData.attendeeCount} asistentes</p>
          <p>{formData.purpose || 'Sin proposito indicado'}</p>
        </div>

        <div className="flex gap-3 justify-end pt-4 border-t border-border">
          {onCancel && (
            <button
              type="button"
              onClick={onCancel}
              className="cursor-pointer px-4 py-2 text-sm font-semibold rounded-btn bg-red-600 text-white hover:bg-red-700 transition-all duration-200"
            >
              Cancelar
            </button>
          )}
          <Button
            type="submit"
            variant="primary"
            isLoading={isSubmitting}
            disabled={!!conflict?.hasConflict || isSubmitting || isNotAuthorized}
            className="cursor-pointer"
          >
            Crear reserva
          </Button>
        </div>
      </form>
    </Card>
  );
}