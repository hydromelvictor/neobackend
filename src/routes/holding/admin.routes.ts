import { Router } from 'express';
import AdminController from '../../controllers/holding/admin.controllers';
import auth from '../../middleware/auth.middleware';
import permission from '../../middleware/permission.middleware';
import uploads from '../../middleware/upload.middleware';

const router = Router();
const Controller = new AdminController();


router.post(
    '/register',
    auth,
    Controller.Register.bind(Controller)
)

router.post(
    '/login',
    Controller.LoginEmail.bind(Controller)
)

router.post(
    '/connect',
    Controller.LoginPass.bind(Controller)
)

router.get(
    '/:id',
    auth,
    permission('READ_ADMIN'),
    Controller.GET.bind(Controller)
)

router.get(
    '/',
    auth,
    permission('LIST_ADMIN'),
    Controller.SEARCH.bind(Controller)
)

router.put(
    '/:id',
    auth,
    permission('UPDATE_ADMIN'),
    uploads.single('picture'),
    Controller.UPDATE.bind(Controller)
)

router.post(
    '/new-email',
    auth,
    permission('UPDATE_ADMIN'),
    Controller.CheckEmailForUpdate.bind(Controller)
)

router.put(
    '/save-email',
    auth,
    permission('UPDATE_ADMIN'),
    Controller.UpdateEmail.bind(Controller)
)

router.post(
    '/recovery',
    Controller.RECOVERY.bind(Controller)
)

router.delete(
    '/remove/:id',
    auth,
    permission('DELETE_ADMIN'),
    Controller.REMOVE.bind(Controller)
)

router.get(
    '/stats/admin',
    auth,
    permission('READ_ADMIN'),
    Controller.SIZE.bind(Controller)
)

export default router;