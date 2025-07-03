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

router.get(
    '/:id',
    authenticate,
    device('READ STATUS'),
    permissions('READ-STATUS'),
    StatusController.retrieve
);

router.get(
    '/',
    authenticate,
    device('LIST STATUS'),
    permissions('LIST-STATUS'),
    StatusController.list
);

router.delete(
    '/:id',
    authenticate,
    device('DELETE STATUS'),
    permissions('DELETE-STATUS'),
    StatusController.delete
);

router.get(
    '/stats/count',
    authenticate,
    device('COUNT STATUS'),
    permissions('COUNT-STATUS'),
    StatusController.count
);

export default router;
