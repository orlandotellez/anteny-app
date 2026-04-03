// Extrae el username del user_id de Matrix
// Ej: "@orlando:example.com" → "orlando"
export const getUsernameFromUserId = (userId: string): string => {
  if (!userId) return '';
  // Quita el "@" y toma lo que está antes del ":"
  return userId.replace(/^@/, '').split(':')[0];
};
