import { Router } from 'express';
import { authenticate, device, permissions, validateInput, uploads, exams } from '../../middleware';
import { TrefCreate, TrefUpdate } from '../../types/referer';
import RefererController from '../../controllers/users/referer.controllers';

const router = Router();

router.post(
    '/',
    device('EXAM DATA'),
    validateInput(TrefCreate, ['fullname', 'email', 'position', 'country', 'city', 'phone']),
    RefererController.load
);

router.post(
    '/register',
    device('SAVE DATA'),
    RefererController.signUp
);

router.post(
    '/password/:id',
    device('CHANGE PASSWORD'),
    validateInput(TrefUpdate, ['password']),
    RefererController.password
);

router.get(
    '/:id',
    authenticate,
    device('GET REFERER'),
    permissions('READ-REFERER'),
    RefererController.retrieve
);

router.get(
    '/',
    authenticate,
    device('LIST REFERER'),
    permissions('LIST-REFERER'),
    RefererController.list
);

router.put(
    '/:id',
    authenticate,
    device('MIS A JOUR REFERER'),
    permissions('UPDATE-REFERER'),
    uploads.single('picture'),
    exams('picture'),
    validateInput(TrefUpdate, []),
    RefererController.update
);

router.delete(
    '/:id',
    authenticate,
    device('DELETE REFERER'),
    permissions('DELETE-REFERER'),
    RefererController.delete
);

router.get(
    '/stats/count',
    authenticate,
    device('COUNT REFERER'),
    permissions('COUNT-REFERER'),
    RefererController.count
);

export default router;
