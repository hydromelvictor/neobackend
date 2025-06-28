import { Router } from 'express';
import { authenticate, device, permissions, uploads, exams } from '../../middleware';
import LeadController from '../../controllers/users/lead.controllers';

const router = Router();

router.get(
    '/:id',
    authenticate,
    device('READ LEAD'),
    permissions('READ-LEAD'),
    LeadController.retrieve
);

router.get(
    '/',
    authenticate,
    device('LIST LEAD'),
    permissions('LIST-LEAD'),
    LeadController.list
);

router.put(
    '/:id',
    authenticate,
    device('UPDATE LEAD'),
    permissions('UPDATE-LEAD'),
    uploads.single('picture'),
    exams('picture'),
    LeadController.update
);

router.get(
    '/stats/count',
    authenticate,
    device('COUNT LEAD'),
    permissions('COUNT-LEAD'),
    LeadController.count
);

export default router;
