import type { User } from "../types";
import { seedUsers, seedReservations } from "../data/seed";
import { ReservationStatus } from "../types";

let users = [...seedUsers];
let reservations = [...seedReservations];

const MAX_NO_SHOWS = 2;
const BLOCKING_DAYS = 7;

export function getUsers(): User[] {
  return [...users];
}

export function getUserById(id: number): User | undefined {
  return users.find((u) => u.id === id);
}

export function getUsersByRole(role: string): User[] {
  return users.filter((u) => u.role === role);
}

export function incrementNoShowCount(userId: number): User | null {
  const user = users.find((u) => u.id === userId);
  if (!user) return null;

  user.noShowCount += 1;

  // Si alcanzó el máximo, bloquear
  if (user.noShowCount >= MAX_NO_SHOWS) {
    blockUserForDays(userId, BLOCKING_DAYS);
  }

  return user;
}

export function blockUserForDays(userId: number, days: number): User | null {
  const user = users.find((u) => u.id === userId);
  if (!user) return null;

  user.isBlocked = true;
  const blockedUntil = new Date();
  blockedUntil.setDate(blockedUntil.getDate() + days);
  user.blockedUntil = blockedUntil;

  return user;
}

export function unblockUser(userId: number): User | null {
  const user = users.find((u) => u.id === userId);
  if (!user) return null;

  user.isBlocked = false;
  user.blockedUntil = undefined;

  return user;
}

export function checkAndUnblockExpiredUsers(): void {
  const now = new Date();
  users.forEach((user) => {
    if (user.isBlocked && user.blockedUntil && user.blockedUntil < now) {
      user.isBlocked = false;
      user.blockedUntil = undefined;
    }
  });
}

export function getNoShowRatio(userId: number): { ratio: number; count: number } {
  const userReservations = reservations.filter((r) => r.userId === userId);
  const noShowCount = userReservations.filter(
    (r) =>
      r.status === ReservationStatus.CANCELLED &&
      new Date(r.date) < new Date() // Reservas pasadas
  ).length;

  const ratio = userReservations.length > 0 ? (noShowCount / userReservations.length) * 100 : 0;
  return { ratio, count: noShowCount };
}