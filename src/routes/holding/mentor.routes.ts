import { Router } from 'express';
import MentorController from '../../controllers/holding/mentor.controllers';

import auth from '../../middleware/auth.middleware';
import permission from '../../middleware/permission.middleware';

const router = Router();
const Controller = new MentorController();


router.post(
    '/load', 
    Controller.LOAD.bind(Controller)
)

router.post(
    '/register',
    Controller.REGISTER.bind(Controller)
)

router.post(
    '/add-password/:id',
    Controller.AddPassword.bind(Controller)
)

router.post(
    '/login',
    Controller.LOGIN.bind(Controller)
)

router.put(
    '/update',
    auth,
    permission('UPDATE_MENTOR'),
    Controller.UPDATE.bind(Controller)
)

router.get(
    '/:id', 
    auth,
    permission('READ_MENTOR'),
    Controller.GET.bind(Controller)
)

router.get(
    '/', 
    auth,
    permission('LIST_MENTOR'),
    Controller.SEARCH.bind(Controller)
)

router.delete(
    '/:id',
    auth,
    permission('DELETE_MENTOR'),
    Controller.REMOVE.bind(Controller)
)

router.get(
    '/stats/mentor',
    auth,
    permission('READ_MENTOR'),
    Controller.SIZE.bind(Controller)
)

export default router;
