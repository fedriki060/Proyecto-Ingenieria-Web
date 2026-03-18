import { SpaceType } from '../../types';
import Button from '../ui/Button';
import { FiX } from 'react-icons/fi';

export interface SpaceFiltersProps {
  selectedType?: SpaceType;
  onTypeChange: (type: SpaceType | undefined) => void;
  selectedBuilding?: string;
  onBuildingChange: (building: string | undefined) => void;
  buildings: string[];
  onReset: () => void;
}

export default function SpaceFilters({
  selectedType,
  onTypeChange,
  selectedBuilding,
  onBuildingChange,
  buildings,
  onReset,
}: SpaceFiltersProps) {
  const spaceTypes = [
    { value: SpaceType.CLASSROOM, label: '🎓 Aulas' },
    { value: SpaceType.LAB, label: '🔬 Laboratorios' },
    { value: SpaceType.COURT, label: '⚽ Canchas' },
    { value: SpaceType.MEETING_ROOM, label: '💼 Salas de Reuniones' },
  ];

  return (
    <div className="bg-surface rounded-card border border-border p-4 shadow-card mb-4 " >
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-semibold text-text">Filtros</h3>
        <Button variant="secondary" size="sm" onClick={onReset} className="gap-2">
          <FiX size={16} /> Limpiar
        </Button>
      </div>

      <div className="space-y-4">
        {/* Tipo */}
        <div>
          <label className="text-sm font-semibold text-text block mb-2">Tipo de Espacio</label>
          <div className="grid grid-cols-2 gap-2">
            {spaceTypes.map((type) => (
              <button
                key={type.value}
                onClick={() =>
                  onTypeChange(selectedType === type.value ? undefined : type.value)
                }
                className={`px-3 py-2 text-sm rounded-input border transition-all ${
                  selectedType === type.value
                    ? 'bg-brand-600 text-surface border-brand-600'
                    : 'bg-page text-text border-border hover:border-brand-300'
                }`}
              >
                {type.label}
              </button>
            ))}
          </div>
        </div>

        {/* Edificio */}
        <div>
          <label className="text-sm font-semibold text-text block mb-2">Edificio</label>
          <div className="grid grid-cols-2 gap-2">
            {buildings.map((building) => (
              <button
                key={building}
                onClick={() =>
                  onBuildingChange(selectedBuilding === building ? undefined : building)
                }
                className={`px-3 py-2 text-sm rounded-input border transition-all ${
                  selectedBuilding === building
                    ? 'bg-brand-600 text-surface border-brand-600'
                    : 'bg-page text-text border-border hover:border-brand-300'
                }`}
              >
                {building}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}