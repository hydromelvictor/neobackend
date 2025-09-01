import dotenv from 'dotenv'

dotenv.config();

import EventEmitter from "events";
import { OneUseToken } from './helpers/codecs.helpers';
import Admin from './models/users/admin.models'
import Rate from './models/automation/rate.models';
import Account from './models/marketing/account.models';
import axios from 'axios';


class ServerEvents extends EventEmitter {}

export const serverEvents = new ServerEvents();


const _admin = {
    firstname: 'neo-admin',
    lastname: 'II',
    phone: '00225-000',
    email: 'support@neo.com',
    cni: 'neo-cni',
    position: 'System',
    recovery: OneUseToken(),
    authorization: [
        'READ-ORG',
        'LIST-ORG',
        'UPDATE-ORG',
        'DELETE-ORG',
        'COUNT-ORG',

        'READ-SETTINGS',
        'LIST-SETTINGS',
        'UPDATE-SETTINGS',
        'DELETE-SETTINGS',

        'CREATE-STATUS',

        'CREATE-SUB-ACCOUNT',
        'LIST-SUB-ACCOUNT',
        'READ-ACCOUNT',
        'LIST-ACCOUNT',
        'DEPOSIT-ACCOUNT',
        'WITHDRAW-ACCOUNT',
        'PAY-ACCOUNT',
        'REFUND-ACCOUNT',

        'READ-TRACKING',
        'LIST-TRACKING',

        'CREATE-ORDER',
        'READ-ORDER',
        'LIST-ORDER',
        'UPDATE-ORDER',
        'DELETE-ORDER',
        'COUNT-ORDER',

        'CREATE-PRODUCT',
        'READ-PRODUCT',
        'LIST-PRODUCT',
        'UPDATE-PRODUCT',
        'DELETE-PRODUCT',
        'COUNT-PRODUCT',

        'CREATE-RATING',
        'READ-RATING',
        'READ-RATING-PRODUCT',
        'LIST-RATING',
        'COUNT-RATING',

        'READ-BALANCE',
        'UPDATE-BALANCE',

        'SAVE-ATTACHMENT',
        'DOWNLOAD-ATTACHMENT',
        'DELETE-ATTACHMENT',

        'CREATE-OTP',
        'VERIFY-OTP',
        'CREATE-ONE-TOKEN',
        'READ-HEALTH',
        'DELETE-OTP',
        'READ-OTP',
        'READ-BLACKLIST',
        'READ-BLACKLIST',
        'DELETE-BLACKLIST',
        'DELETE-BLACKLIST',
        'STOP-BLACKLIST',

        'ADMIN-SAVE-DATA',
        'READ-ADMIN',
        'LIST-ADMIN',
        'UPDATE-ADMIN',
        'DELETE-ADMIN',
        'COUNT-ADMIN',

        'READ-EMPLOYEE',
        'LIST-EMPLOYEE',
        'UPDATE-EMPLOYEE',
        'DELETE-EMPLOYEE',
        'COUNT-EMPLOYEE',

        'READ-LEAD',
        'LIST-LEAD',
        'UPDATE-LEAD',
        'COUNT-LEAD',

        'READ-MANAGER',
        'LIST-MANAGER',
        'UPDATE-MANAGER',
        'DELETE-MANAGER',
        'COUNT-MANAGER',

        'SAVE-NEO',
        'READ-NEO',
        'LIST-NEO',
        'UPDATE-NEO',
        'DELETE-NEO',
        'COUNT-NEO',

        'READ-REFERER',
        'LIST-REFERER',
        'UPDATE-REFERER',
        'DELETE-REFERER',
        'COUNT-REFERER',

        'AUTHORIZATION',

        'READ-RELANCE',
        'LIST-RELANCE',
        'DELETE-RELANCE',
        'COUNT-RELANCE',
        'UPDATE-RELANCE',
        'STOP-RELANCE',
    ]
}

const acc = {
    name: 'system'
}


const init = async () => {
    try {
        let admin = await Admin.findOne({ phone: _admin.phone });
        if (!admin) {
            admin = new Admin(_admin);
            await admin.save();

            console.log('super admin created successfull')
        }

        let account = await Account.findOne({ name: acc.name });
        if (!account) {
            account = await Account.create({
                owner: admin._id,
                name: 'system',
                main: true,
                currency: 'XOF',
                balance: 0
            });
            console.log('system account create');
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