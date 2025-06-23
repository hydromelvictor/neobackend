import { Router } from 'express';
import { authenticate, device, permissions } from '../../middleware';
import { login, logout, forgot, verify, reset, authorization } from '../../controllers/users/sign.controllers';

const router = Router();

router.post(
    '/login/:model',
    device('LOGIN'),
    login
);

router.post(
    '/logout/:model/:id',
    authenticate,
    device('LOGOUT'),
    logout
);

router.post(
    '/forgot/:model',
    device('FORGOT PASSORWD'),
    forgot
);

router.post(
    '/verify/:model',
    device('VERIFY'),
    verify
);

router.post(
    '/reset/:model/:id',
    device('RESET PASSWORD'),
    reset
);

router.post(
    '/authorization/:model/:id',
    authenticate,
    device('AUTHORIZATION'),
    permissions('AUTHORIZATION'),
    authorization
);


export default router;
