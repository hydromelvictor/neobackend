import { Router } from 'express';
import LeadController from '../../controllers/holding/lead.controllers';
import auth from '../../middleware/auth.middleware';
import permission from '../../middleware/permission.middleware';
import uploads from '../../middleware/upload.middleware';

const router = Router();
const Controller = new LeadController();

router.post(
    '/',
    Controller.REGISTER.bind(Controller)
)

router.post(
    '/login/:id',
    Controller.LOGIN.bind(Controller)
)

router.get(
    '/:id',
    auth,
    permission('READ_LEAD'),
    Controller.GET.bind(Controller)
)

router.get(
    '/',
    auth,
    permission('LIST_LEAD'),
    Controller.SEARCH.bind(Controller)
)

router.put(
    '/:id',
    auth,
    permission('UPDATE_LEAD'),
    uploads.single('picture'),
    Controller.UPDATE.bind(Controller)
)

router.delete(
    '/remove/:id',
    auth,
    permission('DELETE_LEAD'),
    Controller.REMOVE.bind(Controller)
)

router.get(
    '/stats/lead',
    auth,
    permission('READ_LEAD'),
    Controller.SIZE.bind(Controller)
)

export default router;