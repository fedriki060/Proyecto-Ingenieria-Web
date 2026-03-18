import { useState, useContext } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { useAppStore } from '../context/AppStoreContext';
import ReservationForm from '../components/reservations/ReservationForm';
import StateMessage from '../components/ui/StateMessage';
import Card from '../components/ui/Card';
import Badge from '../components/ui/Badge';
import Button from '../components/ui/Button';
import Modal from '../components/ui/Modal';
import WeekCalendar from '../components/calendar/WeekCalendar';
import type { Reservation } from '../types';
import { SpaceType } from '../types';
import { FiArrowLeft, FiMapPin, FiUsers, FiCheckSquare, FiCalendar } from 'react-icons/fi';

const typeLabels: Record<SpaceType, string> = {
  [SpaceType.CLASSROOM]: 'Aula',
  [SpaceType.LAB]: 'Laboratorio',
  [SpaceType.COURT]: 'Cancha',
  [SpaceType.MEETING_ROOM]: 'Sala de reuniones',
  [SpaceType.AUDITORIUM]: 'Auditorio',
  [SpaceType.OTHER]: 'Otro',
};

export default function SpaceDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { currentUser } = useContext(AuthContext);
  const { spaces, reservations } = useAppStore();

  const [showForm, setShowForm] = useState(false);
  const [selectedSlot, setSelectedSlot] = useState<{
    date: string;
    startTime: string;
    endTime: string;
  } | null>(null);
  const [successModal, setSuccessModal] = useState<{ open: boolean; requiresApproval: boolean }>({
    open: false,
    requiresApproval: false,
  });

  const space = spaces.find((s) => s.id === Number(id));

  if (!space) {
    return (
      <StateMessage
        type="error"
        title="Espacio no encontrado"
        description="El espacio que buscas no existe o ya no esta disponible."
        actionText="Ver todos los espacios"
        onAction={() => navigate('/spaces')}
      />
    );
  }

  const spaceReservations = reservations.filter((r) => r.spaceId === space.id);

  const handleReservationSuccess = (_reservation: Reservation) => {
    setShowForm(false);
    setSelectedSlot(null);
    setSuccessModal({ open: true, requiresApproval: space.requiresApproval });
  };

  return (
    <main className="mx-auto max-w-5xl px-6 py-6">
      <nav aria-label="Breadcrumb" className="mb-4">
        <Link
          to="/spaces"
          className="text-sm text-brand-600 hover:underline flex items-center gap-1"
        >
          <FiArrowLeft aria-hidden="true" /> Volver a espacios
        </Link>
      </nav>

      <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4 mb-6">
        <div>
          <h1 className="text-3xl font-bold text-text mb-1">{space.name}</h1>
          <div className="flex flex-wrap items-center gap-2">
            <Badge variant="primary">{typeLabels[space.type]}</Badge>
            {space.requiresApproval && (
              <Badge variant="warning">Requiere aprobacion</Badge>
            )}
            {!space.isActive && <Badge variant="danger">No disponible</Badge>}
          </div>
        </div>

        {currentUser && space.isActive && !showForm && (
          <Button
            variant="primary"
            onClick={() => {
              setSelectedSlot(null);
              setShowForm(true);
            }}
            className="shrink-0 cursor-pointer"
            aria-label={`Reservar ${space.name}`}
          >
            <FiCalendar aria-hidden="true" /> Reservar este espacio
          </Button>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        <div className="lg:col-span-1 space-y-4">
          <Card>
            <h2 className="text-lg font-semibold text-text mb-3">Informacion</h2>
            <ul className="space-y-3 text-sm">
              <li className="flex items-center gap-2 text-muted">
                <FiMapPin aria-hidden="true" className="shrink-0" />
                <span><strong className="text-text">Edificio:</strong> {space.building}</span>
              </li>
              <li className="flex items-center gap-2 text-muted">
                <FiUsers aria-hidden="true" className="shrink-0" />
                <span><strong className="text-text">Capacidad:</strong> {space.capacity} personas</span>
              </li>
              <li className="flex items-center gap-2 text-muted">
                <FiCheckSquare aria-hidden="true" className="shrink-0" />
                <span><strong className="text-text">Tipo:</strong> {typeLabels[space.type]}</span>
              </li>
            </ul>
          </Card>

          {space.resources.length > 0 && (
            <Card>
              <h2 className="text-lg font-semibold text-text mb-3">Recursos disponibles</h2>
              <div className="flex flex-wrap gap-2">
                {space.resources.map((r) => (
                  <Badge key={r} variant="info">{r}</Badge>
                ))}
              </div>
            </Card>
          )}

          {space.allowedPrograms.length > 0 && (
            <Card>
              <h2 className="text-lg font-semibold text-text mb-3">Programas autorizados</h2>
              <div className="flex flex-wrap gap-2">
                {space.allowedPrograms.map((p) => (
                  <Badge key={p} variant="success">{p}</Badge>
                ))}
              </div>
            </Card>
          )}
        </div>

        <div className="lg:col-span-2">
          {showForm ? (
            <ReservationForm
              space={space}
              initialSlot={selectedSlot}
              onSuccess={handleReservationSuccess}
              onCancel={() => {
                setShowForm(false);
                setSelectedSlot(null);
              }}
            />
          ) : (
            <div>
              <h2 className="text-xl font-semibold text-text mb-3">Disponibilidad semanal</h2>
              <WeekCalendar
                space={space}
                reservations={spaceReservations}
                onSlotClick={(date, startTime, endTime) => {
                  setSelectedSlot({ date, startTime, endTime });
                  setShowForm(true);
                }}
              />
            </div>
          )}
        </div>
      </div>

      <Modal
        isOpen={successModal.open}
        title={successModal.requiresApproval ? 'Reserva enviada' : 'Reserva confirmada'}
        message={
          successModal.requiresApproval
            ? 'Tu reserva fue enviada y esta pendiente de aprobacion por un administrador. Te notificaremos el resultado.'
            : 'Tu reserva fue creada y aprobada automaticamente. Puedes verla en Mis Reservas.'
        }
        type={successModal.requiresApproval ? 'warning' : 'success'}
        onClose={() => setSuccessModal({ open: false, requiresApproval: false })}
      >
        <div className="flex gap-2 justify-end mt-4">
          <button
            type="button"
            onClick={() => setSuccessModal({ open: false, requiresApproval: false })}
            className="cursor-pointer px-3 py-1 text-sm font-semibold rounded-btn bg-green-600 text-white hover:bg-green-700 transition-all duration-200"
          >
            Seguir explorando
          </button>
          <Button variant="primary" size="sm" className="cursor-pointer" onClick={() => navigate('/reservations')}>
            Ver mis reservas
          </Button>
        </div>
      </Modal>
    </main>
  );
}