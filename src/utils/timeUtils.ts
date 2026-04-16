export function formatTimeInState(isoDate: string): string {
  const now = Date.now();
  const then = new Date(isoDate).getTime();
  const diffMs = now - then;

  const minutes = Math.floor(diffMs / 60000);
  const hours = Math.floor(minutes / 60);
  const remainingMinutes = minutes % 60;

  if (hours > 0) {
    return `${hours}h ${remainingMinutes.toString().padStart(2, '0')}m`;
  }
  return `${minutes}m`;
}

export type EscalationTier = 'none' | 'warn' | 'urgent' | 'critical';

/** Returns escalation tier based on how long a card has been in its current state */
export function getEscalationTier(isoDate: string): EscalationTier {
  const now = Date.now();
  const then = new Date(isoDate).getTime();
  const diffMin = (now - then) / 60000;

  if (diffMin >= 180) return 'critical';  // > 3 hours
  if (diffMin >= 60) return 'urgent';     // > 1 hour
  if (diffMin >= 30) return 'warn';       // > 30 minutes
  return 'none';
}
