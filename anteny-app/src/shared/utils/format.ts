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
