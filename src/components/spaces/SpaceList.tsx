import React, { useState, useMemo } from 'react';
import type { Space } from '../../types';
import { SpaceType } from '../../types';
import SpaceCard from './SpaceCard';
import SpaceFilters from './SpaceFilters';
import StateMessage from '../ui/StateMessage';

interface SpaceListProps {
  spaces: Space[];
  onSelectSpace?: (space: Space) => void;
}

export default function SpaceList({ spaces, onSelectSpace }: SpaceListProps) {
  const [selectedType, setSelectedType] = useState<SpaceType | undefined>();
  const [selectedBuilding, setSelectedBuilding] = useState<string | undefined>();

  const buildings = useMemo(() => {
    return Array.from(new Set(spaces.map((s) => s.building))).sort();
  }, [spaces]);

  const filteredSpaces = useMemo(() => {
    return spaces.filter((space) => {
      const matchesType = !selectedType || space.type === selectedType;
      const matchesBuilding = !selectedBuilding || space.building === selectedBuilding;
      return matchesType && matchesBuilding;
    });
  }, [spaces, selectedType, selectedBuilding]);

  const handleReset = () => {
    setSelectedType(undefined);
    setSelectedBuilding(undefined);
  };

  return (
    <div>
      <SpaceFilters
        selectedType={selectedType}
        onTypeChange={setSelectedType}
        selectedBuilding={selectedBuilding}
        onBuildingChange={setSelectedBuilding}
        buildings={buildings}
        onReset={handleReset}
      />

      {filteredSpaces.length === 0 ? (
        <StateMessage
          type="empty"
          title="Sin espacios disponibles"
          description="No hay espacios que coincidan con los filtros seleccionados."
          actionText="Limpiar filtros"
          onAction={handleReset}
        />
      ) : (
        <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
          {filteredSpaces.map((space) => (
            <SpaceCard
              key={space.id}
              space={space}
              onClick={() => onSelectSpace?.(space)}
            />
          ))}
        </div>
      )}

      <div className="mt-4 text-center text-sm text-muted">
        Mostrando {filteredSpaces.length} de {spaces.length} espacios
      </div>
    </div>
  );
}