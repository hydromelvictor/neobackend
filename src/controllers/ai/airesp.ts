import { Request, Response } from 'express';
import { buildPrompt } from '../../service/ia/builder.service';


const aiResponse = async (req: Request, res: Response) => {
    try {
        const { agentId, message, discussion } = req.body;
        const response = await buildPrompt({ agentId, message, discussion });
        res.status(200).json(response);
    } catch (error) {
        if (error instanceof Error) {
            res.status(400).json({ message: error.message });
        } else {
             // Si l'erreur n'est pas une instance d'Error, retournez une erreur générique
            res.status(400).json({ message: 'Une erreur inconnue est survenue.' });
        }
    }
}

export default aiResponse;
