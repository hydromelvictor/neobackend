import { Router, Request, Response } from 'express';
import OrgController from '../../controllers/holding.controllers/org.controllers';

const router = Router();
const crtl = new OrgController();

router.post(
    '/register',
    async (req: Request, res: Response) => {
        await crtl.register(req, res);
    }
);

export default router;
