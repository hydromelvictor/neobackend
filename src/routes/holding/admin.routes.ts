// import { Router, Request, Response } from 'express';
// import AdminController from '../../controllers/holding.controllers/admin.controllers';

// const router = Router();
// const adminController = new AdminController();

// // Route pour l'inscription par email
// router.post(
//     '/signup', 
//     async (req: Request, res: Response) => {
//         await adminController.signUpEmailStep(req, res);
//     }
// );

// // Route pour la finalisation de l'inscription
// router.get(
//     '/verify/:token', 
//     async (req: Request, res: Response) => {
//         await adminController.signUpStepEnd(req, res);
//     }
// );

// // Route pour la demande de connexion par email
// router.post(
//     '/login', 
//     async (req: Request, res: Response) => {
//         await adminController.loginEmailStep(req, res);
//     }
// );

// // Route pour finaliser la connexion avec un code
// router.post(
//     '/checked', 
//     async (req: Request, res: Response) => {
//         await adminController.loginStepEnd(req, res);
//     }
// );

// export default router;
