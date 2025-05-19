import mongoose from "mongoose";
import { addToBlacklist } from "../helpers/codecs.helpers"
import gmail from "../helpers/gmail.helpers";
import { sending } from '../helpers/html.helpers';


const sendCode = async (email: string, model: string): Promise<boolean> => {
    const instance = await mongoose.model(model).findOne({ email });
    if (!instance) throw new Error('not found');

    const username = instance.firstname && instance.lastname 
    ? `${instance.firstname} ${instance.lastname}` : instance.reason;

    const code = addToBlacklist(instance._id);
    await gmail(
        email,
        'CODE DE VERIFICATION',
        sending(username, code)
    )

    return true;
}

export default sendCode;