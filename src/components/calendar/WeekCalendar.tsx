import React, { useState } from 'react';
import type { Reservation, Space } from '../../types';
import { FiChevronLeft, FiChevronRight } from 'react-icons/fi';
import Button from '../ui/Button';
import TimeSlot from './TimeSlot';
import Card from '../ui/Card';

interface WeekCalendarProps {
  space: Space;
  reservations: Reservation[];
  onSlotClick?: (date: string, startTime: string, endTime: string) => void;
}

export default function WeekCalendar({ space, reservations, onSlotClick }: WeekCalendarProps) {
  const [currentDate, setCurrentDate] = useState(new Date());

  // Obtener lunes de la semana
  const getMonday = (date: Date) => {
    const d = new Date(date);
    const day = d.getDay();
    const diff = d.getDate() - day + (day === 0 ? -6 : 1);
    return new Date(d.setDate(diff));
  };

  const monday = getMonday(currentDate);
  const weekDays = Array.from({ length: 7 }, (_, i) => {
    const day = new Date(monday);
    day.setDate(day.getDate() + i);
    return day;
  });

  const timeSlots = Array.from({ length: 24 }, (_, i) => `${String(i).padStart(2, '0')}:00`);

  const getReservationsForSlot = (date: string, startTime: string, endTime: string) => {
    return reservations.filter(
      (res) =>
        res.spaceId === space.id &&
        res.date === date &&
        res.startTime < endTime &&
        res.endTime > startTime
    );
  };

  const handlePrevWeek = () => {
    const newDate = new Date(currentDate);
    newDate.setDate(newDate.getDate() - 7);
    setCurrentDate(newDate);
  };

  const handleNextWeek = () => {
    const newDate = new Date(currentDate);
    newDate.setDate(newDate.getDate() + 7);
    setCurrentDate(newDate);
  };

  const formatDate = (date: Date) => {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
};
  const dayNames = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo'];

  return (
    <Card className="w-full overflow-x-auto">
      {/* Header */}
      <div className="mb-4 flex items-center justify-between">
        <h3 className="font-semibold text-text text-surface">{space.name}</h3>
        <div className="flex gap-2">
          <Button
            variant="secondary"
            size="sm"
            onClick={handlePrevWeek}
            className="bg-brand-600 text-white hover:bg-brand-700 dark:bg-brand-600 transition-colors cursor-pointer"
          >
            <FiChevronLeft /> Anterior
          </Button>
          <Button
            variant="secondary"
            size="sm"
            onClick={handleNextWeek}
            className="bg-brand-600 text-white hover:bg-brand-700 dark:bg-brand-600 transition-colors cursor-pointer"
          >
            Siguiente <FiChevronRight />
          </Button>
        </div>
      </div>

      {/* Tabla de horarios */}
      <div className="overflow-x-auto">
        <table className="w-full border-collapse text-sm">
          <thead>
            <tr className="border-b border-border">
              <th className="px-2 py-2 text-left text-xs font-semibold text-muted">
                Hora
              </th>
              {weekDays.map((day, idx) => (
                <th
                  key={idx}
                  className="px-2 py-2 text-center text-xs font-semibold text-text"
                >
                  <div>{dayNames[idx]}</div>
                  <div className="text-muted dark:text-gray-400">{day.toLocaleDateString('es-ES')}</div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {timeSlots.map((time) => (
              <tr
                key={time}
                className="border-b border-border hover:bg-page dark:hover:bg-gray-700 transition-colors"
              >
                <td className="px-2 py-2 text-xs font-semibold text-muted text-gray-400 bg-page bg-gray-800">
                  {time}
                </td>
                {weekDays.map((day, idx) => {
                  const dateStr = formatDate(day);
                  const nextHour = String((parseInt(time) + 1) % 24).padStart(2, '0') + ':00';
                  const dayReservations = getReservationsForSlot(dateStr, time, nextHour);

                  return (
                    <td
                      key={`${idx}-${time}`}
                      onClick={() => onSlotClick?.(dateStr, time, nextHour)}
                      className="px-1 py-1 border-r border-border cursor-pointer
                                 bg-page bg-gray-800
                                 hover:bg-brand-50 dark:hover:bg-brand-500 transition-colors h-6"
                    >
                      <TimeSlot reservations={dayReservations} />
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Card>
  );
}