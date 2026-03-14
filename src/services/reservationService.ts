import type { Reservation, CreateReservationDTO, ApproveReservationDTO, RejectReservationDTO } from "../types";
import { ReservationStatus } from "../types";
import { seedReservations } from "../data/seed";

let reservations = [...seedReservations];

export function createReservation(
  dto: CreateReservationDTO,
  userId: number,
  space: any
): Reservation {
  const reservation: Reservation = {
    id: Math.max(...reservations.map((r) => r.id), 0) + 1,
    spaceId: dto.spaceId,
    userId,
    date: dto.date,
    startTime: dto.startTime,
    endTime: dto.endTime,
    purpose: dto.purpose,
    attendeeCount: dto.attendeeCount,
    status: space.requiresApproval ? ReservationStatus.PENDING : ReservationStatus.APPROVED,
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  reservations.push(reservation);
  return reservation;
}

export function getReservationsBySpace(spaceId: number): Reservation[] {
  return reservations.filter((r) => r.spaceId === spaceId);
}

export function getReservationsByUser(userId: number): Reservation[] {
  return reservations.filter((r) => r.userId === userId);
}

export function getPendingReservations(): Reservation[] {
  return reservations.filter((r) => r.status === ReservationStatus.PENDING);
}

export function approveReservation(dto: ApproveReservationDTO): Reservation | null {
  const reservation = reservations.find((r) => r.id === dto.reservationId);
  if (!reservation) return null;

  reservation.status = ReservationStatus.APPROVED;
  reservation.approvedBy = dto.approvedBy;
  reservation.updatedAt = new Date();
  return reservation;
}

export function rejectReservation(dto: RejectReservationDTO): Reservation | null {
  const reservation = reservations.find((r) => r.id === dto.reservationId);
  if (!reservation) return null;

  reservation.status = ReservationStatus.REJECTED;
  reservation.rejectionReason = dto.rejectionReason;
  reservation.updatedAt = new Date();
  return reservation;
}

export function cancelReservation(reservationId: number): Reservation | null {
  const reservation = reservations.find((r) => r.id === reservationId);
  if (!reservation) return null;

  reservation.status = ReservationStatus.CANCELLED;
  reservation.updatedAt = new Date();
  return reservation;
}

export function getReservations(): Reservation[] {
  return [...reservations];
}