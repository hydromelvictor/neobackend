import { Router } from 'express';
import OrgController from '../../controllers/holding/org.controllers';
import auth from '../../middleware/auth.middleware';
import permission from '../../middleware/permission.middleware';
import uploads from '../../middleware/upload.middleware';

const router = Router();
const Controller = new OrgController();


router.post(
    '/load',
    Controller.LOAD.bind(Controller)
)

router.post(
    '/register',
    Controller.REGISTER.bind(Controller)
)

router.get(
    '/:id',
    auth,
    permission('READ_ORG'),
    Controller.GET.bind(Controller)
)

router.get(
    '/',
    auth,
    permission('LIST_ORG'),
    Controller.SEARCH.bind(Controller)
)

router.put(
    '/:id',
    auth,
    permission('UPDATE_ORG'),
    uploads.single('picture'),
    Controller.UPDATE.bind(Controller)
)

router.delete(
    '/:id',
    auth,
    permission('DELETE_ORG'),
    Controller.REMOVE.bind(Controller)
)

router.get(
    '/stats/org',
    auth,
    permission('READ_ORG'),
    Controller.SIZE.bind(Controller)
)

export default router;
