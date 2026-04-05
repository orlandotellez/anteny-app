// Extrae el username del user_id de Matrix
// Ej: "@orlando:example.com" → "orlando"
export const getUsernameFromUserId = (userId: string): string => {
  if (!userId) return '';
  // Quita el "@" y toma lo que está antes del ":"
  return userId.replace(/^@/, '').split(':')[0];
};

// Genera un color basado en el nombre (para avatar)
export const getColorFromName = (name: string): string => {
  if (!name) return '#333';
  
  const colors = [
    '#FF6B6B', // Red
    '#4ECDC4', // Teal
    '#45B7D1', // Blue
    '#96CEB4', // Green
    '#FFEAA7', // Yellow
    '#DDA0DD', // Plum
    '#98D8C8', // Mint
    '#F7DC6F', // Gold
    '#BB8FCE', // Purple
    '#85C1E9', // Light Blue
  ];
  
  // Sumar los códigos ASCII de los caracteres
  let sum = 0;
  for (let i = 0; i < name.length; i++) {
    sum += name.charCodeAt(i);
  }
  
  return colors[sum % colors.length];
};

// Formatea un timestamp a una cadena relativa (ej: "5m", "1h", "Ayer")
export const formatRelativeTime = (timestamp: number | undefined): string => {
  if (!timestamp) return '';
  
  const now = Date.now();
  const diff = now - timestamp;
  
  const minutes = Math.floor(diff / 60000);
  const hours = Math.floor(diff / 3600000);
  const days = Math.floor(diff / 86400000);
  
  if (minutes < 1) return 'now';
  if (minutes < 60) return `${minutes}m`;
  if (hours < 24) return `${hours}h`;
  if (days === 1) return 'Yesterday';
  if (days < 7) return `${days}d`;
  
  // Si es más de una semana, mostrar fecha
  const date = new Date(timestamp);
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
};
