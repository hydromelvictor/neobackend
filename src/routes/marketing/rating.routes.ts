import { Router } from 'express';
import { authenticate, device, permissions } from '../../middleware';
import RatingController from '../../controllers/marketing/rating.controllers';

const router = Router();

router.post(
    '/',
    authenticate,
    device('CREATE RATING'),
    permissions('CREATE-RATING'),
    RatingController.register
);

router.get(
    '/:id',
    authenticate,
    device('READ RATING'),
    permissions('READ-RATING'),
    RatingController.retrieve
);

router.get(
    '/product/:id',
    authenticate,
    device('READ RATING PRODUCT'),
    permissions('READ-RATING-PRODUCT'),
    RatingController.retrieveProduct
)

router.get(
    '/',
    authenticate,
    device('LIST RATING'),
    permissions('LIST-RATING'),
    RatingController.list
);

router.get(
    '/stats/count',
    authenticate,
    device('COUNT RATING'),
    permissions('COUNT-RATING'),
    RatingController.count
);

export default router;