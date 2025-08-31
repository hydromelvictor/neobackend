import { Router } from 'express';
import { authenticate, device, permissions } from '../../middleware';
import { login, logout, forgot, verify, reset, authorization, refresh_token } from '../../controllers/users/sign.controllers';

const router = Router();

router.post(
    '/login/:model',
    device('LOGIN'),
    login
);

router.post(
    '/logout/:model',
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

router.post(
    '/refresh',
    device('REFRESH TOKEN'),
    refresh_token
);


export default router;
