import { useContext, useState } from 'react';
import { AuthContext } from '../context/AuthContext';
import { useAppStore } from '../context/AppStoreContext';
import { useToast } from '../context/ToastContext';
import StateMessage from '../components/ui/StateMessage';
import ReservationCard from '../components/reservations/ReservationCard';
import Modal from '../components/ui/Modal';
import Button from '../components/ui/Button';
import { ReservationStatus } from '../types';
import { FiLoader } from 'react-icons/fi';

export default function ReservationsPage() {
  const { currentUser } = useContext(AuthContext);
  const { getReservationsByUser, cancelReservation, spaces, isLoading } = useAppStore();
  const { showToast } = useToast();

  const [cancelModal, setCancelModal] = useState<{ open: boolean; reservationId: number | null }>({
    open: false,
    reservationId: null,
  });
  const [cancelling, setCancelling] = useState(false);

  if (!currentUser) {
    return (
      <StateMessage
        type="error"
        title="No autenticado"
        description="Por favor inicia sesion"
      />
    );
  }

  const userReservations = getReservationsByUser(currentUser.id);

  if (userReservations.length === 0) {
    return (
      <div className="mx-auto max-w-6xl px-6 py-10">
        <h1 className="text-3xl font-bold text-text mb-6">Mis Reservas</h1>
        <StateMessage
          type="empty"
          title="Sin reservas"
          description="No tienes reservas todavia. Explora los espacios disponibles."
          actionText="Ver espacios"
          onAction={() => (window.location.href = '/spaces')}
        />
      </div>
    );
  }

  const groups = [
    { status: ReservationStatus.APPROVED, label: 'Aprobadas' },
    { status: ReservationStatus.PENDING, label: 'Pendientes de aprobacion' },
    { status: ReservationStatus.REJECTED, label: 'Rechazadas' },
    { status: ReservationStatus.CANCELLED, label: 'Canceladas' },
  ];

  const canCancel = (status: ReservationStatus) =>
    status === ReservationStatus.PENDING || status === ReservationStatus.APPROVED;

  const handleCancelClick = (reservationId: number) => {
    setCancelModal({ open: true, reservationId });
  };

  const handleConfirmCancel = async () => {
    if (!cancelModal.reservationId) return;
    setCancelling(true);
    try {
      await cancelReservation(cancelModal.reservationId, currentUser.id);
      showToast('Reserva cancelada correctamente', 'info');
    } catch {
      showToast('Error al cancelar la reserva', 'error');
    } finally {
      setCancelling(false);
      setCancelModal({ open: false, reservationId: null });
    }
  };

  return (
    <main className="mx-auto max-w-6xl px-6 py-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold text-text">Mis Reservas</h1>
        {isLoading && (
          <span className="flex items-center gap-2 text-sm text-muted">
            <FiLoader className="animate-spin" /> Actualizando...
          </span>
        )}
      </div>

      {groups.map(({ status, label }) => {
        const group = userReservations.filter((r) => r.status === status);
        if (group.length === 0) return null;
        return (
          <section key={status} className="mb-8" aria-labelledby={`group-${status}`}>
            <h2 id={`group-${status}`} className="text-xl font-semibold text-text mb-4">
              {label} ({group.length})
            </h2>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {group.map((res) => {
                const space = spaces.find((s) => s.id === res.spaceId);
                return (
                  <ReservationCard
                    key={res.id}
                    reservation={res}
                    space={space}
                    onCancel={canCancel(res.status) ? () => handleCancelClick(res.id) : undefined}
                  />
                );
              })}
            </div>
          </section>
        );
      })}

      <Modal
        isOpen={cancelModal.open}
        title="Cancelar reserva"
        message="Esta accion no se puede deshacer. La reserva quedara marcada como cancelada."
        type="warning"
        onClose={() => setCancelModal({ open: false, reservationId: null })}
      >
        <div className="flex gap-2 justify-end mt-4">
          <button
            type="button"
            onClick={() => setCancelModal({ open: false, reservationId: null })}
            className="cursor-pointer px-3 py-1 text-sm font-semibold rounded-btn bg-white text-black hover:bg-gray-100 dark:bg-gray-700 dark:text-white dark:hover:bg-gray-600 border border-gray-300 dark:border-gray-500 transition-all duration-200"
          >
            No, volver
          </button>
          <Button variant="danger" size="sm" isLoading={cancelling} onClick={handleConfirmCancel}>
            Si, cancelar reserva
          </Button>
        </div>
      </Modal>
    </main>
  );
}
