import type { User, Space, Reservation, AuditLog } from "../types";
import { UserRole, SpaceType, ReservationStatus, AuditAction } from "../types";

// ===== USERS (15) =====
export const seedUsers: User[] = [
{ id:1,name:"Admin",email:"admin@salafinder.com",role:UserRole.ADMIN,program:"Admin",isBlocked:false,noShowCount:0,createdAt:new Date() },
{ id:2,name:"Juan Perez",email:"juan@uni.com",role:UserRole.STUDENT,program:"Ingeniería",isBlocked:false,noShowCount:0,createdAt:new Date() },
{ id:3,name:"staff1",email:"staff1@salafinder.com",role:UserRole.STAFF,program:"TI",isBlocked:false,noShowCount:0,createdAt:new Date() },
{ id:4,name:"Carlos Lopez",email:"carlos@uni.com",role:UserRole.STUDENT,program:"Administración",isBlocked:false,noShowCount:1,createdAt:new Date() },
{ id:5,name:"Laura Torres",email:"laura@uni.com",role:UserRole.STUDENT,program:"Ingeniería",isBlocked:false,noShowCount:0,createdAt:new Date() },
{ id:6,name:"Andres Gomez",email:"andres@uni.com",role:UserRole.STAFF,program:"TI",isBlocked:false,noShowCount:0,createdAt:new Date() },
{ id:7,name:"Sofia Ramirez",email:"sofia@uni.com",role:UserRole.STUDENT,program:"Ingeniería",isBlocked:false,noShowCount:0,createdAt:new Date() },
{ id:8,name:"Mateo Diaz",email:"mateo@uni.com",role:UserRole.STUDENT,program:"Administración",isBlocked:false,noShowCount:0,createdAt:new Date() },
{ id:9,name:"Daniela Rojas",email:"daniela@uni.com",role:UserRole.STUDENT,program:"Ingeniería",isBlocked:false,noShowCount:0,createdAt:new Date() },
{ id:10,name:"Pedro Vargas",email:"pedro@uni.com",role:UserRole.STAFF,program:"Tecnología",isBlocked:false,noShowCount:0,createdAt:new Date() },
{ id:11,name:"Ana Morales",email:"ana@uni.com",role:UserRole.STUDENT,program:"Ingeniería",isBlocked:false,noShowCount:0,createdAt:new Date() },
{ id:12,name:"Luis Castro",email:"luis@uni.com",role:UserRole.STUDENT,program:"Administración",isBlocked:false,noShowCount:0,createdAt:new Date() },
{ id:13,name:"Valeria Ruiz",email:"valeria@uni.com",role:UserRole.STUDENT,program:"Ingeniería",isBlocked:false,noShowCount:0,createdAt:new Date() },
{ id:14,name:"Miguel Soto",email:"miguel@uni.com",role:UserRole.STAFF,program:"TI",isBlocked:false,noShowCount:0,createdAt:new Date() },
{ id:15,name:"Camila Pardo",email:"camila@uni.com",role:UserRole.STUDENT,program:"Administración",isBlocked:false,noShowCount:0,createdAt:new Date() }
];

// ===== SPACES (6) =====
export const seedSpaces: Space[] = [
{ id:1,name:"Aula 101",building:"Edificio A",type:SpaceType.CLASSROOM,capacity:30,resources:["Proyector"],allowedPrograms:["Ingeniería"],requiresApproval:false,isActive:true,createdAt:new Date()},
{ id:2,name:"Aula 102",building:"Edificio A",type:SpaceType.CLASSROOM,capacity:40,resources:["Proyector","AC"],allowedPrograms:["Administración"],requiresApproval:false,isActive:true,createdAt:new Date()},
{ id:3,name:"Laboratorio Sistemas",building:"Edificio B",type:SpaceType.LAB,capacity:25,resources:["PC","WiFi"],allowedPrograms:["Ingeniería"],requiresApproval:true,isActive:true,createdAt:new Date()},
{ id:4,name:"Sala de Juntas",building:"Administrativo",type:SpaceType.MEETING_ROOM,capacity:15,resources:["TV","Video"],allowedPrograms:[],requiresApproval:true,isActive:true,createdAt:new Date()},
{ id:5,name:"Cancha Baloncesto",building:"Deportivo",type:SpaceType.COURT,capacity:100,resources:["Balones"],allowedPrograms:[],requiresApproval:false,isActive:true,createdAt:new Date()},
{ id:6,name:"Auditorio",building:"Central",type:SpaceType.AUDITORIUM,capacity:300,resources:["Escenario","Sonido"],allowedPrograms:[],requiresApproval:true,isActive:true,createdAt:new Date()}
];

// ===== RESERVATIONS (30) =====
export const seedReservations: Reservation[] = Array.from({ length: 30 }, (_, i) => {
  const spaceId = (i % 6) + 1;
  const userId = ((i % 14) + 2);
  const day = 13 + (i % 5);

  return {
    id: i + 1,
    spaceId,
    userId,
    date: `2026-03-${day}`,
    startTime: `${8 + (i % 8)}:00`,
    endTime: `${9 + (i % 8)}:00`,
    purpose: "Academic activity",
    attendeeCount: 10 + (i % 20),
    status: i % 5 === 0 ? ReservationStatus.PENDING : ReservationStatus.APPROVED,
    approvedBy: 1,
    createdAt: new Date(),
    updatedAt: new Date()
  };
});

// ===== AUDIT LOGS (20+) =====
export const seedAuditLogs: AuditLog[] = Array.from({ length: 20 }, (_, i) => ({
  id: i + 1,
  userId: (i % 10) + 1,
  action: i % 2 === 0 ? AuditAction.RESERVATION_CREATED : AuditAction.RESERVATION_APPROVED,
  entityType: "RESERVATION",
  entityId: (i % 30) + 1,
  timestamp: new Date()
}));