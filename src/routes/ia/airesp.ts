import { Router } from 'express';
import aiResponse from '../../controllers/ai/airesp';

const router = Router();

router.post('/', aiResponse);

export default router;
