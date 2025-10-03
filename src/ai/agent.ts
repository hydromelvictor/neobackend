import Neo from '../models/users/neo.models';
import Lead from '../models/users/lead.models';
import Org from '../models/associate/org.models';

import Product from '../models/marketing/product.models';

import Room from '../models/network/discussion.models';
import Sms from '../models/network/message.models';
import Attach from '../models/network/attachment.models';
import Reaction from '../models/network/reaction.models';

import Meet from '../models/automation/meet.models';
import Automate from '../automate';
import builder from './commercial';



const InitialStateAgent = async (data: any) => {

    // l'agent neo associé à cette conversation
    const neo = data.ai ? await Neo.findById(data.ai) : null;
    if (!neo) throw new Error('not found');

    // le lead associé à cette conversation
    const lead = data.lead ? await Lead.findById(data.lead) : null;
    if (!lead) throw new Error('not found');

    // les produits de l'agent neo
    const products = await Product.find({ assign: neo._id, online: true }).populate('bonus');
    const prds = products.map(prd => {
        const bonus = prd.bonus.map((b: any)  => {
            `
            ID: ${b._id}
            NOM: ${b.name}
            DESCRIPTION: ${b.description}
            CATEGORY: ${b.description}
            STOCK: ${b.stock}
            MEDIAS: http://${process.env.HOST}:${process.env.PORT}/uploads/${b.media}
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
            MEDIAS: http://${process.env.HOST}:${process.env.PORT}/uploads/${prd.media}
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

    // les derniers messages de la conversation
    const room = data.room ? await Room.findById(data.room) : null;
    if (!room) throw new Error('not found');

    const sms = await Sms.find({ room: room._id }).sort({ createdAt: -1 }).limit(20);

    const memory: any = []

    for (const m of sms) {
        const hote = await Lead.findById(m.hote) || await Org.findById(m.hote);
        if (!hote) continue;

        const atts = await Attach.find({ message: m._id });
        const reacts = await Reaction.find({ message: m._id });

        memory.push({
            role: hote.model.name === 'Org' ? `${neo.fullname}` : 'user',
            content: `
                MESSAGE: ${m.state === 'text' ? m.content : ''}
                ATTACHMENTS: ${atts.length > 0 ? atts.map(a => `
                    PATH: http://${process.env.HOST}:${process.env.PORT}/uploads/${a.path}
                    TYPE: ${a.type}
                `).join('\n') : ''}
                REACTIONS: ${reacts.length > 0 ? reacts.map(r => `${r.emoji.name} (${r.emoji.symbole})`).join('\n') : ''}
            `
        })
    }

    memory.reverse();

    return {
        neo,
        lead,
        products: prds,
        room,
        memory
    }
}


const Schedule = async (data: any) => {
    // programmer une relance
    const assign = data.assign ? await Neo.findById(data.assign) : null;
    if (!assign) throw new Error('not found');

    const lead = data.lead ? await Lead.findById(data.lead) : null;
    if (!lead) throw new Error('not found');

    const room = data.room ? await Room.findById(data.room) : null;
    if (!room) throw new Error('not found');

    // créer le rendez-vous
    const meet = new Meet({
        title: data.title,
        assign: data.assign,
        lead: data.lead,
        // dans 2 semaines
        moment: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000),
        room: data.room
    });
    await meet.save();
    
    await Automate.addJob(`meet-${meet._id}`, `${meet.moment.getMinutes()} ${meet.moment.getHours()} ${meet.moment.getDate()} ${meet.moment.getMonth() + 1} *`, async () => {
        // demander a neo de recontacter le lead
        const relance = builder(
            meet.assign,
            `Tu as prevue une relance avec le lead ${meet.lead}". C'est maintenant.`,
            data.room,
            data.lead
        );
        console.log(`C'est l'heure de la réunion: ${meet.title} avec le lead ${meet.lead}`);
        meet.current = false;
        await meet.save();
        return relance;
    })

    return meet;
}

export {
    InitialStateAgent,
    Schedule
}
