import { Router } from 'express';
import { authenticate, device, permissions, uploads, exams } from '../../middleware';
import AdminController from '../../controllers/users/admin.controllers';

const router = Router();

router.post(
    '/',
    device('SAVE DATA'),
    permissions('ADMIN-SAVE-DATA'),
    AdminController.signUp
);

router.post(
    '/sign',
    device('EXAM DATA'),
    AdminController.SignEmail
);

router.post(
    '/verify',
    device('EXAM DATA'),
    AdminController.loadin
);

router.get(
    '/:id',
    authenticate,
    device('READ DATA'),
    permissions('READ-ADMIN'),
    AdminController.retrieve
)

router.get(
    '/',
    authenticate,
    device('LIST DATA'),
    permissions('LIST-ADMIN'),
    AdminController.list
);

router.put(
    '/:id',
    authenticate,
    device('UPDATE DATA'),
    permissions('UPDATE-ADMIN'),
    uploads.single('picture'),
    exams('picture'),
    AdminController.update
);

router.delete(
    '/:id',
    authenticate,
    device('DELETE DATA'),
    permissions('DELETE-ADMIN'),
    AdminController.delete
);

router.get(
    '/stats/count',
    authenticate,
    device('COUNT DATA'),
    permissions('COUNT-ADMIN'),
    AdminController.count
);

export default router;
