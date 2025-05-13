import { Router } from 'express';
import MentorController from '../../controllers/holding.controllers/mentor.controllers';
import anonymous from '../../middleware/anonymous.middleware';
import auth from '../../middleware/auth.middleware';

const router = Router();
const mentor = new MentorController();


router.post(
    '/register', 
    mentor.register.bind(mentor)
)
router.post(
    '/checked',
    mentor.checked.bind(mentor)
)
router.post(
    '/add-password', 
    anonymous,
    mentor.addPassword.bind(mentor)
)
router.post(
    '/login',
    mentor.login.bind(mentor)
)
router.get(
    '/refer-click',
    auth,
    mentor.referClick.bind(mentor)
)
router.put(
    '/update',
    auth,
    mentor.update.bind(mentor)
)
router.get(
    '/:id', 
    auth,
    mentor.get.bind(mentor)
)
router.get(
    '/', 
    auth,
    mentor.get.bind(mentor)
)
router.post(
    '/forgot',
    mentor.forgot.bind(mentor)
)
router.post(
    '/verify',
    mentor.verify.bind(mentor)
)
router.get(
    '/reset/:id',
    mentor.reset.bind(mentor)
)
router.post(
    '/logout',
    auth,
    mentor.logout.bind(mentor)
)

export default router;

