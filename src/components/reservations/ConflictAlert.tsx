import type { TimeConflict } from '../../types';
import Badge from '../ui/Badge';
import Button from '../ui/Button';
import Card from '../ui/Card';
import { FiAlertTriangle, FiClock } from 'react-icons/fi';

interface ConflictAlertProps {
  conflict: TimeConflict;
  onSelectSlot?: (startTime: string, endTime: string) => void;
}

export default function ConflictAlert({ conflict, onSelectSlot }: ConflictAlertProps) {
  if (!conflict.hasConflict) return null;

  return (
    <div className="space-y-3">
      {/* Alerta Principal */}
      <Card className="border-l-4 border-danger-600 bg-red-50">
        <div className="flex items-start gap-3">
          <FiAlertTriangle className="text-danger-600 flex-shrink-0 mt-0.5" size={20} />
          <div className="flex-1">
            <h4 className="font-semibold text-danger-600 mb-1">⚠️ Conflicto de Horario Detectado</h4>
            <p className="text-sm text-red-800">
              El horario seleccionado se superpone con {conflict.conflictingReservations?.length || 0} reserva(s) existente(s).
            </p>
          </div>
        </div>
      </Card>

      {/* Detalles de Conflictos */}
      {conflict.conflictingReservations && conflict.conflictingReservations.length > 0 && (
        <Card className="bg-red-50">
          <h5 className="text-sm font-semibold text-text mb-3">Reservas en Conflicto:</h5>
          <div className="space-y-2">
            {conflict.conflictingReservations.map((res) => (
              <div key={res.id} className="bg-surface rounded-input p-2 border border-red-200">
                <div className="flex items-center justify-between mb-1">
                  <p className="text-sm font-semibold text-text">{res.purpose}</p>
                  <Badge variant="danger">Aprobada</Badge>
                </div>
                <p className="text-xs text-muted">
                  <FiClock className="inline mr-1" size={12} />
                  {res.startTime} - {res.endTime}
                </p>
                <p className="text-xs text-muted">
                  👥 {res.attendeeCount} asistentes
                </p>
              </div>
            ))}
          </div>
        </Card>
      )}

      {/* Sugerencias de Slots Libres */}
      {conflict.suggestedSlots && conflict.suggestedSlots.length > 0 && (
        <Card className="bg-green-50">
          <h5 className="text-sm font-semibold text-text mb-3">✨ Slots Disponibles Sugeridos:</h5>
          <div className="grid grid-cols-1 gap-2">
            {conflict.suggestedSlots.slice(0, 3).map((slot, idx) => (
              <Button
                key={idx}
                variant="success"
                size="sm"
                onClick={() => onSelectSlot?.(slot.startTime, slot.endTime)}
                className="justify-between"
              >
                <span>{slot.startTime} - {slot.endTime}</span>
                <span>→</span>
              </Button>
            ))}
          </div>
        </Card>
      )}
    </div>
  );
}