import { Router } from 'express';
import { authenticate, device, permissions } from '../../middleware';
import StatusController from '../../controllers/associate/status.controllers';

const router = Router();

router.post(
    '/:id',
    authenticate,
    device('CREATE STATUS'),
    permissions('CREATE-STATUS'),
    StatusController.create
);

export default router;
