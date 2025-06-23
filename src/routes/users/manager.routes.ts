import { Router } from 'express';
import { authenticate, device, permissions, validateInput, uploads, exams } from '../../middleware';
import { TmanCreate, TmanUpdate } from '../../types/manager';
import ManagerController from '../../controllers/users/manager.controllers';

const router = Router();


router.post(
    '/',
    device('EXAM DATA'),
    validateInput(TmanCreate, ['firstname', 'lastname', 'email', 'phone', 'position']),
    ManagerController.load
);

router.post(
    '/register',
    device('SAVE DATA'),
    ManagerController.signup
);

router.post(
    '/password/:id',
    device('CHANGE PASSWORD'),
    validateInput(TmanUpdate, ['password']),
    ManagerController.password
);

router.get(
    '/:id',
    authenticate,
    device('GET MANAGER'),
    permissions('READ-MANAGER'), 
    ManagerController.retrieve
);

router.get(
    '/',
    authenticate,
    device('LIST MANAGER'),
    permissions('LIST-MANAGER'), 
    ManagerController.list
);

router.put(
    '/:id',
    authenticate,
    device('MIS A JOUR MANAGER'),
    permissions('UPDATE-MANAGER'),
    uploads.single('picture'),
    exams('picture'),
    validateInput(TmanUpdate, []),
    ManagerController.update
);

router.delete(
    '/:id',
    authenticate,
    device('DELETE MANAGER'),
    permissions('DELETE-MANAGER'),
    ManagerController.delete
);

router.get(
    '/stats/count',
    authenticate,
    device('COUNT MANAGER'),
    permissions('COUNT-MANAGER'), 
    ManagerController.count
);

export default router;
