import { Router } from 'express';
import { authenticate, device, permissions, validateInput, uploads, exams } from '../../middleware';
import { TemCreate, TemUpdate } from '../../types/employee';
import EmployeeContorller from '../../controllers/users/employee.controllers';

const router = Router();

router.post(
    '/',
    device('SAVE DATA'),
    validateInput(TemCreate, ['org', 'fullname', 'email', 'password', 'phone']),
    EmployeeContorller.signUp
);

router.get(
    '/:id',
    authenticate,
    device('READ DATA'),
    permissions('READ-EMPLOYEE'),
    EmployeeContorller.retrieve
);

router.get(
    '/',
    authenticate,
    device('LIST DATA'),
    permissions('LIST-EMPLOYEE'),
    EmployeeContorller.list
);

router.put(
    '/:id',
    authenticate,
    device('UPDATE DATA'),
    permissions('UPDATE-EMPLOYEE'),
    uploads.single('picture'),
    exams('picture'),
    validateInput(TemUpdate, []),
    EmployeeContorller.update
)

router.delete(
    '/:id',
    authenticate,
    device('DELETE DATA'),
    permissions('DELETE-EMPLOYEE'),
    EmployeeContorller.delete
);

router.get(
    '/stats/count',
    authenticate,
    device('COUNT DATA'),
    permissions('COUNT-EMPLOYEE'),
    EmployeeContorller.count
);

export default router;
