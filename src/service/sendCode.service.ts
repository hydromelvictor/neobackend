import { addToBlacklist } from "../helpers/codecs.helpers"
import gmail from "../helpers/gmail.helpers";
import { sending } from '../helpers/html.helpers';

import Member from "../models/holding/member.models";
import Mentor from '../models/holding/mentor.models';
import Admin from '../models/holding/admin.models';

const sendCode = async (email: string): Promise<boolean> => {
    const instance = await Member.findOne({ email }) || await Mentor.findOne({ email }) || await Admin.findOne({ email });
    if (!instance) throw new Error('not found');

    const username = instance.firstname && instance.lastname ;
    const code = addToBlacklist(instance._id.toString());
    await gmail(
        email,
        'CODE DE VERIFICATION',
        sending(username, code)
    )

    return true;
}

export default sendCode;
