import { Router } from 'express';
import { authenticate, device, permissions, uploads, exams } from '../../middleware';
import { uploading, downlaoding, deleting } from '../../controllers/network/rooms.controllers';

const router = Router();

router.post(
    '/:id',
    authenticate,
    device('SAVE ATTACHMENT'),
    permissions('SAVE-ATTACHMENT'),
    uploads.array('attachs', 10),
    exams('attachs'),
    uploading
);

router.get(
    '/:id',
    authenticate,
    device('DOWNLOAD ATTACHMENT'),
    permissions('DOWNLOAD-ATTACHMENT'),
    downlaoding
);

router.delete(
    '/:id',
    authenticate,
    device('DELETE ATTACHMENT'),
    permissions('DELETE-ATTACHMENT'),
    deleting
);

export default router;
