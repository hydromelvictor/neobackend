import { Router } from 'express';
import { authenticate, device, permissions, validateInput } from '../../middleware';
import { TordCreate, TordUpdate } from '../../types/order';
import OrderController from '../../controllers/marketing/order.controllers';

const router = Router();

router.post(
    '/',
    authenticate,
    device('CREATE ORDER'),
    permissions('CREATE-ORDER'),
    validateInput(TordCreate, ['items']),
    OrderController.register
);

router.get(
    '/:id',
    authenticate,
    device('READ ORDER'),
    permissions('READ-ORDER'),
    OrderController.retrieve
);

router.get(
    '/',
    authenticate,
    device('LIST ORDER'),
    permissions('LIST-ORDER'),
    OrderController.list
);

router.put(
    '/:id',
    authenticate,
    device('UPDATE ORDER'),
    permissions('UPDATE-ORDER'),
    validateInput(TordUpdate, []),
    OrderController.update
);

router.delete(
    '/:id',
    authenticate,
    device('DELETE ORDER'),
    permissions('DELETE-ORDER'),
    OrderController.delete
);

router.get(
    '/stats/count',
    authenticate,
    device('COUNT ORDER'),
    permissions('COUNT-ORDER'),
    OrderController.count
);

export default router