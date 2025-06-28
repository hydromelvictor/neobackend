import { Router } from 'express';
import { authenticate, device, permissions } from '../../middleware';
import TrackingController from '../../controllers/marketing/invoice.controllers';

const router = Router();

router.get(
    '/:id',
    authenticate,
    device('READ TRACKING'),
    permissions('READ-TRACKING'),
    TrackingController.retrieve
);

router.get(
    '/',
    authenticate,
    device('LIST TRACKING'),
    permissions('LIST-TRACKING'),
    TrackingController.list
)

export default router;
