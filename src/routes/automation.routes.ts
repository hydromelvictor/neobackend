import { Router } from 'express';
import { device } from '../middleware';
import RelanceController from '../controllers/automation.controllers';

const router = Router();

router.post(
    '/:id',
    device('CREATE RELANCE'),
    RelanceController.create
);

router.get(
    '/:id',
    device('READ RELANCE'),
    RelanceController.retrieve
);

router.get(
    '/',
    device('LIST RELANCE'),
    RelanceController.list
);

router.delete(
    '/:id',
    device('DELETE RELANCE'),
    RelanceController.delete
);

router.get(
    '/stats/count',
    device('COUNT RELANCE'),
    RelanceController.count
);

router.put(
    '/:id',
    device('UPDATE RELANCE'),
    RelanceController.update
);

router.post(
    '/stop',
    device('STOP RELANCE'),
    RelanceController.stop
);

export default router;