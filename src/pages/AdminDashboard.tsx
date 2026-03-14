import { useContext, useState } from 'react';
import { AuthContext } from '../context/AuthContext';
import { useAppStore } from '../context/AppStoreContext';
import { useToast } from '../context/ToastContext';
import StateMessage from '../components/ui/StateMessage';
import Card from '../components/ui/Card';
import AuditLog from '../components/audit/AuditLog';
import Button from '../components/ui/Button';
import Badge from '../components/ui/Badge';
import Modal from '../components/ui/Modal';
import { UserRole, ReservationStatus } from '../types';
import { FiUsers, FiCalendar, FiCheckCircle, FiAlertCircle, FiCheck, FiX } from 'react-icons/fi';

export default function AdminDashboard() {
  const { currentUser } = useContext(AuthContext);
  const { reservations, spaces, users, auditLogs, approveReservation, rejectReservation, isLoading } =
    useAppStore();
  const { showToast } = useToast();

  const [rejectModal, setRejectModal] = useState<{ open: boolean; reservationId: number | null }>({
    open: false,
    reservationId: null,
  });
  const [rejectionReason, setRejectionReason] = useState('');
  const [actionLoading, setActionLoading] = useState<number | null>(null);

  if (!currentUser || currentUser.role !== UserRole.ADMIN) {
    return (
      <StateMessage
        type="error"
        title="Acceso denegado"
        description="Solo los administradores pueden acceder a esta página"
        actionText="Ir a Home"
        onAction={() => (window.location.href = '/')}
      />
    );
  }

  const pending = reservations.filter((r) => r.status === ReservationStatus.PENDING);
  const approved = reservations.filter((r) => r.status === ReservationStatus.APPROVED);
  const blockedUsers = users.filter((u) => u.isBlocked);

  const handleApprove = async (reservationId: number) => {
    setActionLoading(reservationId);
    try {
      await approveReservation({ reservationId, approvedBy: currentUser.id });
      showToast('Reserva aprobada correctamente', 'success');
    } catch {
      showToast('Error al aprobar la reserva', 'error');
    } finally {
      setActionLoading(null);
    }
  };

  const openRejectModal = (reservationId: number) => {
    setRejectionReason('');
    setRejectModal({ open: true, reservationId });
  };

  const handleReject = async () => {
    if (!rejectModal.reservationId || !rejectionReason.trim()) return;
    setActionLoading(rejectModal.reservationId);
    setRejectModal({ open: false, reservationId: null });
    try {
      await rejectReservation({
        reservationId: rejectModal.reservationId,
        rejectionReason,
        rejectedBy: currentUser.id,
      });
      showToast('Reserva rechazada', 'warning');
    } catch {
      showToast('Error al rechazar la reserva', 'error');
    } finally {
      setActionLoading(null);
      setRejectionReason('');
    }
  };

  return (
    <div className="min-h-[calc(100vh-60px)]">
      <main className="mx-auto max-w-7xl p-6">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-text mb-1">Panel de Administración</h1>
          <p className="text-muted">Gestión de espacios, reservas y usuarios</p>
        </div>

        <div className="grid gap-4 grid-cols-2 lg:grid-cols-5 mb-8">
          <Card>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-semibold text-muted uppercase">Usuarios</p>
                <p className="text-2xl font-bold text-text mt-1">{users.length}</p>
              </div>
              <FiUsers className="w-8 h-8 text-brand-600 opacity-20" />
            </div>
          </Card>
          <Card>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-semibold text-muted uppercase">Aprobadas</p>
                <p className="text-2xl font-bold text-success-600 mt-1">{approved.length}</p>
              </div>
              <FiCheckCircle className="w-8 h-8 text-success-600 opacity-20" />
            </div>
          </Card>
          <Card>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-semibold text-muted uppercase">Pendientes</p>
                <p className="text-2xl font-bold text-warning-600 mt-1">{pending.length}</p>
              </div>
              <FiAlertCircle className="w-8 h-8 text-warning-600 opacity-20" />
            </div>
          </Card>
          <Card>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-semibold text-muted uppercase">Reservas</p>
                <p className="text-2xl font-bold text-text mt-1">{reservations.length}</p>
              </div>
              <FiCalendar className="w-8 h-8 text-brand-600 opacity-20" />
            </div>
          </Card>
          <Card>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-semibold text-muted uppercase">Bloqueados</p>
                <p className="text-2xl font-bold text-danger-600 mt-1">{blockedUsers.length}</p>
              </div>
              <FiAlertCircle className="w-8 h-8 text-danger-600 opacity-20" />
            </div>
          </Card>
        </div>

        <section className="mb-8" aria-labelledby="pending-title">
          <h2 id="pending-title" className="text-2xl font-bold text-text mb-4 flex items-center gap-2">
            Reservas Pendientes
            {pending.length > 0 && <Badge variant="warning">{pending.length}</Badge>}
          </h2>

          {pending.length === 0 ? (
            <Card>
              <p className="text-center text-muted py-4">No hay reservas pendientes de aprobacion</p>
            </Card>
          ) : (
            <div className="space-y-3">
              {pending.map((res) => {
                const space = spaces.find((s) => s.id === res.spaceId);
                const user = users.find((u) => u.id === res.userId);
                const loading = actionLoading === res.id;
                return (
                  <Card key={res.id}>
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1 flex-wrap">
                          <h3 className="font-semibold text-text">
                            {space?.name ?? `Espacio ${res.spaceId}`}
                          </h3>
                          <Badge variant="warning">Pendiente</Badge>
                        </div>
                        <p className="text-sm text-muted">
                          Usuario: {user?.name ?? `#${res.userId}`} — {user?.program}
                        </p>
                        <p className="text-sm text-muted">
                          Fecha: {res.date} | {res.startTime}–{res.endTime}
                        </p>
                        <p className="text-sm text-muted">Proposito: {res.purpose}</p>
                        <p className="text-sm text-muted">Asistentes: {res.attendeeCount}</p>
                      </div>
                      <div className="flex gap-2 shrink-0">
                        <Button
                          variant="success"
                          size="sm"
                          isLoading={loading}
                          disabled={isLoading}
                          onClick={() => handleApprove(res.id)}
                          aria-label={`Aprobar reserva de ${user?.name}`}
                          className="cursor-pointer"
                        >
                          <FiCheck /> Aprobar
                        </Button>
                        <Button
                          variant="danger"
                          size="sm"
                          isLoading={loading}
                          disabled={isLoading}
                          onClick={() => openRejectModal(res.id)}
                          aria-label={`Rechazar reserva de ${user?.name}`}
                          className="cursor-pointer"
                        >
                          <FiX /> Rechazar
                        </Button>
                      </div>
                    </div>
                  </Card>
                );
              })}
            </div>
          )}
        </section>

        {blockedUsers.length > 0 && (
          <section className="mb-8" aria-labelledby="blocked-title">
            <h2 id="blocked-title" className="text-2xl font-bold text-text mb-4">Usuarios Bloqueados</h2>
            <Card>
              <div className="space-y-3">
                {blockedUsers.map((user) => (
                  <div key={user.id} className="flex items-center justify-between p-3 bg-danger-50 border border-danger-200 rounded-card">
                    <div>
                      <p className="font-semibold text-text">{user.name}</p>
                      <p className="text-xs text-muted">{user.email}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-bold text-danger-600">{user.noShowCount} no-shows</p>
                      {user.blockedUntil && (
                        <p className="text-xs text-danger-700">
                          Hasta: {new Date(user.blockedUntil).toLocaleDateString('es-ES')}
                        </p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </section>
        )}

        <section aria-labelledby="audit-title">
          <h2 id="audit-title" className="text-2xl font-bold text-text mb-4">Registro de Auditoria</h2>
          <AuditLog logs={[...auditLogs].reverse().slice(0, 50)} users={users} />
        </section>
      </main>

      <Modal
        isOpen={rejectModal.open}
        title="Rechazar reserva"
        message="Indica el motivo del rechazo. El usuario podra verlo."
        type="warning"
        onClose={() => setRejectModal({ open: false, reservationId: null })}
      >
        <div className="mt-2">
          <label htmlFor="rejection-reason" className="block text-sm font-semibold text-text mb-1">
            Motivo de rechazo
          </label>
          <textarea
            id="rejection-reason"
            rows={3}
            className="w-full px-3 py-2 rounded-input border border-border bg-surface text-text text-sm focus:ring-2 focus:ring-brand-300 outline-none resize-none"
            placeholder="Ej: El espacio esta en mantenimiento ese dia..."
            value={rejectionReason}
            onChange={(e) => setRejectionReason(e.target.value)}
          />
        </div>
        <div className="flex gap-2 justify-end mt-4">
          <Button variant="secondary" size="sm" className="cursor-pointer flex items-center justify-center 
            text-xs font-semibold rounded-btn bg-gray-100 text-black hover:bg-gray-200 
            dark:bg-white dark:text-black dark:hover:bg-gray-100 border border-gray-300
            px-5 py-3 transition-all duration-200" 
            onClick={() => setRejectModal({ open: false, reservationId: null })}>
            Cancelar
          </Button>
          <Button variant="danger" size="sm" disabled={!rejectionReason.trim()} onClick={handleReject}>
            <FiX /> Confirmar rechazo
          </Button>
        </div>
      </Modal>
    </div>
  );
}
