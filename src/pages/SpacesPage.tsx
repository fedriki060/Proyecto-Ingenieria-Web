import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppStore } from '../context/AppStoreContext';
import StateMessage from '../components/ui/StateMessage';
import Badge from '../components/ui/Badge';
import { SpaceType } from '../types';
import { FiMapPin, FiUsers, FiFilter } from 'react-icons/fi';

const typeLabels: Record<SpaceType, string> = {
  [SpaceType.CLASSROOM]: 'Aula',
  [SpaceType.LAB]: 'Laboratorio',
  [SpaceType.COURT]: 'Cancha',
  [SpaceType.MEETING_ROOM]: 'Sala de reuniones',
  [SpaceType.AUDITORIUM]: 'Auditorio',
  [SpaceType.OTHER]: 'Otro',
};

export default function SpacesPage() {
  const navigate = useNavigate();
  const { spaces } = useAppStore();

  const [filterType, setFilterType] = useState('');
  const [filterBuilding, setFilterBuilding] = useState('');
  const [filterCapacity, setFilterCapacity] = useState('');
  const [filterResource, setFilterResource] = useState('');

  const buildings = [...new Set(spaces.map((s) => s.building))];
  const allResources = [...new Set(spaces.flatMap((s) => s.resources))];

  const filtered = spaces.filter((space) => {
    if (!space.isActive) return false;
    if (filterType && space.type !== filterType) return false;
    if (filterBuilding && space.building !== filterBuilding) return false;
    if (filterCapacity && space.capacity < parseInt(filterCapacity)) return false;
    if (filterResource && !space.resources.includes(filterResource)) return false;
    return true;
  });

  const hasFilters = filterType || filterBuilding || filterCapacity || filterResource;

  return (
    <main className="mx-auto max-w-6xl px-6 py-6">
      <h1 className="text-3xl font-bold text-text mb-6">Espacios disponibles</h1>

      {/* Filtros */}
      <section aria-label="Filtros de busqueda" className="bg-surface border border-border rounded-card p-4 mb-6">
        <div className="flex items-center gap-2 mb-3">
          <FiFilter aria-hidden="true" className="text-muted" />
          <span className="text-sm font-semibold text-text">Filtrar espacios</span>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <div>
            <label htmlFor="filter-type" className="block text-xs font-semibold text-muted mb-1 uppercase">
              Tipo
            </label>
            <select
              id="filter-type"
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="w-full px-3 py-2 rounded-input border border-border bg-page text-text text-sm focus:ring-2 focus:ring-brand-300 outline-none"
            >
              <option value="">Todos</option>
              {Object.entries(typeLabels).map(([value, label]) => (
                <option key={value} value={value}>{label}</option>
              ))}
            </select>
          </div>

          <div>
            <label htmlFor="filter-building" className="block text-xs font-semibold text-muted mb-1 uppercase">
              Edificio
            </label>
            <select
              id="filter-building"
              value={filterBuilding}
              onChange={(e) => setFilterBuilding(e.target.value)}
              className="w-full px-3 py-2 rounded-input border border-border bg-page text-text text-sm focus:ring-2 focus:ring-brand-300 outline-none"
            >
              <option value="">Todos</option>
              {buildings.map((b) => (
                <option key={b} value={b}>{b}</option>
              ))}
            </select>
          </div>

          <div>
            <label htmlFor="filter-capacity" className="block text-xs font-semibold text-muted mb-1 uppercase">
              Capacidad minima
            </label>
            <input
              id="filter-capacity"
              type="number"
              min={1}
              value={filterCapacity}
              onChange={(e) => setFilterCapacity(e.target.value)}
              placeholder="Ej: 20"
              className="w-full px-3 py-2 rounded-input border border-border bg-page text-text text-sm focus:ring-2 focus:ring-brand-300 outline-none"
            />
          </div>

          <div>
            <label htmlFor="filter-resource" className="block text-xs font-semibold text-muted mb-1 uppercase">
              Recurso requerido
            </label>
            <select
              id="filter-resource"
              value={filterResource}
              onChange={(e) => setFilterResource(e.target.value)}
              className="w-full px-3 py-2 rounded-input border border-border bg-page text-text text-sm focus:ring-2 focus:ring-brand-300 outline-none"
            >
              <option value="">Cualquiera</option>
              {allResources.map((r) => (
                <option key={r} value={r}>{r}</option>
              ))}
            </select>
          </div>
        </div>

        {hasFilters && (
          <button
            onClick={() => { setFilterType(''); setFilterBuilding(''); setFilterCapacity(''); setFilterResource(''); }}
            className="mt-3 text-xs text-brand-600 hover:underline focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-300"
          >
            Limpiar filtros
          </button>
        )}
      </section>

      {/* Resultados */}
      {filtered.length === 0 ? (
        <StateMessage
          type="empty"
          title="Sin resultados"
          description="No hay espacios que coincidan con los filtros seleccionados."
          actionText="Limpiar filtros"
          onAction={() => { setFilterType(''); setFilterBuilding(''); setFilterCapacity(''); setFilterResource(''); }}
        />
      ) : (
        <>
          <p className="text-sm text-muted mb-4">
            {filtered.length} espacio{filtered.length !== 1 ? 's' : ''} encontrado{filtered.length !== 1 ? 's' : ''}
          </p>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {filtered.map((space) => (
              <article
                key={space.id}
                onClick={() => navigate(`/spaces/${space.id}`)}
                onKeyDown={(e) => e.key === 'Enter' && navigate(`/spaces/${space.id}`)}
                tabIndex={0}
                role="button"
                aria-label={`Ver detalle de ${space.name}`}
                className="border border-border bg-surface rounded-card p-5 shadow-card hover:shadow-pop hover:scale-[1.02] transition-all cursor-pointer focus-visible:ring-2 focus-visible:ring-brand-400 outline-none"
              >
                <div className="flex items-start justify-between gap-2 mb-2">
                  <h2 className="text-lg font-semibold text-text">{space.name}</h2>
                  <Badge variant="primary">{typeLabels[space.type]}</Badge>
                </div>

                <div className="space-y-1 text-sm text-muted mb-3">
                  <p className="flex items-center gap-1">
                    <FiMapPin aria-hidden="true" size={13} /> {space.building}
                  </p>
                  <p className="flex items-center gap-1">
                    <FiUsers aria-hidden="true" size={13} /> {space.capacity} personas
                  </p>
                </div>

                {space.resources.length > 0 && (
                  <div className="flex flex-wrap gap-1">
                    {space.resources.slice(0, 3).map((r) => (
                      <Badge key={r} variant="info" className="text-xs">{r}</Badge>
                    ))}
                    {space.resources.length > 3 && (
                      <Badge variant="info" className="text-xs">+{space.resources.length - 3}</Badge>
                    )}
                  </div>
                )}

                {space.requiresApproval && (
                  <p className="text-xs text-warning-600 mt-2 font-semibold">Requiere aprobacion</p>
                )}
              </article>
            ))}
          </div>
        </>
      )}
    </main>
  );
}
