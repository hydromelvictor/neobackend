import multer, { FileFilterCallback } from 'multer';
import path from 'path';
import { Request } from 'express';

const storage = multer.diskStorage({
  destination: function (_req: Request, _file: Express.Multer.File, cb) {
    cb(null, 'uploads/');
  },
  filename: (req: Request, file, cb) => {
    const uniqueName = Date.now() + path.extname(file.originalname);
    
    if (!req.body) req.body = {};
    req.body.picture = path.join('uploads', uniqueName);

    cb(null, uniqueName);
  },
});

const fileFilter = (
  _req: Request,
  file: Express.Multer.File,
  cb: FileFilterCallback
): void => {
  const allowedTypes = [
    // Images
    'image/jpeg', 'image/png', 'image/gif', 'image/webp', 'image/svg+xml', 'image/bmp', 'image/tiff',

    // Documents
    'application/pdf', 'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'application/vnd.ms-excel',
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    'application/vnd.ms-powerpoint',
    'application/vnd.openxmlformats-officedocument.presentationml.presentation',
    'text/plain', 'application/rtf',

    // Archives & Compressed files
    'application/zip', 'application/x-rar-compressed',
    'application/x-7z-compressed', 'application/x-tar',

    // Vidéos
    'video/mp4', 'video/x-msvideo', 'video/x-matroska',
    'video/webm', 'video/quicktime',

    // Audios
    'audio/mpeg', 'audio/ogg', 'audio/wav', 'audio/aac', 'audio/webm'
  ];

  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Type de fichier non supporté'));
  }
};

const uploads = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: { fileSize: 1024 * 1024 * 10 } // 10MB
});

export default uploads;
