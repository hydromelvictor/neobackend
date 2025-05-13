// import { Request, Response, Router } from 'express';
// import AdminService from '../../service/holding/admin.service'


// class AdminController {
//     private adminService: AdminService;

//     constructor() {
//         this.adminService = new AdminService();
//     }

//     // Étape 1 : Inscription par email (envoi du lien de confirmation)
//     async signUpEmailStep(req: Request, res: Response) {
//         try {
//             await this.adminService.signUpEmailStep(req.body);
//             return res.status(200).send();
//         }  catch (error) {
//             if (error instanceof Error) {
//                 return res.status(400).json({ message: error.message });
//             } else {
//                 // Si l'erreur n'est pas une instance d'Error, retournez une erreur générique
//                 return res.status(400).json({ message: 'Une erreur inconnue est survenue.' });
//             }
//         }
//     }

//     // Étape 2 : Finalisation de l'inscription (validation du token)
//     async signUpStepEnd(req: Request, res: Response) {
//         try {
//             const admin = await this.adminService.signUpStepEnd(req.params.token);
//             return res.status(200).json({ content: admin });
//         } catch (error) {
//             if (error instanceof Error) {
//                 return res.status(400).json({ message: error.message });
//             } else {
//                 // Si l'erreur n'est pas une instance d'Error, retournez une erreur générique
//                 return res.status(400).json({ message: 'Une erreur inconnue est survenue.' });
//             }
//         }
//     }

//     // Étape 3 : Connexion par email (envoi du code de vérification)
//     async loginEmailStep(req: Request, res: Response) {
//         try {
//             await this.adminService.loginEmailStep(req.body.email);
//             return res.status(200).send();
//         } catch (error) {
//             if (error instanceof Error) {
//                 return res.status(400).json({ message: error.message });
//             } else {
//                 // Si l'erreur n'est pas une instance d'Error, retournez une erreur générique
//                 return res.status(400).json({ message: 'Une erreur inconnue est survenue.' });
//             }
//         }
//     }

//     // Étape 4 : Finalisation de la connexion (validation du code)
//     async loginStepEnd(req: Request, res: Response) {
//         try {
//             const result = await this.adminService.loginStepEnd(req.body.code);
//             return res.status(200).json({ message: 'Connexion réussie', result });
//         } catch (error) {
//             if (error instanceof Error) {
//                 return res.status(400).json({ message: error.message });
//             } else {
//                 // Si l'erreur n'est pas une instance d'Error, retournez une erreur générique
//                 return res.status(400).json({ message: 'Une erreur inconnue est survenue.' });
//             }
//         }
//     }
// }

// export default AdminController;
