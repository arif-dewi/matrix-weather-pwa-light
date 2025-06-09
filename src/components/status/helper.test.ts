import { describe, it, expect } from 'vitest';
import { getStatusConfig } from './helper';

describe('getStatusConfig', () => {
  it('should return online config when isOnline is true', () => {
    const config = getStatusConfig(true);

    expect(config).toEqual({
      icon: '🟢',
      label: 'ONLINE',
      description: 'Live data',
      badgeClass: 'connection-status-badge-online',
      iconClass: 'connection-status-icon-online',
      labelClass: 'connection-status-label-online',
      descriptionClass: 'connection-status-description-online'
    });
  });

  it('should return offline config when isOnline is false', () => {
    const config = getStatusConfig(false);

    expect(config).toEqual({
      icon: '🔴',
      label: 'OFFLINE',
      description: 'Cached data',
      badgeClass: 'connection-status-badge-offline',
      iconClass: 'connection-status-icon-offline',
      labelClass: 'connection-status-label-offline',
      descriptionClass: 'connection-status-description-offline'
    });
  });
});
