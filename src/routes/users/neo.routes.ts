import { Router } from 'express';
import { authenticate, device, permissions, validateInput, uploads, exams } from '../../middleware';
import { TneoCreate, TneoUpdate } from '../../types/ia';
import NeoController from '../../controllers/users/neo.controllers';

const router = Router();

router.post(
    '/',
    authenticate,
    device('SAVE NEO'),
    permissions('SAVE-NEO'),
    validateInput(TneoCreate, ['org', 'fullname', 'responsability', 'sex', 'mission', 'context', 'task']),
    NeoController.register
);

router.get(
    '/:id',
    authenticate,
    device('READ NEO'),
    permissions('READ-NEO'),
    NeoController.retrieve
);

router.get(
    '/',
    authenticate,
    device('LIST NEO'),
    permissions('LIST-NEO'),
    NeoController.list
);

router.put(
    '/:id',
    authenticate,
    device('UPDATE NEO'),
    permissions('UPDATE-NEO'),
    validateInput(TneoUpdate, []),
    uploads.single('picture'),
    exams('picture'),
    NeoController.update
);


router.delete(
    '/:id',
    authenticate,
    device('DELETE NEO'),
    permissions('DELETE-NEO'),
    NeoController.delete
);

router.get(
    '/stats/count',
    authenticate,
    device('COUNT NEO'),
    permissions('COUNT-NEO'),
    NeoController.count
);

export default router