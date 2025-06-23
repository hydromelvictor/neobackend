import { Router } from 'express';
import { authenticate, device, permissions, validateInput, uploads, exams } from '../../middleware';
import { TorgCreate, TorgUpdate } from '../../types/org';
import OrgController from '../../controllers/associate/org.controllers';

const router = Router();


router.post(
    '/register',
    device('SAVE DATA'),
    validateInput(TorgCreate, ['reason', 'manager', 'social', 'country', 'state', 'address', 'location', 'phone', 'email', 'sector', 'service']),
    OrgController.register
);

router.get(
    '/:id',
    authenticate,
    device('GET ORG'),
    permissions('READ-ORG'), 
    OrgController.retrieve
);

router.get(
    '/',
    authenticate,
    device('LIST ORG'),
    permissions('LIST-ORG'), 
    OrgController.list
);

router.put(
    '/:id',
    authenticate,
    device('MIS A JOUR ORG'),
    permissions('UPDATE-ORG'),
    uploads.single('picture'),
    exams('picture'),
    validateInput(TorgUpdate, []),
    OrgController.update
);

router.delete(
    '/:id',
    authenticate,
    device('DELETE ORG'),
    permissions('DELETE-ORG'),
    OrgController.delete
);

router.get(
    '/stats/count',
    authenticate,
    device('COUNT ORG'),
    permissions('COUNT-ORG'), 
    OrgController.count
);

export default router;
