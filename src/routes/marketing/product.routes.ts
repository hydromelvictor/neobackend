import { Router } from 'express';
import { authenticate, device, permissions, validateInput, uploads, exams } from '../../middleware';
import ProductController from '../../controllers/marketing/product.controllers';
import { TprdCreate, TprdUpdate } from '../../types/product';


const router = Router();

router.post(
    '/:id',
    authenticate,
    device('CREATE PRODUCT'),
    permissions('CREATE-PRODUCT'),
    validateInput(TprdCreate, ['org', 'name', 'description', 'price', 'stock', 'category', 'media', 'brand', 'features', 'address', 'sizes', 'colors', 'delivery', 'ondemand', 'warranty']),
    uploads.array('media', 10),
    exams('media'),
    ProductController.register
)

router.get(
    '/:id',
    authenticate,
    device('READ PRODUCT'),
    permissions('READ-PRODUCT'),
    ProductController.retrieve
)

router.get(
    '/',
    authenticate,
    device('LIST PRODUCT'),
    permissions('LIST-PRODUCT'),
    ProductController.list
)

router.put(
    '/:id',
    authenticate,
    device('UPDATE PRODUCT'),
    permissions('UPDATE-PRODUCT'),
    validateInput(TprdUpdate, []),
    uploads.array('media', 10),
    exams('media'),
    ProductController.update
)

router.delete(
    '/:id',
    authenticate,
    device('DELETE PRODUCT'),
    permissions('DELETE-PRODUCT'),
    ProductController.delete
)

router.get(
    '/stats/count',
    authenticate,
    device('COUNT PRODUCT'),
    permissions('COUNT-PRODUCT'),
    ProductController.count
)

export default router;
