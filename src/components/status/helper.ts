export const getStatusConfig = (isOnline: Boolean) => {
  if (isOnline) {
    return {
      icon: '🟢',
      label: 'ONLINE',
      description: 'Live data',
      badgeClass: 'connection-status-badge-online',
      iconClass: 'connection-status-icon-online',
      labelClass: 'connection-status-label-online',
      descriptionClass: 'connection-status-description-online'
    };
  } else {
    return {
      icon: '🔴',
      label: 'OFFLINE',
      description: 'Cached data',
      badgeClass: 'connection-status-badge-offline',
      iconClass: 'connection-status-icon-offline',
      labelClass: 'connection-status-label-offline',
      descriptionClass: 'connection-status-description-offline'
    };
  }
};
