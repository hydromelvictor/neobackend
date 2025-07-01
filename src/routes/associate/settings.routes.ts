import { Router } from 'express';
import { authenticate, device, permissions } from '../../middleware';
import SettingsController from '../../controllers/associate/settings.controllers';

const router = Router();

router.get(
    '/:id',
    authenticate,
    device('READ SETTINGS'),
    permissions('READ-SETTINGS'),
    SettingsController.retrieve
);

router.get(
    '/',
    authenticate,
    device('LIST SETTINGS'),
    permissions('LIST-SETTINGS'),
    SettingsController.list
)

router.put(
    '/:id',
    authenticate,
    device('UPDATE SETTINGS'),
    permissions('UPDATE-SETTINGS'),
    SettingsController.update
)

router.delete(
    '/:id',
    authenticate,
    device('DELETE SETTINGS'),
    permissions('DELETE-SETTINGS'),
    SettingsController.delete
)

export default router;
