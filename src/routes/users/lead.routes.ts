import { Router } from 'express';
import { authenticate, device, permissions, validateInput, uploads, exams } from '../../middleware';
import LeadController from '../../controllers/users/lead.controllers';

const router = Router();

router.get(
    '/:id',
    device('READ LEAD'),
    permissions('READ-LEAD'),
    LeadController.retrieve
);

router.get(
    '/',
    device('LIST LEAD'),
    permissions('LIST-LEAD'),
    LeadController.list
);

router.put(
    '/:id',
    device('UPDATE LEAD'),
    permissions('UPDATE-LEAD'),
    LeadController.update
);

router.get(
    '/stats/count',
    device('COUNT LEAD'),
    permissions('COUNT-LEAD'),
    LeadController.count
);

export default router;
