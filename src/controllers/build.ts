import { Types } from "mongoose";
import Neo from "../models/users/neo.models"
import Product from "../models/marketing/product.models";
import Room from "../models/network/discussion.models";


const builder = async (ai: string | Types.ObjectId, message: string, room: string | Types.ObjectId) => {
    try {
        const neo = await Neo.findById(ai);
        if (!neo) throw new Error('not found');

        const products = await Product.find({ assign: ai, online: true }).populate('bonus');
        const prds = products.map(prd => {
            const bonus = prd.bonus.map((b: any)  => {
                `
                NOM: ${b.name}
                DESCRIPTION: ${b.description}
                CATEGORY: ${b.description}
                MEDIAS: ${b.media}
                
                `
            })
        })
        const conversation = await Room.findById(room);
        if (!conversation) throw new Error('not found');

        const memory: any = []

    } catch (err: any) {
        
    }
}
