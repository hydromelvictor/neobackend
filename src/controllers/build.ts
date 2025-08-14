import { Types } from "mongoose";
import Neo from "../models/users/neo.models"
import Product from "../models/marketing/product.models";
import Room from "../models/network/discussion.models";
import axios from 'axios';


const builder = async (ai: string | Types.ObjectId, message: any, room: string | Types.ObjectId) => {
    try {
        const neo = await Neo.findById(ai);
        if (!neo) throw new Error('not found');

        const products = await Product.find({ assign: ai, online: true }).populate('bonus');
        const prds = products.map(prd => {
            const bonus = prd.bonus.map((b: any)  => {
                `
                ID: ${b._id}
                NOM: ${b.name}
                DESCRIPTION: ${b.description}
                CATEGORY: ${b.description}
                STOCK: ${b.stock}
                MEDIAS: ${b.media}
                BRAND: ${b.brand}
                FEATURES: ${b.features}
                SIZES: ${b.sizes}
                COLORS: ${b.colors}
                `
            })
            return  `
                ID: ${prd._id}
                NOM: ${prd.name}
                DESCRIPTION: ${prd.description}
                CATEGORY: ${prd.description}
                PRICE RANGE: ${prd.price} XOF
                STOCK: ${prd.stock}
                MEDIAS: ${prd.media}
                BRAND: ${prd.brand}
                FEATURES: ${prd.features}
                ADDRESS: ${prd.address}
                SIZES: ${prd.sizes}
                COLORS: ${prd.colors}
                DELIVERY: 
                    IN SAME AREA: ${prd.delivery.in}
                    OUT OF AREA: ${prd.delivery.out}
                SERVICE: ${prd.ondemand}
                WARRANTY: ${prd.warranty}
                BONUS: ${bonus}
            `
        })
        const conversation = await Room.findById(room);
        if (!conversation) throw new Error('not found');

        const memory: any = []

        const prompt =  `
            Tu es ${neo.fullname} un agent commercial.
            Ta responsabilité: ${neo.responsability}.
            Ta mission: ${neo.mission}.
            Ton contexte: ${neo.context}.
            Ta version: ${neo.version}.

            Tes produits: ${prds}
            Voici le message du client: ${message}.
            Réponds de manière professionnelle et amicale, uniquement à partir des informations fournies.
        `

        memory.push({ role: "user", content: prompt });

        const apiKey = process.env.GROK;

        const response = await axios.post('https://api.groq.com/openai/v1/chat/completions', {
            model: "llama3-8b-8192",
            messages: [
                ...memory.slice(-5)
            ]
        }, {
            headers: {
                'Authorization': `Bearer ${apiKey}`,
                'Content-Type': 'application/json'
            }
        });

        const parsed = JSON.parse(response.data.choices[0].message.content);
        return { role: neo.fullname, content: parsed };

    } catch (err: any) {
        return { error: "Réponse non valide JSON" };
    }
}

export default builder;
