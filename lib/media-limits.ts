/** Formats et tailles acceptés par le backoffice (partagés entre le navigateur et le serveur). */

export const IMAGE_TYPES = ['image/webp', 'image/jpeg', 'image/png'];
export const VIDEO_TYPES = ['video/mp4', 'video/quicktime', 'video/webm'];

/** Les photos sont réduites dans le navigateur avant l'envoi */
export const MAX_IMAGE_BYTES = 4 * 1024 * 1024;
/** Vidéos envoyées telles quelles : une vidéo légère se charge plus vite chez les visiteurs */
export const MAX_VIDEO_BYTES = 100 * 1024 * 1024;
