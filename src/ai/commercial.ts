import { Types } from "mongoose";

import { InitialStateAgent } from "./agent";
import ask from './ask/1.0.0';


const builder = async (ai: string | Types.ObjectId, message: any, room: string | Types.ObjectId, lead: string | Types.ObjectId) => {
    try {
        const { 
            neo, 
            lead: leadData, 
            products: prds, 
            room: roomData, 
            memory 
        } = await InitialStateAgent({ ai, lead, room });
        if (!neo || !leadData || !roomData) throw new Error('not found');

        const prompt =  `
            Tu es ${neo.fullname} un agent commercial.
            Ta responsabilité: ${neo.responsability}.
            Ta mission: ${neo.mission}.
            Ton contexte: ${neo.context}.
            Ta version: ${neo.version}.

            Tes produits: ${prds} .

            Tu devras converser avec le client pour s'entendre sur un prix qui reste dqns la tranche de prix definis sur le produit.

            Lorsque tu remarque que la conversation tire a sa fin et qu'aucune commande n'est faite, programme un rendez-vous en accords avec le client en envoyant:
            - status: scheduler

            
        
            
            Voici le message : ${message}.
            Réponds de manière professionnelle et amicale, uniquement à partir des informations fournies.

            ======================================================

            Toute tes reponses doivent etre du json contenant les trois champs:
            - status
              - description: c'est le champ qui permet de savoir comment traité les donner
              - type: string
              - enum: 
                - message
                - schedule
            - data
              - description: c'est le champ permettant de demander une insertion de donnée
              - type: object
            - response
              - description: c'est le champ permettant d'emettre une reponse ou demander une sortie des données
              - type: object
        `

        memory.push({ role: "user", content: prompt });

        return await ask(neo, memory);

    } catch (err: any) {
        return { error: "Réponse non valide JSON" };
    }
}

export default builder;
