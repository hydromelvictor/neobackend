import dotenv from 'dotenv'

dotenv.config();

import EventEmitter from "events";
import { OneUseToken } from './helpers/codecs.helpers';
import Admin from './models/holding/admin.models';
import { Authorization } from './utils/authorize.utils';

class ServerEvents extends EventEmitter {}

export const serverEvents = new ServerEvents();


const admin = {
    firstname: 'neo-admin',
    lastname: 'II',
    phone: '00225-000',
    email: 'support@neo.com',
    cni: 'neo-cni',
    position: 'System',
    authority: true,
    recovery: OneUseToken(),
    authorization: Authorization
}


const init = async () => {
    try {
        const exist = await Admin.findOne({ phone: admin.phone });
        if (!exist) {
            const d = new Admin(admin);
            await d.save();

            console.log('super admin created successfull')
        }
    } catch (error) {
        console.log('Une erreur inconnue est survenue.');
    }
}

export default init;