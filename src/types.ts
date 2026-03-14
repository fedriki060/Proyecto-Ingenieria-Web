// Enums
export enum UserRole {
  STUDENT = 'STUDENT',
  STAFF = 'STAFF',
  ADMIN = 'ADMIN',
}

export enum ReservationStatus {
  PENDING = 'PENDING',
  APPROVED = 'APPROVED',
  REJECTED = 'REJECTED',
  CANCELLED = 'CANCELLED',
}

export enum SpaceType {
  CLASSROOM = 'CLASSROOM',
  LAB = 'LAB',
  COURT = 'COURT',
  MEETING_ROOM = 'MEETING_ROOM',
  AUDITORIUM = 'AUDITORIUM',
  OTHER = 'OTHER',
}

export enum AuditAction {
  RESERVATION_CREATED = 'RESERVATION_CREATED',
  RESERVATION_APPROVED = 'RESERVATION_APPROVED',
  RESERVATION_REJECTED = 'RESERVATION_REJECTED',
  RESERVATION_CANCELLED = 'RESERVATION_CANCELLED',
  SPACE_CREATED = 'SPACE_CREATED',
  SPACE_UPDATED = 'SPACE_UPDATED',
  SPACE_DELETED = 'SPACE_DELETED',
  USER_BLOCKED = 'USER_BLOCKED',
  USER_UNBLOCKED = 'USER_UNBLOCKED',
}

// Interfaces
export interface User {
  id: number;
  name: string;
  email: string;
  role: UserRole;
  program?: string;
  isBlocked: boolean;
  blockedUntil?: Date;
  noShowCount: number;
  createdAt: Date;
}

export interface Space {
  id: number;
  name: string;
  building: string;
  type: SpaceType;
  capacity: number;
  resources: string[];
  requiresApproval: boolean;
  isActive: boolean;
  allowedPrograms: string[];
  createdAt: Date;
}

export interface Reservation {
  id: number;
  spaceId: number;
  userId: number;
  date: string;
  startTime: string;
  endTime: string;
  purpose: string;
  attendeeCount: number;
  status: ReservationStatus;
  approvedBy?: number;
  rejectionReason?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface TimeSlot {
  startTime: string;
  endTime: string;
  available: boolean;
}

export interface TimeConflict {
  hasConflict: boolean;
  conflictingReservations?: Reservation[];
  suggestedSlots?: TimeSlot[];
}

export interface AuditLog {
  id: number;
  userId: number;
  action: AuditAction;
  entityType: 'RESERVATION' | 'SPACE' | 'USER';
  entityId: number;
  changes?: Record<string, any>;
  timestamp: Date;
}

// DTOs
export interface CreateReservationDTO {
  spaceId: number;
  date: string;
  startTime: string;
  endTime: string;
  purpose: string;
  attendeeCount: number;
}

export interface ApproveReservationDTO {
  reservationId: number;
  approvedBy: number;
}

export interface RejectReservationDTO {
  reservationId: number;
  rejectionReason: string;
  rejectedBy: number;
}

export interface CreateSpaceDTO {
  name: string;
  building: string;
  type: SpaceType;
  capacity: number;
  resources: string[];
  requiresApproval: boolean;
  allowedPrograms: string[];
}