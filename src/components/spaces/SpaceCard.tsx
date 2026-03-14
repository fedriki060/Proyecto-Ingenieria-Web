import type { Space } from '../../types';
import { SpaceType } from '../../types';
import Button from '../ui/Button';
import Badge from '../ui/Badge';
import { FiMapPin, FiUsers, FiShoppingCart } from 'react-icons/fi';

type Props = {
  space: Space;
  onAddToCart?: (space: Space) => void;
  onClick?: () => void;
};

const SPACE_TYPE_ICONS: Record<SpaceType, string> = {
  [SpaceType.CLASSROOM]: '🎓',
  [SpaceType.LAB]: '🔬',
  [SpaceType.COURT]: '🏀',
  [SpaceType.MEETING_ROOM]: '🤝',
  [SpaceType.AUDITORIUM]: '🎤',
  [SpaceType.OTHER]: '📍',
};

export default function SpaceCard({ space, onAddToCart, onClick }: Props) {
  const icon = SPACE_TYPE_ICONS[space.type];
  const statusColor = space.isActive ? 'success' : 'danger';
  const statusText = space.isActive ? 'Disponible' : 'No Disponible';

  return (
    <div 
      className="
        rounded-card 
        border border-border 
        bg-surface dark:bg-page 
        p-4 
        shadow-card 
        hover:shadow-pop 
        transition-all 
        cursor-pointer
      "
      onClick={onClick}
    >
      {/* Header */}
      <div className="flex items-start justify-between gap-3 mb-3">
        <div>
          <h3 className="text-lg font-semibold text-text dark:text-surface m-0 flex items-center gap-2">
            {icon} {space.name}
          </h3>
          <p className="text-sm text-muted dark:text-gray-400 m-0 flex items-center gap-1 mt-1">
            <FiMapPin size={14} /> {space.building}
          </p>
        </div>
        <Badge variant={statusColor}>{statusText}</Badge>
      </div>

      {/* Capacidad */}
      <div className="flex items-center gap-2 mb-3 text-sm">
        <FiUsers size={16} className="text-muted dark:text-gray-400" />
        <span className="text-text dark:text-surface">
          <strong>{space.capacity}</strong> personas
        </span>
      </div>

      {/* Recursos */}
      {space.resources.length > 0 && (
        <div className="mb-3">
          <p className="text-xs font-semibold text-muted dark:text-gray-400 uppercase mb-1">
            Recursos
          </p>
          <div className="flex flex-wrap gap-1">
            {space.resources.map((resource) => (
              <span
                key={resource}
                className="text-xs bg-brand-50 dark:bg-brand-900 text-brand-700 dark:text-brand-300 rounded-full px-2 py-1"
              >
                {resource}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Requiere Aprobación */}
      {space.requiresApproval && (
        <div className="mb-3 bg-warning-50 dark:bg-warning-900 border border-warning-200 dark:border-warning-700 rounded-card p-2">
          <p className="text-xs text-warning-700 dark:text-warning-300 m-0">
            ⚠️ Requiere aprobación del administrador
          </p>
        </div>
      )}

      {/* Programas Permitidos */}
      {space.allowedPrograms.length > 0 && (
        <div className="mb-3">
          <p className="text-xs font-semibold text-muted dark:text-gray-400 uppercase mb-1">
            Programas
          </p>
          <div className="flex flex-wrap gap-1">
            {space.allowedPrograms.map((program) => (
              <span
                key={program}
                className="text-xs bg-brand-50 dark:bg-brand-900 text-brand-700 dark:text-brand-300 rounded-full px-2 py-1"
              >
                {program}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Botón */}
      {onAddToCart && space.isActive && (
        <Button
          variant="primary"
          size="sm"
          onClick={(e) => {
            e.stopPropagation();
            onAddToCart(space);
          }}
          className="w-full justify-center gap-2 mt-3"
        >
          <FiShoppingCart size={16} /> Reservar
        </Button>
      )}
    </div>
  );
}