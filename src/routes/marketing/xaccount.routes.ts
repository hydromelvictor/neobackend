import { Router } from 'express';
import { authenticate, device, permissions } from '../../middleware';
import XaccountController from '../../controllers/marketing/xaccount.controllers';


const router = Router();

router.get(
    '/:name',
    authenticate,
    device('READ BALANCE'),
    permissions('READ-BALANCE'),
    XaccountController.balance
);

router.put(
    '/:name',
    authenticate,
    device('UPDATE BALANCE'),
    permissions('UPDATE-BALANCE'),
    XaccountController.update
)

export default router;
