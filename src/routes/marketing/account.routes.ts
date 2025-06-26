import { Router } from 'express';
import { authenticate, device, permissions } from '../../middleware';
import AccountController from '../../controllers/marketing/account.controllers';

const router = Router();


router.get(
    '/:owner',
    authenticate,
    device('GET ACCOUNT'),
    permissions('READ-ACCOUNT'),
    AccountController.balance
);

router.get(
    '/',
    authenticate,
    device('LIST ACCOUNT'),
    permissions('LIST-ACCOUNT'),
    AccountController.list
);

router.put(
    '/:id',
    authenticate,
    device('UPDATE ACCOUNT'),
    permissions('UPDATE-ACCOUNT'),
    AccountController.update
);

router.post(
    '/assign/:id',
    authenticate,
    device('ASSIGN ACCOUNT'),
    permissions('ASSIGN-ACCOUNT'),
    AccountController.assign
);

router.post(
    '/actes',
    authenticate,
    device('ACTES ACCOUNT'),
    permissions('ACTES-ACCOUNT'),
    AccountController.actes
);

export default router;