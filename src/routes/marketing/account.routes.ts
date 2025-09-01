import { Router } from 'express';
import { authenticate, device, permissions } from '../../middleware';
import AccountController from '../../controllers/marketing/account.controllers';

const router = Router();

router.post(
    '/:id',
    authenticate,
    device('CREATE SUB ACCOUNT'),
    permissions('CREATE-SUB-ACCOUNT'),
    AccountController.create
);

router.get(
    '/me',
    authenticate,
    device('GET ACCOUNT'),
    permissions('READ-ACCOUNT'),
    AccountController.balance
);

router.get(
    '/me/:id',
    authenticate,
    device('GET ACCOUNT BY ORG'),
    permissions('READ-ACCOUNT'),
    AccountController.balance
);

router.get(
    '/',
    authenticate,
    device('LIST ACCOUNT'),
    permissions('LIST-ACCOUNT'),
    AccountController.list
);

router.get(
    '/sub-accounts',
    authenticate,
    device('LIST SUB ACCOUNT'),
    permissions('LIST-SUB-ACCOUNT'),
    AccountController.subAccounts
);

router.post(
    '/connect/deposit',
    authenticate,
    device('DEPOSIT ACCOUNT'),
    permissions('DEPOSIT-ACCOUNT'),
    AccountController.deposit
);

router.post(
    '/connect/deposit/:id',
    authenticate,
    device('DEPOSIT ACCOUNT'),
    permissions('DEPOSIT-ACCOUNT'),
    AccountController.deposit
);

router.post(
    '/connect/withdraw',
    authenticate,
    device('WITHDRAW ACCOUNT'),
    permissions('WITHDRAW-ACCOUNT'),
    AccountController.withdraw
);

router.post(
    '/connect/withdraw/:id',
    authenticate,
    device('WITHDRAW ACCOUNT'),
    permissions('WITHDRAW-ACCOUNT'),
    AccountController.withdraw
);

router.post(
    '/connect/pay',
    authenticate,
    device('PAY ACCOUNT'),
    permissions('PAY-ACCOUNT'),
    AccountController.pay
);

router.post(
    '/connect/pay/:id',
    authenticate,
    device('PAY ACCOUNT'),
    permissions('PAY-ACCOUNT'),
    AccountController.pay
);

router.post(
    '/connect/refund/:id',
    authenticate,
    device('REFUND ACCOUNT'),
    permissions('REFUND-ACCOUNT'),
    AccountController.refund
);

export default router;