import type { User } from '../../types';

type Props = {
  user: User;
};

export default function NoShowStatus({ user }: Props) {
  const maxNoShows = 2;
  const isBlocked = user.isBlocked;
  const noShowPercentage = (user.noShowCount / maxNoShows) * 100;

  return (
    <div className="rounded-card border border-border bg-surface p-4">
      {/* Status Indicator */}
      <div className="flex items-center justify-between mb-3">
        <div>
          <p className="text-sm font-semibold text-text">Estado de No-Show</p>
          <p className="text-xs text-muted">
            {user.noShowCount}/{maxNoShows} ausencias
          </p>
        </div>
        <div
          className={`text-sm font-bold px-3 py-1 rounded-full ${
            isBlocked
              ? 'bg-danger-100 text-danger-700'
              : user.noShowCount >= maxNoShows
                ? 'bg-warning-100 text-warning-700'
                : 'bg-success-100 text-success-700'
          }`}
        >
          {isBlocked ? '🚫 Bloqueado' : user.noShowCount >= maxNoShows ? '⚠️ En riesgo' : '✅ Activo'}
        </div>
      </div>

      {/* Progress Bar */}
      <div className="w-full bg-border rounded-full h-2 overflow-hidden">
        <div
          className={`h-full transition-all ${
            noShowPercentage >= 100
              ? 'bg-danger-600'
              : noShowPercentage >= 50
                ? 'bg-warning-600'
                : 'bg-success-600'
          }`}
          style={{ width: `${Math.min(noShowPercentage, 100)}%` }}
        />
      </div>

      {/* Info Message */}
      {isBlocked && user.blockedUntil && (
        <p className="text-xs text-danger-700 mt-3 bg-danger-50 p-2 rounded">
          📅 Bloqueado hasta: {new Date(user.blockedUntil).toLocaleDateString('es-ES')}
        </p>
      )}

      {user.noShowCount >= maxNoShows && !isBlocked && (
        <p className="text-xs text-warning-700 mt-3 bg-warning-50 p-2 rounded">
          ⚠️ Próximo no-show resultará en bloqueo de 7 días
        </p>
      )}
    </div>
  );
}