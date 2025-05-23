import { Router } from 'express';
import Others from '../controllers/other.controllers';
import auth from '../middleware/auth.middleware';

const router = Router();
const Controller = new Others();

router.post(
    '/authorization',
    auth,
    Controller.AUTH.bind(Controller)
)

router.post(
    '/logout',
    auth,
    Controller.LOGOUT.bind(Controller)
)

router.post(
    '/send',
    Controller.SEND.bind(Controller)
)

router.post(
    '/verify',
    Controller.VERIFY.bind(Controller)
)

router.post(
    '/reset',
    Controller.RESET.bind(Controller)
)

export default router;