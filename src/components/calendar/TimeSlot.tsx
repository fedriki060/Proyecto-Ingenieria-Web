interface TimeSlotProps {
  reservations: any[];
}

export default function TimeSlot({ reservations }: TimeSlotProps) {
  if (reservations.length === 0) return null;

  return (
    <div className="flex flex-col gap-1">
      {reservations.map((reservation) => (
        <span
          key={reservation.id}
          className="bg-red-600 text-white px-1 py-0.5 rounded text-xs font-semibold"
        >
          Ocupado
        </span>
      ))}
    </div>
  );
}