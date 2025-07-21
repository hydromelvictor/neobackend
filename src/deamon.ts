import dotenv from 'dotenv'

dotenv.config();

import EventEmitter from "events";
import { OneUseToken } from './helpers/codecs.helpers';
import Admin from './models/users/admin.models'
import Rate from './models/automation/rate.models';
import Xaccount from './models/marketing/critical.models';
import axios from 'axios';


class ServerEvents extends EventEmitter {}

export const serverEvents = new ServerEvents();


const admin = {
    firstname: 'neo-admin',
    lastname: 'II',
    phone: '00225-000',
    email: 'support@neo.com',
    cni: 'neo-cni',
    position: 'System',
    recovery: OneUseToken(),
    authorization: []
}

const xcc = {
    name: 'system'
}


const init = async () => {
    try {
        const exist = await Admin.findOne({ phone: admin.phone });
        if (!exist) {
            const d = new Admin(admin);
            await d.save();

            console.log('super admin created successfull')
        }

        const x = await Xaccount.findOne({ name: xcc.name });
        if (!x) {
            await Xaccount.create({ name: 'system' });
            console.log('systm account create');
        }

        const rates = await Rate.find({ base: 'XOF' });
        if (!rates || !rates.length) {
            const { data } = await axios.get('https://api.exchangerate.host/latest?base=XOF');
            for (const [target, rate] of Object.entries(data.rates)) {
                const now = new Date();
                await Rate.create({
                    base: data.base,
                    target,
                    rate,
                    provider: 'exchangerate.host',
                    fetchedAt: now
                });
            }
        }
    } catch (error) {
        console.log('Une erreur inconnue est survenue.');
    }
}

export default init;