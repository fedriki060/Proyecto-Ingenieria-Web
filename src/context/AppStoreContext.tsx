import {
  createContext,
  useState,
  useCallback,
  useContext,
  useEffect,
  type ReactNode,
} from 'react';
import type {
  Reservation,
  Space,
  User,
  AuditLog,
  CreateReservationDTO,
  ApproveReservationDTO,
  RejectReservationDTO,
} from '../types';
import { ReservationStatus, AuditAction } from '../types';
import { seedUsers, seedSpaces, seedReservations, seedAuditLogs } from '../data/seed';

// ─── helpers localStorage ──────────────────────────────────────────
function load<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
}
function save<T>(key: string, value: T) {
  localStorage.setItem(key, JSON.stringify(value));
}

// ─── tipos del contexto ────────────────────────────────────────────
interface AppStoreContextType {
  reservations: Reservation[];
  spaces: Space[];
  users: User[];
  auditLogs: AuditLog[];
  isLoading: boolean;
  // Reservas
  createReservation: (
    dto: CreateReservationDTO,
    userId: number,
    space: Space
  ) => Promise<Reservation>;
  approveReservation: (dto: ApproveReservationDTO) => Promise<Reservation>;
  rejectReservation: (dto: RejectReservationDTO) => Promise<Reservation>;
  cancelReservation: (reservationId: number, userId: number) => Promise<void>;
  // Helpers
  getReservationsByUser: (userId: number) => Reservation[];
  getPendingReservations: () => Reservation[];
  // Usuarios
  updateUser: (userId: number, updates: Partial<User>) => void;
}

export const AppStoreContext = createContext<AppStoreContextType>({} as AppStoreContextType);

export function useAppStore() {
  return useContext(AppStoreContext);
}

// ─── simulación de latencia ────────────────────────────────────────
function delay(ms = 600) {
  return new Promise<void>((res) => setTimeout(res, ms));
}

// ─── proveedor ─────────────────────────────────────────────────────
export function AppStoreProvider({ children }: { children: ReactNode }) {
  const [reservations, setReservations] = useState<Reservation[]>(() =>
    load('sf_reservations', seedReservations)
  );
  const [spaces] = useState<Space[]>(() =>
    load('sf_spaces', seedSpaces)
  );
  const [users, setUsers] = useState<User[]>(() =>
    load('sf_users', seedUsers)
  );
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>(() =>
    load('sf_audit', seedAuditLogs)
  );
  const [isLoading, setIsLoading] = useState(false);

  // Persistir en localStorage cuando cambia el estado
  useEffect(() => { save('sf_reservations', reservations); }, [reservations]);
  useEffect(() => { save('sf_users', users); }, [users]);
  useEffect(() => { save('sf_audit', auditLogs); }, [auditLogs]);

  // ── helpers internos ──
  const addAuditLog = useCallback(
    (
      userId: number,
      action: AuditAction,
      entityType: 'RESERVATION' | 'SPACE' | 'USER',
      entityId: number,
      changes?: Record<string, unknown>
    ) => {
      const log: AuditLog = {
        id: Date.now(),
        userId,
        action,
        entityType,
        entityId,
        changes,
        timestamp: new Date(),
      };
      setAuditLogs((prev) => [...prev, log]);
    },
    []
  );

  // ── crear reserva ──
  const createReservation = useCallback(
    async (dto: CreateReservationDTO, userId: number, space: Space): Promise<Reservation> => {
      setIsLoading(true);
      await delay();
      const newRes: Reservation = {
        id: Date.now(),
        spaceId: dto.spaceId,
        userId,
        date: dto.date,
        startTime: dto.startTime,
        endTime: dto.endTime,
        purpose: dto.purpose,
        attendeeCount: dto.attendeeCount,
        status: space.requiresApproval
          ? ReservationStatus.PENDING
          : ReservationStatus.APPROVED,
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      setReservations((prev) => [...prev, newRes]);
      addAuditLog(userId, AuditAction.RESERVATION_CREATED, 'RESERVATION', newRes.id, {
        spaceId: dto.spaceId,
        date: dto.date,
      });
      setIsLoading(false);
      return newRes;
    },
    [addAuditLog]
  );

  // ── aprobar reserva ──
  const approveReservation = useCallback(
    async (dto: ApproveReservationDTO): Promise<Reservation> => {
      setIsLoading(true);
      await delay(400);
      let updated!: Reservation;
      setReservations((prev) =>
        prev.map((r) => {
          if (r.id !== dto.reservationId) return r;
          updated = { ...r, status: ReservationStatus.APPROVED, approvedBy: dto.approvedBy, updatedAt: new Date() };
          return updated;
        })
      );
      addAuditLog(dto.approvedBy, AuditAction.RESERVATION_APPROVED, 'RESERVATION', dto.reservationId);
      setIsLoading(false);
      return updated;
    },
    [addAuditLog]
  );

  // ── rechazar reserva ──
  const rejectReservation = useCallback(
    async (dto: RejectReservationDTO): Promise<Reservation> => {
      setIsLoading(true);
      await delay(400);
      let updated!: Reservation;
      setReservations((prev) =>
        prev.map((r) => {
          if (r.id !== dto.reservationId) return r;
          updated = {
            ...r,
            status: ReservationStatus.REJECTED,
            rejectionReason: dto.rejectionReason,
            updatedAt: new Date(),
          };
          return updated;
        })
      );
      addAuditLog(dto.rejectedBy, AuditAction.RESERVATION_REJECTED, 'RESERVATION', dto.reservationId, {
        reason: dto.rejectionReason,
      });
      setIsLoading(false);
      return updated;
    },
    [addAuditLog]
  );

  // ── cancelar reserva ──
  const cancelReservation = useCallback(
    async (reservationId: number, userId: number): Promise<void> => {
      setIsLoading(true);
      await delay(400);
      setReservations((prev) =>
        prev.map((r) =>
          r.id === reservationId
            ? { ...r, status: ReservationStatus.CANCELLED, updatedAt: new Date() }
            : r
        )
      );
      addAuditLog(userId, AuditAction.RESERVATION_CANCELLED, 'RESERVATION', reservationId);
      setIsLoading(false);
    },
    [addAuditLog]
  );

  // ── helpers de consulta ──
  const getReservationsByUser = useCallback(
    (userId: number) => reservations.filter((r) => r.userId === userId),
    [reservations]
  );

  const getPendingReservations = useCallback(
    () => reservations.filter((r) => r.status === ReservationStatus.PENDING),
    [reservations]
  );

  const updateUser = useCallback((userId: number, updates: Partial<User>) => {
    setUsers((prev) =>
      prev.map((u) => (u.id === userId ? { ...u, ...updates } : u))
    );
  }, []);

  return (
    <AppStoreContext.Provider
      value={{
        reservations,
        spaces,
        users,
        auditLogs,
        isLoading,
        createReservation,
        approveReservation,
        rejectReservation,
        cancelReservation,
        getReservationsByUser,
        getPendingReservations,
        updateUser,
      }}
    >
      {children}
    </AppStoreContext.Provider>
  );
}
