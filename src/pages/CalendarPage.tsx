import { useContext, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { useAppStore } from '../context/AppStoreContext';
import WeekCalendar from '../components/calendar/WeekCalendar';
import StateMessage from '../components/ui/StateMessage';
import Modal from '../components/ui/Modal';
import Button from '../components/ui/Button';

export default function CalendarPage() {
  const { currentUser } = useContext(AuthContext);
  const { spaces, reservations } = useAppStore();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const spaceId = Number(searchParams.get('spaceId')) || spaces[0]?.id;

  const [selectedSlot, setSelectedSlot] = useState<{
    date: string;
    startTime: string;
    endTime: string;
  } | null>(null);

  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [_showSuccessModal, _setShowSuccessModal] = useState(false);

  const space = spaces.find((s) => s.id === spaceId);

  if (!currentUser) {
    return (
      <StateMessage
        type="error"
        title="No autenticado"
        description="Por favor inicia sesion"
      />
    );
  }

  if (!space) {
    return (
      <StateMessage
        type="error"
        title="Espacio no encontrado"
        description="El espacio seleccionado no existe"
        actionText="Volver"
        onAction={() => navigate('/spaces')}
      />
    );
  }

  const handleSlotClick = (date: string, startTime: string, endTime: string) => {
    setSelectedSlot({ date, startTime, endTime });
    setShowConfirmModal(true);
  };

  const handleConfirmReservation = () => {
    setShowConfirmModal(false);
    // Redirigir al detalle del espacio para hacer la reserva completa
    navigate(`/spaces/${space.id}`);
  };

  const handleCancelReservation = () => {
    setShowConfirmModal(false);
    setSelectedSlot(null);
  };

  const spaceReservations = reservations.filter((r) => r.spaceId === space.id);

  return (
    <div className="flex-auto min-h-[calc(100vh-60px)]">
      <main className="flex-auto p-6">
        <div className="mx-auto max-w-[1200px]">
          <button
            onClick={() => navigate('/spaces')}
            className="text-sm text-brand-600 hover:underline mb-4 flex items-center gap-1"
          >
            Volver a espacios
          </button>

          <div className="mb-6">
            <h1 className="text-2xl font-bold text-text mb-1">{space.name}</h1>
            <p className="text-muted">
              {space.building} | Capacidad: {space.capacity}
            </p>
          </div>

          <WeekCalendar
            space={space}
            reservations={spaceReservations}
            onSlotClick={handleSlotClick}
          />
        </div>
      </main>

      {showConfirmModal && selectedSlot && (
        <Modal
          isOpen={showConfirmModal}
          title="Ir a reservar este espacio"
          message=""
          type="info"
          onClose={handleCancelReservation}
        >
          <p className="mb-4 text-sm text-muted">
            Seleccionaste el {selectedSlot.date} de {selectedSlot.startTime} a {selectedSlot.endTime}.
            Para completar la reserva, ve al detalle del espacio.
          </p>
          <div className="flex gap-2 mt-4 justify-end">
            <Button variant="secondary" onClick={handleCancelReservation} size="sm">
              Cancelar
            </Button>
            <Button variant="primary" onClick={handleConfirmReservation} size="sm" className="cursor-pointer">
              Ir al formulario
            </Button>
          </div>
        </Modal>
      )}
    </div>
  );
}
