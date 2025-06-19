import { Types } from 'mongoose';
import Agent from '../../models/ia/agent.models';
import Product from '../../models/market/product.models';
import Sms from '../../models/network/message.models';
import Attach from '../../models/network/attachment.models';
import Reaction from '../../models/network/reaction.models';
import axios from 'axios';

interface BuildPromptOptions {
    agentId: string | Types.ObjectId;
    message: string;
    discussion: string | Types.ObjectId;
}

interface MemoryMessage {
    role: 'assistant' | 'user';
    content: string;
    attachments?: string[];
    reactions?: string[];
}

export async function buildPrompt({ agentId, message, discussion }: BuildPromptOptions): Promise<string> {
    const agent = await Agent.findById(agentId).populate('resources');
    if (!agent) return 'Agent introuvable.';

    const products = await Product.find({ assign: agentId }).populate('bonus');
    const messages = await Sms.find({ discussion }).sort({ createdAt: 1 });

    const memory: MemoryMessage[] = [];

    for (const sms of messages) {
        const [attachments, reactions] = await Promise.all([
            Attach.find({ message: sms._id }),
            Reaction.find({ message: sms._id }),
        ]);

        memory.push({
            role: sms.hote.equals(agent.org) ? 'assistant' : 'user',
            content: sms.content,
            attachments: attachments.map(a => `${a.type}: ${a.path}`),
            reactions: reactions.map(r => `${r.emoji.symbole} (${r.emoji.name})`)
        });
    }

    const productDescriptions = products.map(product => {
        const bonusList = product.bonus.map((b: any) => `- ${b.name} (${b.price?.min}–${b.price?.max} F)`);
        
        return `
            Nom: ${product.name}
            Description: ${product.description}
            Prix de vente: ${product.price.max} XOF
            Prix minimal apres reduction: ${product.price.min} XOF
            Stock: ${product.stock}
            Catégorie: ${product.category}
            Marque: ${product.brand}
            Caractéristiques: ${product.features.join('\n  ')}
            Taille(s): ${product.sizes.join(', ')}
            Couleur(s): ${product.colors.join(', ')}
            Livraison: ${product.delivery.service} (Ville: ${product.delivery.internal} XOF, Hors-ville: ${product.delivery.external} XOF)
            Garantie: ${product.warranty}
            Adresse: ${product.address}
            Bonus: ${bonusList.join('\n')}
        `.trim();
    }).join('\n\n');

    const memoryMessages = memory.map(m => {
        return `[${
            m.role === 'assistant' ? agent.fullname : 'Client'
        }]: ${m.content}${
            m.attachments?.length ? `\nPièces jointes: ${m.attachments.join(', ')}` : ''
        }${
            m.reactions?.length ? `\nRéactions: ${m.reactions.join(', ')}` : ''
        }`;
    }).join('\n');

    const prompt = `
        Tu es ${agent.fullname}, ${agent.responsability}.
        Ta mission est : ${agent.mission}.
        Contexte : ${agent.context}.
        Tâches assignées : ${agent.task.join(', ')}.

        Produits à promouvoir : ${productDescriptions}

        Tu a la responsabilité de convaincre le client pour un prix entre le prix de vente et le prix minimal apres reduction.

        Historique de la discussion : ${memoryMessages}

        Message client : ${message}

        Réponds de manière professionnelle et amicale en te basant uniquement sur les informations mis a ta dispositions.
    `.trim();

    const response = await axios.post('http://localhost:11434/api/generate', {
        model: 'mixtral', // ou 'llama3', 'mistral', etc.
        prompt: prompt,
        stream: false
    });

    return response.data.response;
}
