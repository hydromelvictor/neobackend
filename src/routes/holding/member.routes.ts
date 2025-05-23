import { Router } from 'express';
import MemberController from '../../controllers/holding/member.controllers';
import auth from '../../middleware/auth.middleware';
import permission from '../../middleware/permission.middleware';

const router = Router();
const Controller = new MemberController();

router.post(
    '/',
    Controller.REGISTER.bind(Controller)
)

router.post(
    '/add-member',
    auth,
    Controller.REGISTER.bind(Controller)
)

router.post(
    '/login',
    Controller.LOGIN.bind(Controller)
)

router.get(
    '/:id',
    auth,
    permission('READ_MEMBER'),
    Controller.GET.bind(Controller)
)

router.get(
    '/',
    auth,
    permission('LIST_MEMBER'),
    Controller.SEARCH.bind(Controller)
)

router.put(
    '/:id',
    auth,
    permission('UPDATE_MEMBER'),
    Controller.UPDATE.bind(Controller)
)

router.delete(
    '/:id',
    auth,
    permission('DELETE_MEMBER'),
    Controller.REMOVE.bind(Controller)
)

router.get(
    '/stats/member',
    auth,
    permission('READ_MEMBER'),
    Controller.SIZE.bind(Controller)
)

export default router;