import { useContext, useState, useEffect } from 'react';
import { AuthContext } from '../context/AuthContext';
import { useAppStore } from '../context/AppStoreContext';
import { useToast } from '../context/ToastContext';
import StateMessage from '../components/ui/StateMessage';
import ReservationCard from '../components/reservations/ReservationCard';
import Modal from '../components/ui/Modal';
import Button from '../components/ui/Button';
import { FiLoader } from 'react-icons/fi';

export default function ReservationsPage() {
  const { currentUser } = useContext(AuthContext);
  const { reservas, salas, cancelarReserva, cargarReservas, isLoading } = useAppStore();
  const { showToast } = useToast();

  const [cancelModal, setCancelModal] = useState<{ open: boolean; reservationId: number | null }>({
    open: false,
    reservationId: null,
  });
  const [cancelling, setCancelling] = useState(false);

  useEffect(() => {
    cargarReservas();
  }, [cargarReservas]);

  if (!currentUser) {
    return (
      <StateMessage
        type="error"
        title="No autenticado"
        description="Por favor inicia sesion"
      />
    );
  }

  if (reservas.length === 0 && !isLoading) {
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
    { estado: 'Aprobada', label: 'Aprobadas' },
    { estado: 'Pendiente', label: 'Pendientes de aprobacion' },
    { estado: 'Rechazada', label: 'Rechazadas' },
    { estado: 'Cancelada', label: 'Canceladas' },
  ];

  const canCancel = (estado: string) =>
    estado === 'Pendiente' || estado === 'Aprobada';

  const handleCancelClick = (reservationId: number) => {
    setCancelModal({ open: true, reservationId });
  };

  const handleConfirmCancel = async () => {
    if (!cancelModal.reservationId) return;
    setCancelling(true);
    try {
      await cancelarReserva(cancelModal.reservationId);
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

      {groups.map(({ estado, label }) => {
        const group = reservas.filter((r: any) => r.estado === estado);
        if (group.length === 0) return null;
        return (
          <section key={estado} className="mb-8" aria-labelledby={`group-${estado}`}>
            <h2 id={`group-${estado}`} className="text-xl font-semibold text-text mb-4">
              {label} ({group.length})
            </h2>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {group.map((res: any) => {
                const space = salas.find((s: any) => s.id === res.salaId);
                return (
                  <ReservationCard
                    key={res.id}
                    reservation={res}
                    space={space as any}
                    onCancel={canCancel(res.estado) ? () => handleCancelClick(res.id) : undefined}
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