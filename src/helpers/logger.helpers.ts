// src/utils/logger.ts
import { createLogger, format, transports } from 'winston';
import path from 'path';

// Définition du format de log
const logFormat = format.combine(
  format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
  format.printf(({ level, message, timestamp }) => {
    return `[${timestamp}] ${level.toUpperCase()}: ${message}`;
  })
);

// Création du logger
const logger = createLogger({
  level: 'info', // niveaux : error, warn, info, verbose, debug, silly
  format: logFormat,
  transports: [
    // Affichage dans la console
    new transports.Console(),
    // Enregistrement dans un fichier
    new transports.File({ filename: path.join('logs', 'app.log') }),
  ],
});

export default logger;
