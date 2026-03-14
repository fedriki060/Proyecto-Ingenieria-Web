import type { Reservation, TimeConflict, TimeSlot } from '../types';

export function detectConflicts(
  spaceId: number,
  date: string,
  startTime: string,
  endTime: string,
  reservations: Reservation[]
): TimeConflict {
  const spaceReservations = reservations.filter(
    (r) =>
      r.spaceId === spaceId &&
      r.date === date &&
      (r.status === 'APPROVED' || r.status === 'PENDING')
  );

  const conflicts = spaceReservations.filter((res) => {
    return !(endTime <= res.startTime || startTime >= res.endTime);
  });

  if (conflicts.length === 0) {
    return {
      hasConflict: false,
      conflictingReservations: [],
      suggestedSlots: generateSuggestedSlots(spaceId, date, startTime, endTime, reservations),
    };
  }

  return {
    hasConflict: true,
    conflictingReservations: conflicts,
    suggestedSlots: generateSuggestedSlots(spaceId, date, startTime, endTime, reservations),
  };
}

function generateSuggestedSlots(
  spaceId: number,
  date: string,
  startTime: string,
  endTime: string,
  reservations: Reservation[]
): TimeSlot[] {
  const slots: TimeSlot[] = [];
  const spaceReservations = reservations.filter(
    (r) =>
      r.spaceId === spaceId &&
      r.date === date &&
      (r.status === 'APPROVED' || r.status === 'PENDING')
  );

  const duration = parseInt(endTime.split(':')[0]) - parseInt(startTime.split(':')[0]);

  for (let hour = 8; hour < 20 - duration; hour++) {
    const slotStart = String(hour).padStart(2, '0') + ':00';
    const slotEnd = String(hour + duration).padStart(2, '0') + ':00';

    const hasConflict = spaceReservations.some(
      (res) => !(slotEnd <= res.startTime || slotStart >= res.endTime)
    );

    if (!hasConflict) {
      slots.push({
        startTime: slotStart,
        endTime: slotEnd,
        available: true,
      });
    }
  }

  return slots.slice(0, 3);
}